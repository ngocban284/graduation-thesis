import {
  Deposit as DepositEvent,
  RecoveryRegistered as RecoveryRegisteredEvent,
  WalletRecovered as WalletRecoveredEvent,
  Withdrawal as WithdrawalEvent
} from "../generated/ETHPrivate/ETHPrivate"
import {
  Deposit,
  RecoveryRegistered,
  WalletRecovered,
  Withdrawal
} from "../generated/schema"

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.commitment = event.params.commitment
  entity.pkx = event.params.pkx
  entity.pky = event.params.pky
  entity.amount = event.params.amount
  entity.leafIndex = event.params.leafIndex

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRecoveryRegistered(event: RecoveryRegisteredEvent): void {
  let entity = new RecoveryRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.featureVectorHash = event.params.featureVectorHash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWalletRecovered(event: WalletRecoveredEvent): void {
  let entity = new WalletRecovered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.oldOwner = event.params.oldOwner
  entity.newOwner = event.params.newOwner
  entity.nullifierHash = event.params.nullifierHash
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdrawal(event: WithdrawalEvent): void {
  let entity = new Withdrawal(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.to = event.params.to
  entity.nullifierHash = event.params.nullifierHash
  entity.lead = event.params.lead
  entity.amount = event.params.amount
  entity.relayer = event.params.relayer

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
