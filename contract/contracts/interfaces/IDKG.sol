// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IDKG {
    /**
     * Register stage for becoming a committee member.
     * Committing stage represents round 1, where vectors of secret DKG are committed.
     * Contributing stage is for round 2, where DKG contributions are made.
     * Ready stage indicates that the committee has finished the contribution phase and is ready to reveal the linking.
     */
    enum Stage {
        Register,
        Committing,
        Contributing,
        Ready
    }

    struct BabyJubPoint {
        uint256 x;
        uint256 y;
    }

    struct State {
        Stage stage;
        uint256 accumulator;
    }

    struct DKGConfig {
        uint256 T_COMMITTEE;
        uint256 N_COMMITTEE;
        address verifier;
    }

    struct Round2Params {
        uint256[] encrypted;
        bytes proof;
    }

    struct RevealParams {
        // pkAddressIn change to address after complete main contract.
        // uint256[] encrypted;
        uint256[2] pkAddressIn;
        uint256[2] D;
        bytes proof;
    }

    struct RevealState {
        uint256[2] pkAddressIn;
        uint256 accumulator;
    }
}
