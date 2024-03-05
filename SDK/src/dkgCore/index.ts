import {
  Round1Data,
  Round2Data,
  RandomCoefficient,
  DecodeRound2Data,
  Elgamal_dec,
  AggregateSki,
  RandomBigint,
  BASE,
} from "./dkg";
import {
  TCommitteeConfig,
  TCommitment,
  TDecryptedFaD,
  TRound2F,
  TRound2Encrypted,
  TBabyJubPoint,
  TRandomCommitment,
  TRound1Cofficient,
  TGenPkFromNullifier,
} from "../types/dkgTypes";
import { fx } from "./math";
import { babyJub } from "circomlib";

export const RandomNullifier = async (): Promise<bigint> => {
  try {
    const nullifier = RandomBigint(32);

    return nullifier;
  } catch (e) {
    return 0n;
  }
};

export const Round1Coefficient = async (
  config: TCommitteeConfig
): Promise<TRound1Cofficient> => {
  try {
    const coef = RandomCoefficient(config.T_COMMITTEE);

    return {
      coef: coef,
      errorCoef: false,
    };
  } catch (e) {
    return {
      coef: [],
      errorCoef: true,
    };
  }
};

export const Round1RCommitData = async (
  config: TCommitteeConfig
): Promise<TCommitment> => {
  try {
    const coef = RandomCoefficient(config.T_COMMITTEE);
    const Commitment = Round1Data(coef);

    return {
      coef: coef,
      commitment: Commitment,
      errorCM: false,
    };
  } catch (e) {
    return {
      coef: [],
      commitment: [],
      errorCM: true,
    };
  }
};

export const Round2Encrypted = async (
  index: number,
  coef: bigint[],
  colCommitment0: any[]
): Promise<TRound2Encrypted> => {
  try {
    const round2Data: bigint[] = Round2Data(coef, colCommitment0).filter(
      (_, i) => i + 1 != index
    );

    return {
      encryptedR2: round2Data,
      errorR2E: false,
    };
  } catch (e) {
    return {
      encryptedR2: [],
      errorR2E: true,
    };
  }
};

export const Round2F = async (
  index: number,
  N_COMMITTEE: number,
  coef: bigint[]
): Promise<TRound2F> => {
  try {
    const result: bigint[] = new Array(N_COMMITTEE)
      .fill(0)
      .map((_f, i) => fx(coef, BigInt(i + 1)))
      .filter((_, i) => i + 1 != index);

    return {
      f: result,
      errorR2F: false,
    };
  } catch (e) {
    return {
      f: [],
      errorR2F: true,
    };
  }
};

export const RevealDecryptedFaD = async (
  N_COMMITTEE: number,
  index: number,
  coef: bigint[],
  colCommitment0: any[],
  encryped: any[],
  round2Data: any[],
  pkAddressIn: TBabyJubPoint
): Promise<TDecryptedFaD> => {
  try {
    let result: bigint[] = [];
    let decOfIndex: bigint[] = DecodeRound2Data(
      coef,
      colCommitment0,
      round2Data[index - 1]
    );

    let fA: bigint = decOfIndex[index - 1];

    let round2DataIndex = [];

    for (let i = 1, j = 0, k = 0; i <= N_COMMITTEE; i++, k++) {
      if (i != index) {
        result.push(Elgamal_dec(coef[0], colCommitment0[i - 1], encryped[j]));
        round2DataIndex.push(round2Data[k][index - 1]);
        j++;
      } else {
        round2DataIndex.push(0n);
        continue;
      }
    }

    const ski = AggregateSki(coef, colCommitment0, round2DataIndex);

    const D = babyJub.mulPointEscalar(pkAddressIn, ski);

    return {
      decrypted: result,
      fA: fA,
      D: D,
      errorDFA: false,
    };
  } catch (e) {
    return {
      decrypted: [],
      fA: 0n,
      D: [0n, 0n],
      errorDFA: true,
    };
  }
};

export const DepositRandomCommitment = async (): Promise<TRandomCommitment> => {
  try {
    const randomCommitment: bigint = RandomBigint(32);

    return {
      radomCommitment: randomCommitment,
      errorRC: false,
    };
  } catch (e) {
    return {
      radomCommitment: 0n,
      errorRC: true,
    };
  }
};

export const GenerateFromNullifierPk = async (
  nullifier: bigint
): Promise<TGenPkFromNullifier> => {
  try {
    const [pkx, pky] = babyJub.mulPointEscalar(BASE, nullifier);

    if (pkx === 0n && pky === 0n) {
      return {
        pk: [0n, 0n],
        errorPk: true,
      };
    }

    return {
      pk: [pkx, pky],
      errorPk: false,
    };
  } catch (e) {
    return {
      pk: [0n, 0n],
      errorPk: true,
    };
  }
};

// GenerateFromNullifierPk(
//   2565768520321566751814776235936631015488583705485544099469764147870754320603n
// ).then((res) => console.log(res));
