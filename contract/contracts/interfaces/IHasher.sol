// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IHasher {
    function poseidon(uint256[] memory values) external pure returns (uint256);
}
