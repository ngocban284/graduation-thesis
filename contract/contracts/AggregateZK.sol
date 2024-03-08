

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MerkleTreeWithHistory.sol";
import "./libs/ReentrancyGuard.sol";
import "./libs/Math.sol";
import "./DKG.sol";
import "./interfaces/IDKG.sol";
import "./interfaces/IVerifier.sol";
import "./interfaces/IPrivate.sol";
import "./interfaces/IHasher.sol";
import "./Opcode.sol";
import "./FuzzyCommitment.sol";

abstract contract AggregateZK is IPrivateZK, MerkleTreeWithHistory, ReentrancyGuard, Opcode {
    FuzzyCommitment private fuzzyCommitment;

    // private zk
    PrivateConfig public state;
    mapping(uint256 => bool) public nullifierHashes;
    mapping(uint256 => address) public leads;
    mapping(uint256 => bool) public commitments;

    error CommitmentFailure();
    error MissingRoot();
    error NodeAlreadySpent();
    error InvalidProof();
    event Deposit(uint256 indexed commitment, uint256 pkx, uint256 pky, uint256 amount, uint32 leafIndex);
    event Withdrawal(address to, uint256 nullifierHash, uint256 lead, uint256 amount, address indexed relayer);

    // reed solomon
    mapping (address=>string) public faceCommitments;
    mapping (address=>uint256) private faceVectorHashes;
    mapping (address => bool) private faceRegistered;
    mapping (address=>uint256) private hashOfPersonalInfoHashes;
    mapping (uint256 => uint256 ) private faceVectorHashtoRemainAmount;
    mapping (uint256 => bool) private usedNullifierHash;

    event RecoveryRegistered(address indexed owner, uint256 featureVectorHash);
    event WalletRecovered(address indexed oldOwner,address indexed newOwner, uint256 nullifierHash, uint256 amount);

    constructor(PrivateConfig memory _config) MerkleTreeWithHistory(_config.merkleTreeHeight, _config.hash2)  {
        state = _config;
        fuzzyCommitment = new FuzzyCommitment(_config.verifier);
    }

    function deposit(DepositParams calldata params) external payable nonReentrant {
        require(faceRegistered[msg.sender], "Not have identity regitry");
        _beforeDeposit(params);
        uint256[] memory hash4Params = new uint256[](4);
        hash4Params[0] = params.commitment;
        hash4Params[1] = params.pk.x;
        hash4Params[2] = params.pk.y;
        hash4Params[3] = params.amount;
        uint256 commitment = IHasher(state.hash4).poseidon(hash4Params);
        if(commitments[commitment]) revert CommitmentFailure();
        // require(!commitments[commitment], "The commitment has been submitted");
        uint32 index = _insert(commitment);
        commitments[commitment] = true;

        faceVectorHashtoRemainAmount[faceVectorHashes[msg.sender]] = params.amount;
        emit Deposit(commitment, params.pk.x, params.pk.y, params.amount, index);
    }


    function _beforeDeposit(DepositParams calldata) internal virtual;

    // function _afterDeposit(uint256) internal virtual returns (uint256);

    function withdraw(WithdrawParams calldata params) external payable nonReentrant {
        require(faceVectorHashtoRemainAmount[params.faceVectorHash] > 0, "Remain amoun invalid");
        require(IVerifier(state.verifier).verifyProof(OPCODE_RECOVERY, params.reedSolomonProof, params.publicSignals), "Invalid proof");
        if(nullifierHashes[params.nullifierHash]) revert NodeAlreadySpent();
        if(!isKnownRoot(params.root)) revert MissingRoot();

        uint256[] memory publicInputs = new uint256[](
            IVerifier(state.verifier).publicInputsLength(OPCODE_WITHDRAW)
        );
        publicInputs[0] = params.root;
        publicInputs[1] = params.nullifierHash;
        publicInputs[2] = params.lead;
        publicInputs[3] = params.amount;
        (publicInputs[4], publicInputs[5]) = DKG(state.committee).PK_COMMITTEE();
        publicInputs[6] = uint256(uint160(address(params.recipient)));
        publicInputs[7] = uint256(uint160(address(params.relayer)));
        publicInputs[8] = params.fee;

        if(!IVerifier(state.verifier).verifyProof(OPCODE_WITHDRAW, params.proof, publicInputs)) revert InvalidProof();
        // require(IVerifier(config.verifier).verifyProof(OPCODE_WITHDRAW, params.proof, publicInputs));
        nullifierHashes[params.nullifierHash] = true;
        leads[params.lead] = msg.sender;

        faceVectorHashtoRemainAmount[params.faceVectorHash] =  faceVectorHashtoRemainAmount[params.faceVectorHash] - params.amount;

        _afterWithdraw(params);
        emit Withdrawal(params.recipient, params.nullifierHash, params.lead, params.amount, params.relayer);
    }

    // function _beforeWithdraw(WithdrawParams calldata) internal virtual;

    /**
     * @dev this function is defined in a child contract
     */
    function _afterWithdraw(WithdrawParams calldata) internal virtual;

    /**
     * @dev whether a note is already spent
     */
    function isSpent(uint256 _nullifierHash) public view returns (bool) {
        return nullifierHashes[_nullifierHash];
    }

    /**
     * @dev whether an array of notes is already spent
     */
    function isSpentArray(uint256[] calldata _nullifierHashes) external view returns (bool[] memory spent) {
        spent = new bool[](_nullifierHashes.length);
        for (uint256 i = 0; i < _nullifierHashes.length; i++) {
            if (isSpent(_nullifierHashes[i])) {
                spent[i] = true;
            }
        }
    }


    // reed solomon logic
   function registerForRecovery(uint256 _featureVectorHash, uint256 _hashOfPersonalInfoHash, string memory _commitment) public returns(bool){
        require(!faceRegistered[msg.sender], "Wallet already registered!");
        faceVectorHashes[msg.sender] = _featureVectorHash;

        hashOfPersonalInfoHashes[msg.sender] = _hashOfPersonalInfoHash;

        faceCommitments[msg.sender] = _commitment;

        faceRegistered[msg.sender] = true;

        emit RecoveryRegistered(msg.sender, _featureVectorHash);
        return true;
    }

    function recoverWallet(bytes memory proofs, uint256[] memory _input,address _wallet) public returns(bool){
        require(faceRegistered[_wallet], "Wallet not registered for recovery");
        require(IVerifier(state.verifier).verifyProof(OPCODE_RECOVERY, proofs, _input), "Invalid proof");
        require(_input[0] == faceVectorHashes[_wallet], "Invalid feature vector hash");
        require(_input[2] == hashOfPersonalInfoHashes[_wallet], "Invalid hash of personal info hash");
        require(!usedNullifierHash[_input[1]], "Nullifier hash already used");
        usedNullifierHash[_input[1]] = true;

        uint256 amount = faceVectorHashtoRemainAmount[faceVectorHashes[_wallet]] ;

        faceVectorHashtoRemainAmount[faceVectorHashes[_wallet]]  = 0;

        // send eth to new owner
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        // return eth to the new owner
        emit WalletRecovered(_wallet,msg.sender, _input[1], amount);
        return true;
    }

    

}