// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "../interfaces/IVerifier.sol";
import "../libs/Math.sol";
import "../Opcode.sol";

contract Verifier is IVerifier, Opcode {
    mapping(uint8 => address) public verifiers;
    mapping(uint8 => uint8) internal inputsLength;

    constructor(address[3] memory _verifiers) {
        for (uint8 i = 0; i < 3; i++) {
            verifiers[i + 1] = _verifiers[i];
        }
        inputsLength[OPCODE_ROUND2] = 22;
        inputsLength[OPCODE_REVEAL] = 23;
        inputsLength[OPCODE_WITHDRAW] = 9;
    }

    function publicInputsLength(uint8 _opcode) public override  view returns (uint8) {
        return inputsLength[_opcode];
    }

    function verifyProof(uint8 _opcode, bytes calldata _proof, uint256[] calldata _publicInputs)
        external
        view
        override 
        returns (bool)
    {
        uint256[8] memory proof = abi.decode(_proof, (uint256[8]));
        for (uint8 i = 0; i < proof.length; i++) {
            require(proof[i] < Math.PRIME_Q, "verifier-proof-element-gte-prime-q");
        }
        uint256[2] memory _a = [proof[0], proof[1]];
        uint256[2][2] memory _b = [[proof[2], proof[3]], [proof[4], proof[5]]];
        uint256[2] memory _c = [proof[6], proof[7]];
        if (_opcode == 1) {
            return IGroth16Verifier(verifiers[1]).verifyProof(_a, _b, _c, publicInputsRound2(_publicInputs));
        }
        if (_opcode == 2) {
            return IGroth16Verifier(verifiers[2]).verifyProof(_a, _b, _c, publicInputsReveal(_publicInputs));
        }
        if (_opcode == 3) {
            return IGroth16Verifier(verifiers[3]).verifyProof(_a, _b, _c, publicInputsWithdraw(_publicInputs));
        }
        // return true;
    }

    function publicInputsRound2(uint256[] calldata _publicInputs) internal pure returns (uint256[22] memory) {
        require(_publicInputs.length == 22);
        uint256[22] memory publicInputs;
        for (uint256 i = 0; i < _publicInputs.length; i++) {
            publicInputs[i] = _publicInputs[i];
        }
        return publicInputs;
    }

    function publicInputsReveal(uint256[] calldata _publicInputs) internal pure returns (uint256[23] memory) {
        require(_publicInputs.length == 23);
        uint256[23] memory publicInputs;
        for (uint256 i = 0; i < _publicInputs.length; i++) {
            publicInputs[i] = _publicInputs[i];
        }
        return publicInputs;
    }

    function publicInputsWithdraw(uint256[] calldata _publicInputs) internal pure returns (uint256[9] memory) {
        require(_publicInputs.length == 9);
        uint256[9] memory publicInputs;
        for (uint256 i = 0; i < _publicInputs.length; i++) {
            publicInputs[i] = _publicInputs[i];
        }
        return publicInputs;
    }
}
