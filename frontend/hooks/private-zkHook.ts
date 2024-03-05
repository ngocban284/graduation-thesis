import { PrivateZKHelper } from "../SDK/src/adapter/privateZK";
import {
  BSC_TESTNET_RPC,
  DKG_CONTRACT_ADDRESS,
  MULTICALL3_ADDRESS,
} from "../constants";
import { ethers } from "ethers";
const snarkjs = require("snarkjs");

import Mixer from "mixerswap-helper-sdk";

// const Mixer = require("mixerswap-helper-sdk/");

import path from "path";
const zkHelper = new PrivateZKHelper(BSC_TESTNET_RPC, DKG_CONTRACT_ADDRESS);

const mixerHelper = new Mixer.MixerHelper(
  BSC_TESTNET_RPC,
  DKG_CONTRACT_ADDRESS,
  MULTICALL3_ADDRESS
);

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

// export const useGenerateWithdrawParamsMixer = async (
//   nullifier: bigint, // private nullifier
//   recipient: string, // recipient address
//   relayer: string, // relayer address , receive fee
//   v: bigint[], // private array
//   indexAmount: bigint, // index of element in v
//   feePercent: bigint // % fee
// ) => {
//   return zkHelper.WithdrawMixer(
//     nullifier,
//     recipient,
//     relayer,
//     v,
//     indexAmount,
//     feePercent
//   );
// }

export const useProveWithdrawProof = async (inputs) => {
  const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
    inputs,
    "/zk-resource/withdraw/Withdraw.wasm",
    "/zk-resource/withdraw/Withdraw.zkey"
  );
  return { proof, publicSignals };
};

export const toAddress = async (num) => {
  // convert to hex
  // const hex = ethers.toBigInt(num).toString(16);

  // const paddedHex = hex.padStart(40, "0");
  // const address = "0x" + padded  Hex;
  // return address;

  const hex = ethers.BigNumber.from(num).toHexString();
  const paddedHex = hex.padStart(40, "0");

  return paddedHex;
};

// export const useProveWithdrawProofcc = async (inputs) => {
//   //  get path of zk resource use path
//   console.log(path.join(__dirname, "../zk-resource/withdraw/Withdraw.wasm"));
// };

// get link zk resource . ../zk-resource/withdraw/Withdraw.wasm
