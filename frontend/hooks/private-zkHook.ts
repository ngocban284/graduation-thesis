import {
  BSC_TESTNET_RPC,
  DKG_CONTRACT_ADDRESS,
  MULTICALL3_ADDRESS,
} from "../constants";
import { ethers } from "ethers";
const snarkjs = require("snarkjs");

import Mixer from "mixerswap-helper-sdk";

const mixerHelper = new Mixer.MixerHelper(
  BSC_TESTNET_RPC,
  DKG_CONTRACT_ADDRESS,
  MULTICALL3_ADDRESS
);

export const useGetNullifier = () => {
  return mixerHelper.GenerateNullifier();
};

export const getDepositParams = async (nullifier, v) => {
  return mixerHelper.Deposit(nullifier, v);
};

export const useGenerateWithdrawParams = async (
  nullifier: bigint, // private nullifier
  recipient: string, // recipient address
  relayer: string, // relayer address , receive fee
  v: bigint[], // private array
  indexAmount: bigint, // index of element in v
  feePercent: bigint // % fee
) => {
  return mixerHelper.Withdraw(
    nullifier,
    recipient,
    relayer,
    v,
    indexAmount,
    feePercent
  );
};

export const useGenerateWithdrawParamsHuhu = async (
  nullifier: bigint, // private nullifier
  recipient: string, // recipient address
  relayer: string, // relayer address , receive fee
  v: bigint[], // private array
  indexAmount: bigint, // index of element in v
  feePercent: bigint // % fee
) => {
  return mixerHelper.Withdraw(
    nullifier,
    recipient,
    relayer,
    v,
    indexAmount,
    feePercent
  );
};

export const useProveWithdrawProof = async (inputs) => {
  const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
    inputs,
    "/zk-resource/withdraw/Withdraw.wasm",
    "/zk-resource/withdraw/Withdraw.zkey"
  );
  return { proof, publicSignals };
};

export const toAddress = async (num) => {
  const hex = ethers.BigNumber.from(num).toHexString();
  const paddedHex = hex.padStart(40, "0");

  return paddedHex;
};
