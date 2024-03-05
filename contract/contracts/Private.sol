

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

abstract contract PrivateZK is IPrivateZK, MerkleTreeWithHistory, ReentrancyGuard, Opcode {
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

    constructor(PrivateConfig memory _config) MerkleTreeWithHistory(_config.merkleTreeHeight, _config.hash2) {
        state = _config;
    }

    function deposit(DepositParams calldata params) external payable nonReentrant {
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
        emit Deposit(commitment, params.pk.x, params.pk.y, params.amount, index);
    }

    // function depositCC(DepositParams calldata params) public  view  returns(uint256)   {

    //     uint256[] memory hash4Params = new uint256[](4);
    //     hash4Params[0] = params.commitment;
    //     hash4Params[1] = params.pk.x;
    //     hash4Params[2] = params.pk.y;
    //     hash4Params[3] = params.amount;
    //     uint256 commitment = IHasher(state.hash4).poseidon(hash4Params);
    //     return  commitment;

    // }

    function _beforeDeposit(DepositParams calldata) internal virtual;

    // function _afterDeposit(uint256) internal virtual returns (uint256);

    function withdraw(WithdrawParams calldata params) external payable nonReentrant {
        if(nullifierHashes[params.nullifierHash]) revert NodeAlreadySpent();
        if(!isKnownRoot(params.root)) revert MissingRoot();
        // require(!nullifierHashes[params.nullifierHash], "The virtual node has been already spent");
        // require(isKnownRoot(params.root), "Cannot find your merkle root"); // Make sure to use a recent one
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
}