import { PrivateZKHelper } from "../SDK/src/adapter/privateZK";
import { BSC_TESTNET_RPC, DKG_CONTRACT_ADDRESS } from "../constants";

const zkHelper = new PrivateZKHelper(BSC_TESTNET_RPC, DKG_CONTRACT_ADDRESS);

export const useGetNullifier = () => {
  return zkHelper.GenerateNullifier();
};

export const getDepositParams = async (nullifier, v) => {
  return zkHelper.Deposit(nullifier, v);
};
