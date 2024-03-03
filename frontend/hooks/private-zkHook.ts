import { PrivateZKHelper } from "../SDK/src/adapter/privateZK";
import { BSC_TESTNET_RPC, DKG_CONTRACT_ADDRESS } from "../constants";

const zkHelper = new PrivateZKHelper(BSC_TESTNET_RPC, DKG_CONTRACT_ADDRESS);

export const useGetNullifier = () => {
  return zkHelper.GenerateNullifier();
};

export const getDepositParams = async (nullifier, v) => {
  return zkHelper.Deposit(nullifier, v);
};

export const useGenerateWithdrawParams = async (
  nullifier: bigint, // private nullifier
  recipient: string, // recipient address
  relayer: string, // relayer address , receive fee
  v: bigint[], // private array
  indexAmount: bigint, // index of element in v
  feePercent: bigint // % fee
) => {
  return zkHelper.Withdraw(
    nullifier,
    recipient,
    relayer,
    v,
    indexAmount,
    feePercent
  );
};
