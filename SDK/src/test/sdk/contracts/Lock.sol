// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract RefRewardDistributor {
    uint public unlockTime;
    address payable public owner;

    event Withdrawal(uint amount, uint when);

 

    function withdraw(
        address _to ,
        uint256 _amount,
        uint256 _chain,
    // signature 
        bytes memory _signature
    ) public view returns  (bool) {
        return true;
    }
}
