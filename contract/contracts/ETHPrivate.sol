

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {PrivateZK} from "./Private.sol";

contract ETHMixer is PrivateZK {
    constructor(PrivateConfig memory config) PrivateZK(config) {}

    function _beforeDeposit(DepositParams calldata depositParams) internal override {
        require(msg.value == depositParams.amount, "Please send `amount` ETH along with transaction");
    }

    function _afterWithdraw(WithdrawParams calldata withdrawParams) internal override {
        // sanity checks
        require(msg.value == 0, "Message value is supposed to be zero for ETH instance");
        // require(_refund == 0, "Refund value is supposed to be zero for ETH instance");

        (bool success,) = withdrawParams.recipient.call{value: withdrawParams.amount - withdrawParams.fee}("");
        require(success, "payment to _recipient did not go thru");
        if (withdrawParams.fee > 0) {
            (success,) = withdrawParams.relayer.call{value: withdrawParams.fee}("");
            require(success, "payment to _relayer did not go thru");
        }
    }
}
