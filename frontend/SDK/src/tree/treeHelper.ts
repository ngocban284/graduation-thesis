import { poseidon } from "circomlibjs";
import {
  TPoseidonHash,
  TBabyJubPoint,
  TLeafHash,
  TNullifierHash,
  TLead,
} from "../types/dkgTypes";

export const CaculatePoseidonHash = async (
  nullifier: bigint, //
  v: bigint[] // private v input
): Promise<TPoseidonHash> => {
  try {
    return {
      poseidonHash: poseidon([nullifier, ...v]),
      errorCPH: false,
    };
  } catch (e) {
    return {
      poseidonHash: BigInt(0),
      errorCPH: true,
    };
  }
};

export const CaculateLeafHash = async (
  poseidonHash: bigint,
  pk: TBabyJubPoint,
  v: bigint[]
): Promise<TLeafHash> => {
  try {
    const leafHash = poseidon([
      poseidonHash,
      pk[0],
      pk[1],
      v.reduce((a, b) => a + b),
    ]);

    return {
      leafHash: leafHash,
      errorLH: false,
    };
  } catch (e) {
    return {
      leafHash: BigInt(0),
      errorLH: true,
    };
  }
};

export const CaculateNullifierHash = async (
  nullifier: bigint,
  amount: bigint,
  indexAmount: bigint
): Promise<TNullifierHash> => {
  try {
    const nullifierHash = poseidon([nullifier, amount, indexAmount]);

    return {
      nullifierHash: nullifierHash,
      errorNH: false,
    };
  } catch (e) {
    return {
      nullifierHash: BigInt(0),
      errorNH: true,
    };
  }
};

export const CaculateLead = async (
  shareKeyX: bigint,
  indexAmount: bigint
): Promise<TLead> => {
  try {
    const lead = poseidon([shareKeyX, indexAmount]);

    return {
      lead: lead,
      errorL: false,
    };
  } catch (e) {
    return {
      lead: BigInt(0),
      errorL: true,
    };
  }
};
