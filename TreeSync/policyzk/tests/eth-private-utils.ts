import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  Deposit,
  RecoveryRegistered,
  WalletRecovered,
  Withdrawal
} from "../generated/ETHPrivate/ETHPrivate"

export function createDepositEvent(
  commitment: BigInt,
  pkx: BigInt,
  pky: BigInt,
  amount: BigInt,
  leafIndex: BigInt
): Deposit {
  let depositEvent = changetype<Deposit>(newMockEvent())

  depositEvent.parameters = new Array()

  depositEvent.parameters.push(
    new ethereum.EventParam(
      "commitment",
      ethereum.Value.fromUnsignedBigInt(commitment)
    )
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("pkx", ethereum.Value.fromUnsignedBigInt(pkx))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("pky", ethereum.Value.fromUnsignedBigInt(pky))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam(
      "leafIndex",
      ethereum.Value.fromUnsignedBigInt(leafIndex)
    )
  )

  return depositEvent
}

export function createRecoveryRegisteredEvent(
  owner: Address,
  featureVectorHash: BigInt
): RecoveryRegistered {
  let recoveryRegisteredEvent = changetype<RecoveryRegistered>(newMockEvent())

  recoveryRegisteredEvent.parameters = new Array()

  recoveryRegisteredEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  recoveryRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "featureVectorHash",
      ethereum.Value.fromUnsignedBigInt(featureVectorHash)
    )
  )

  return recoveryRegisteredEvent
}

export function createWalletRecoveredEvent(
  oldOwner: Address,
  newOwner: Address,
  nullifierHash: BigInt,
  amount: BigInt
): WalletRecovered {
  let walletRecoveredEvent = changetype<WalletRecovered>(newMockEvent())

  walletRecoveredEvent.parameters = new Array()

  walletRecoveredEvent.parameters.push(
    new ethereum.EventParam("oldOwner", ethereum.Value.fromAddress(oldOwner))
  )
  walletRecoveredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )
  walletRecoveredEvent.parameters.push(
    new ethereum.EventParam(
      "nullifierHash",
      ethereum.Value.fromUnsignedBigInt(nullifierHash)
    )
  )
  walletRecoveredEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return walletRecoveredEvent
}

export function createWithdrawalEvent(
  to: Address,
  nullifierHash: BigInt,
  lead: BigInt,
  amount: BigInt,
  relayer: Address
): Withdrawal {
  let withdrawalEvent = changetype<Withdrawal>(newMockEvent())

  withdrawalEvent.parameters = new Array()

  withdrawalEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  withdrawalEvent.parameters.push(
    new ethereum.EventParam(
      "nullifierHash",
      ethereum.Value.fromUnsignedBigInt(nullifierHash)
    )
  )
  withdrawalEvent.parameters.push(
    new ethereum.EventParam("lead", ethereum.Value.fromUnsignedBigInt(lead))
  )
  withdrawalEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  withdrawalEvent.parameters.push(
    new ethereum.EventParam("relayer", ethereum.Value.fromAddress(relayer))
  )

  return withdrawalEvent
}
