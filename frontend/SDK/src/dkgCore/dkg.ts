import { ethers } from "ethers";
import { babyJub } from "circomlib";
import * as types from "../types/dkgTypes";
import * as math from "./math";

export const BASE = babyJub.Base8;
const Fp = math.Fp;

export const RandomBigint = (nbytes: number): bigint => {
  return (
    BigInt("0x" + Buffer.from(ethers.randomBytes(nbytes)).toString("hex")) % Fp
  );
};

export function RandomCoefficient(length: number) {
  return new Array(length).fill(0).map(() => RandomBigint(32));
}

export function Round1Data(coefficient: bigint[]): types.TBabyJubPoint[] {
  return coefficient.map((sk) => babyJub.mulPointEscalar(BASE, sk));
}

export function Elgamal_enc(
  skA: bigint,
  pkB: types.TBabyJubPoint,
  message: bigint
) {
  const pad = babyJub.mulPointEscalar(pkB, skA)[0];
  return pad ^ message;
}

export function Elgamal_dec(
  skB: bigint,
  pkA: types.TBabyJubPoint,
  messageEnc: bigint
) {
  const pad = babyJub.mulPointEscalar(pkA, skB)[0];
  return pad ^ messageEnc;
}

export function Round2Data(
  coefi: bigint[],
  colCommitment0: types.TBabyJubPoint[]
) {
  let data = [];

  for (const index in colCommitment0) {
    if (
      math.babyJubPointEqual(
        babyJub.mulPointEscalar(BASE, coefi[0]),
        colCommitment0[index]
      )
    ) {
      data.push(0n);
      continue;
    }
    data.push(
      Elgamal_enc(
        coefi[0],
        colCommitment0[index],
        math.fx(coefi, BigInt(index) + 1n)
      )
    );
  }
  return data;
}

export function DecodeRound2Data(
  coefi: bigint[],
  colCommitment0: types.TBabyJubPoint[],
  round2DataEnc: bigint[]
) {
  let data = [];
  for (const index in round2DataEnc) {
    if (round2DataEnc[index] == 0n) {
      data.push(math.fx(coefi, BigInt(index) + 1n));
      continue;
    }
    data.push(
      Elgamal_dec(coefi[0], colCommitment0[index], round2DataEnc[index])
    );
  }
  return data;
}

export function AggregateSki(
  coefi: bigint[],
  colCommitment0: types.TBabyJubPoint[],
  colRound2Datai: bigint[]
) {
  let ski = 0n;
  for (const index in colRound2Datai) {
    if (colRound2Datai[index] == 0n) {
      ski += math.fx(coefi, BigInt(index) + 1n);
      continue;
    }
    ski += Elgamal_dec(coefi[0], colCommitment0[index], colRound2Datai[index]);
  }
  return ski % Fp;
}
