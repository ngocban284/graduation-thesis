import { babyJub } from "circomlib";
import { ethers } from "ethers";
import * as types from "../types/dkgTypes";

// to test math lib
const BASE = babyJub.Base8;

export const Fp = babyJub.subOrder;

export function fx(coef: bigint[], x: bigint) {
  let _fx = 0n;
  for (const index in coef) {
    _fx += coef[index] * x ** BigInt(index);
  }
  return _fx % Fp;
}

export function modInverse(a: bigint, p: bigint = Fp): bigint | undefined {
  let [old_r, r] = [a, p];
  let [old_s, s] = [BigInt(1), BigInt(0)];

  while (r !== BigInt(0)) {
    const quotient = old_r / r;
    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
  }

  if (old_r > BigInt(1)) {
    // 'a' and 'p' are not coprime, hence the inverse doesn't exist
    return undefined;
  }

  // Ensure the result is positive
  const result = old_s < BigInt(0) ? old_s + p : old_s;
  return result;
}

export function babyJubPointEqual(
  P: types.TBabyJubPoint,
  Q: types.TBabyJubPoint
): boolean {
  return P[0] == Q[0] && P[1] == Q[1];
}
export function lagrangeInterpolationZpAtZero(
  indexes: bigint[],
  values: bigint[],
  Zp: bigint = Fp
): bigint | undefined {
  if (indexes.length !== values.length) return undefined;

  const mod = (n: bigint) => ((n % Zp) + Zp) % Zp;
  let _f = 0n;

  for (let i = 0; i < indexes.length; i++) {
    let lambda = values[i];

    for (let j = 0; j < indexes.length; j++) {
      if (i === j) continue;

      const jVal = indexes[j];
      const iVal = indexes[i];

      const denominator = mod(iVal - jVal);
      const inverse = modInverse(denominator, Zp);

      if (inverse === undefined) return undefined; // Inverse doesn't exist

      lambda = mod(lambda * jVal);
      lambda = mod(lambda * inverse);
    }

    _f = mod(_f + lambda);
  }

  return _f;
}
export function lagrangeInterpolationZpAtZeroMulBabyJubPoint(
  indexes: bigint[],
  Di: types.TBabyJubPoint[],
  Zp: bigint = Fp
): types.TBabyJubPoint | undefined {
  if (indexes.length !== Di.length) return undefined;

  const mod = (n: bigint) => ((n % Zp) + Zp) % Zp;
  let D: types.TBabyJubPoint = [0n, 1n];

  for (let i = 0; i < indexes.length; i++) {
    let lambda = 1n;

    for (let j = 0; j < indexes.length; j++) {
      if (i === j) continue;

      const jVal = indexes[j];
      const iVal = indexes[i];

      const denominator = mod(iVal - jVal);
      const inverse = modInverse(denominator, Zp);

      if (inverse === undefined) return undefined; // Inverse doesn't exist

      lambda = mod(lambda * jVal);
      lambda = mod(lambda * inverse);
    }

    D = babyJub.addPoint(D, babyJub.mulPointEscalar(Di[i], lambda));
  }
  return D;
}
