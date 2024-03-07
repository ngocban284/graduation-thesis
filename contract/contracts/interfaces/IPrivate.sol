// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IPrivateZK {
    struct PrivateConfig {
        address verifier;
        address committee;
        address router;
        address hash2;
        address hash4;
        uint32 merkleTreeHeight;
    }

    struct BabyJubPoint {
        uint256 x;
        uint256 y;
    }

    struct DepositParams {
        uint256 commitment;
        BabyJubPoint pk;
        uint256 amount;
    }

    struct WithdrawParams {
        bytes proof;
        uint256 root;
        uint256 nullifierHash;
        uint256 lead;
        uint256 amount;
        address payable recipient;
        address payable relayer;
        uint256 fee;
        uint256 faceVectorHash;
        bytes reedSolomonProof;
        uint256[] publicSignals; 
    }
    // uint256 _refund
}
