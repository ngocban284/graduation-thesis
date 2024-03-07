// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IGroth16Verifier {
    function verifyProof(
        uint256[2] memory _a,
        uint256[2][2] memory _b,
        uint256[2] memory _c,
        uint256[22] calldata _pubSignals
    ) external view returns (bool);

    function verifyProof(
        uint256[2] memory _a,
        uint256[2][2] memory _b,
        uint256[2] memory _c,
        uint256[23] calldata _pubSignals
    ) external view returns (bool);

    function verifyProof(
        uint256[2] memory _a,
        uint256[2][2] memory _b,
        uint256[2] memory _c,
        uint256[9] calldata _pubSignals
    ) external view returns (bool);

    function verifyProof(
        uint256[2] memory _a,
        uint256[2][2] memory _b,
        uint256[2] memory _c,
        uint256[3] calldata _pubSignals
    ) external view returns (bool);
}

interface IVerifier {
    function verifyProof(uint8 opcode, bytes calldata proof, uint256[] calldata publicInputs)
        external
        view
        returns (bool);
    function publicInputsLength(uint8 _opcode) external view returns (uint8);
}
