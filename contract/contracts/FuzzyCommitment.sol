// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Opcode.sol";
import "./interfaces/IVerifier.sol";

contract FuzzyCommitment is Opcode {
    IVerifier private verifier;

    uint256 private featureVectorHash;
    uint256 private hashOfPersonalInfoHash;
    mapping (uint256 => bool) private usedNullifierHash;
    uint256[128] private commitment;

    address private verifierAddress;

    mapping (address=>uint256[128]) private faceCommitments;
    mapping (address=>uint256) private faceVectorHashes;
    mapping (address => bool) private faceRegistered;
    mapping (address=>uint256) private hashOfPersonalInfoHashes;

    event RecoveryRegistered(address indexed owner, uint256 featureVectorHash);
    event WalletRecovered(address indexed oldOwner,address indexed newOwner, uint256 nullifierHash, uint256 amount);


    constructor(address _verifierAddress){
        verifier = IVerifier(_verifierAddress);
    }
 
    function registerForRecovery(uint256 _featureVectorHash, uint256 _hashOfPersonalInfoHash, uint256[128] memory _commitment) public returns(bool){

        faceVectorHashes[msg.sender] = _featureVectorHash;

        hashOfPersonalInfoHashes[msg.sender] = _hashOfPersonalInfoHash;

        faceCommitments[msg.sender] = _commitment;

        faceRegistered[msg.sender] = true;

        emit RecoveryRegistered(msg.sender, _featureVectorHash);
        return true;
    }

    function recoverWallet(bytes memory proofs, uint256[] memory _input,address _wallet) public returns(bool){
        require(faceRegistered[_wallet], "Wallet not registered for recovery");
        require(verifier.verifyProof(OPCODE_RECOVERY, proofs, _input), "Invalid proof");
        require(_input[0] == faceVectorHashes[_wallet], "Invalid feature vector hash");
        require(_input[2] == hashOfPersonalInfoHashes[_wallet], "Invalid hash of personal info hash");
        require(!usedNullifierHash[_input[1]], "Nullifier hash already used");
        usedNullifierHash[_input[1]] = true;
        // return eth to the new owner
        emit WalletRecovered(_wallet,msg.sender, _input[1], 1000);
        return true;
    }

    // function removeRecovery(uint256[128] memory _zeroCommitment) public returns(bool){
    //     require(msg.sender == owner, "Only owner can remove recovery");
    //     bool hasNonZeroElement=false;
    //     for(uint i = 0; i < 128; i++){
    //         if(_zeroCommitment[i] != 0){
    //             hasNonZeroElement = true;
    //             break;
    //         }   
    //     }
    //     require(hasNonZeroElement==false, "Invalid ZeroCommitment");
    //     featureVectorHash = 0;
    //     hashOfPersonalInfoHash = 0;
    //     commitment = _zeroCommitment;
    //     return true;
    // }



    function getVerifierAddress() public view returns (address) {
        return verifierAddress;
    }

    function getUsedNullifierHash(uint256 _nullifierHash) public view returns (bool) {
        return usedNullifierHash[_nullifierHash];
    }

    function getFeatureVectorHash (address _wallet) public view returns (uint256) {
        return faceVectorHashes[_wallet];
    }

    function getHashOfPersonalInfoHash (address _wallet) public view returns (uint256) {
        return hashOfPersonalInfoHashes[_wallet];
    }

    function getCommitment (address _wallet) public view returns (uint256[128] memory) {
        return faceCommitments[_wallet];
    }



}

