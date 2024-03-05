export type TBabyJubPoint = [bigint, bigint];
export type TCommitteeConfig = {
  T_COMMITTEE: number;
  N_COMMITTEE: number;
};

export type TCommitment = {
  coef: bigint[];
  commitment: TBabyJubPoint[];
  errorCM: boolean;
};

//
// type for DKG
//

export type TRound1Cofficient = {
  coef: bigint[];
  errorCoef: boolean;
};

export type TRound1Commmit = {
  coef: bigint[];
  commitment: TBabyJubPoint[];
  errorR1: boolean;
};

export type TRound2Commit = {
  circuitInput: string;
  error: boolean;
};

export type TCoef = bigint[];

export type TRound2Encrypted = {
  encryptedR2: bigint[];
  errorR2E: boolean;
};

export type TRound2F = {
  f: bigint[];
  errorR2F: boolean;
};

export type TDecryptedFaD = {
  decrypted: bigint[];
  fA: bigint;
  D: TBabyJubPoint;
  errorDFA: boolean;
};

export type TMulticallParams = {
  reference: string;
  methodName: string;
  methodParameters: any[];
};

export type TRandomCommitment = {
  radomCommitment: bigint;
  errorRC: boolean;
};

//
// type for Mixer
//

export type TRandomNullifier = {
  randomNullifier: bigint;
  errorRN: boolean;
};

export type TMixerDeposit = {
  params: string;
  error: boolean;
};

export type TWithdraw = {
  circuitInput: string;
  error: boolean;
};

export type TPoseidonHash = {
  poseidonHash: bigint;
  errorCPH: boolean;
};

export type TLeafHash = {
  leafHash: bigint;
  errorLH: boolean;
};

export type TNullifierHash = {
  nullifierHash: bigint;
  errorNH: boolean;
};

export type TLead = {
  lead: bigint;
  errorL: boolean;
};

export type TGenPkFromNullifier = {
  pk: TBabyJubPoint;
  errorPk: boolean;
};
