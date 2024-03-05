// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
contract Multicall {
    struct Call {
        address target;
        bytes callData;
    }
    function aggregate(Call[] calldata calls) external view returns (bytes[] memory returnData) {
        returnData = new bytes[](calls.length);
        for (uint256 i = 0; i < calls.length; i++) {
            (bool success, bytes memory ret) = calls[i].target.staticcall(calls[i].callData);
            require(success);
            returnData[i] = ret;
        }
    }
}