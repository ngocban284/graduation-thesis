import { PrivateZKHelper } from "../SDK/src/adapter/privateZK";
import { BSC_TESTNET_RPC, DKG_CONTRACT_ADDRESS } from "../constants";
const snarkjs = require("snarkjs");

import * as fs from "fs";
import path from "path";
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

export const useProveWithdrawProof = async (inputs) => {
  const { proof, publicSignals } = await window.snarkjs.groth16.fullProve(
    inputs,
    "/zk-resource/withdraw/Withdraw.wasm",
    "/zk-resource/withdraw/Withdraw.zkey"
  );
  return { proof, publicSignals };
};

export const useProveWithdrawProofcc = async (inputs) => {
  //  get path of zk resource use path
  console.log(path.join(__dirname, "../zk-resource/withdraw/Withdraw.wasm"));
};

// get link zk resource . ../zk-resource/withdraw/Withdraw.wasm
