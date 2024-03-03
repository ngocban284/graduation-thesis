import { abi as DKGABI } from "./abis/dkg.json";
import { ethers, Contract } from "ethers";
import { poseidon } from "circomlibjs";
import {
  DepositRandomCommitment,
  RandomNullifier,
  GenerateFromNullifierPk,
} from "../dkgCore/index";
import {
  TMixerDeposit,
  TBabyJubPoint,
  TWithdraw,
  TRandomNullifier,
} from "../types/dkgTypes";
import { babyJub } from "circomlib";
import tree from "../tree/merkle";
import config from "../config";

import {
  CaculatePoseidonHash,
  CaculateLeafHash,
  CaculateNullifierHash,
  CaculateLead,
} from "../tree/treeHelper";

export class PrivateZKHelper {
  provider: ethers.JsonRpcProvider;
  DKGContract: Contract;
  dkgContractAddress: string;

  constructor(rpcUrl: string, dkgContractAddress: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.DKGContract = new Contract(
      dkgContractAddress,
      DKGABI,
      new ethers.JsonRpcProvider(rpcUrl)
    );
    this.dkgContractAddress = dkgContractAddress;
  }

  async GenerateNullifier(): Promise<TRandomNullifier> {
    try {
      const nullifier = await RandomNullifier();

      if (nullifier === 0n) {
        return {
          randomNullifier: 0n,
          errorRN: true,
        };
      }

      return {
        randomNullifier: nullifier,
        errorRN: false,
      };
    } catch (e) {
      return {
        randomNullifier: 0n,
        errorRN: true,
      };
    }
  }

  Deposit = async (
    nullifier: bigint, // private nullifier
    v: bigint[] // private array
  ): Promise<TMixerDeposit> => {
    try {
      const { pk, errorPk } = await GenerateFromNullifierPk(nullifier);
      if (errorPk) {
        return {
          params: "",
          error: true,
        };
      }

      const amountTotal = v.reduce((a, b) => a + b);

      const commitment = poseidon([nullifier, ...v]);

      let depositParams: any = [];

      depositParams.push(commitment);
      depositParams.push(pk);
      depositParams.push(amountTotal);

      return {
        params: depositParams,
        error: false,
      };
    } catch (e) {
      return {
        params: "",
        error: true,
      };
    }
  };

  async Withdraw(
    nullifier: bigint, // private nullifier
    recipient: string, // recipient address
    relayer: string, // relayer address , receive fee
    v: bigint[], // private array
    indexAmount: bigint, // index of element in v
    feePercent: bigint // % fee
  ): Promise<TWithdraw> {
    try {
      const amount = v[Number(indexAmount.toString())];
      const fee = (feePercent * amount) / 100n;

      //  get PK DAO from DKG contract
      const PKDAO = await this.DKGContract.PK_COMMITTEE();
      // console.log("PKDAO", PKDAO);

      const { pk, errorPk } = await GenerateFromNullifierPk(nullifier);
      if (errorPk) {
        return {
          circuitInput: "",
          error: true,
        };
      }

      const shareKey = babyJub.mulPointEscalar(PKDAO, nullifier);
      // console.log("shareKey", shareKey);

      const { poseidonHash, errorCPH } = await CaculatePoseidonHash(
        nullifier,
        v
      );
      if (errorCPH) {
        return {
          circuitInput: "",
          error: true,
        };
      }

      // console.log("poseidonHash", poseidonHash);

      const { leafHash, errorLH } = await CaculateLeafHash(poseidonHash, pk, v);
      if (errorLH) {
        return {
          circuitInput: "",
          error: true,
        };
      }

      // console.log("leafHash", leafHash);

      const { nullifierHash, errorNH } = await CaculateNullifierHash(
        nullifier,
        amount,
        indexAmount
      );
      if (errorNH) {
        return {
          circuitInput: "",
          error: true,
        };
      }

      // console.log("nullifierHash", nullifierHash);

      const { lead, errorL } = await CaculateLead(shareKey[0], indexAmount);
      if (errorL) {
        return {
          circuitInput: "",
          error: true,
        };
      }
      // console.log("lead", lead);

      // is leaf in tree
      // when release,  need to check leaf in tree from server or database
      const index = tree.indexOf(String(leafHash));
      if (index === -1) {
        // return {
        //   circuitInput: "",
        //   error: true,
        // };

        // only for testing
        tree.insert(String(leafHash));
      }

      const proof = tree.proof(String(leafHash));

      const circuitInput: any = {};
      circuitInput.root = proof.pathRoot;
      circuitInput.nullifierHash = String(nullifierHash);
      circuitInput.lead = String(lead);
      circuitInput.amount = String(amount);
      circuitInput.pkDAO = PKDAO.map((_) => String(_));
      circuitInput.recipient = recipient;
      circuitInput.relayer = relayer;
      circuitInput.fee = String(fee);

      circuitInput.nullifier = String(nullifier);
      circuitInput.v = v.map((_) => String(_));
      circuitInput.pathElements = proof.pathElements;
      circuitInput.pathIndices = proof.pathIndices.map((_) => String(_));
      circuitInput.index = String(indexAmount);

      // console.log("circuitInput", circuitInput);
      return {
        circuitInput: circuitInput,
        error: false,
      };
    } catch (e) {
      console.log(e);
      return {
        circuitInput: "",
        error: true,
      };
    }
  }

  async Swap(
    nullifier: bigint, // private nullifier
    recipient: string, // recipient address
    relayer: string, // relayer address , receive fee
    v: bigint[], // private array
    indexAmount: bigint, // index of element in v
    feePercent: bigint, // % fee
    tokenOut: string, // token out address
    amountTokenOutMin: bigint // min amount token out
  ): Promise<TWithdraw> {
    try {
      const amount = v[Number(indexAmount.toString())];
      const fee = (feePercent * amount) / 100n;

      //  get PK DAO from DKG contract
      const PKDAO = await this.DKGContract.PK_COMMITTEE();
      // console.log("PKDAO", PKDAO);

      const { pk, errorPk } = await GenerateFromNullifierPk(nullifier);
      if (errorPk) {
        return {
          circuitInput: "",
          error: true,
        };
      }

      const shareKey = babyJub.mulPointEscalar(PKDAO, nullifier);
      // console.log("shareKey", shareKey);

      const { poseidonHash, errorCPH } = await CaculatePoseidonHash(
        nullifier,
        v
      );
      if (errorCPH) {
        return {
          circuitInput: "",
          error: true,
        };
      }

      // console.log("poseidonHash", poseidonHash);

      const { leafHash, errorLH } = await CaculateLeafHash(poseidonHash, pk, v);
      if (errorLH) {
        return {
          circuitInput: "",
          error: true,
        };
      }

      // console.log("leafHash", leafHash);

      const { nullifierHash, errorNH } = await CaculateNullifierHash(
        nullifier,
        amount,
        indexAmount
      );
      if (errorNH) {
        return {
          circuitInput: "",
          error: true,
        };
      }

      // console.log("nullifierHash", nullifierHash);

      const { lead, errorL } = await CaculateLead(shareKey[0], indexAmount);
      if (errorL) {
        return {
          circuitInput: "",
          error: true,
        };
      }
      // console.log("lead", lead);

      // is leaf in tree
      // when release,  need to check leaf in tree from server or database
      const index = tree.indexOf(String(leafHash));
      if (index === -1) {
        // return {
        //   circuitInput: "",
        //   error: true,
        // };

        // only for testing
        tree.insert(String(leafHash));
      }

      const proof = tree.proof(String(leafHash));

      const circuitInput: any = {};
      circuitInput.root = proof.pathRoot;
      circuitInput.nullifierHash = String(nullifierHash);
      circuitInput.lead = String(lead);
      circuitInput.amount = String(amount);
      circuitInput.pkDAO = PKDAO.map((_) => String(_));
      circuitInput.recipient = recipient;
      circuitInput.relayer = relayer;
      circuitInput.fee = String(fee);
      circuitInput.tokenOut = tokenOut;
      circuitInput.amountTokenOutMin = String(amountTokenOutMin);

      circuitInput.nullifier = String(nullifier);
      circuitInput.v = v.map((_) => String(_));
      circuitInput.pathElements = proof.pathElements;
      circuitInput.pathIndices = proof.pathIndices.map((_) => String(_));
      circuitInput.index = String(indexAmount);

      // console.log("circuitInput", circuitInput);
      return {
        circuitInput: circuitInput,
        error: false,
      };
    } catch (e) {
      console.log(e);
      return {
        circuitInput: "",
        error: true,
      };
    }
  }
}

// const mixerHelper = new MixerHelper(
//   "https://data-seed-prebsc-1-s2.bnbchain.org:8545",
//   "0xC1Db3914cb3592eA6c6d3468892d0716899d0915"
// );

// async function test() {
//   const {
//     circuitInput: withdrawCircuitInputParams,
//     error: withdrawCircuitInputError,
//   } = await mixerHelper.Withdraw(
//     2565768520321566751814776235936631015488583705485544099469764147870754320603n,
//     "0x19F96D5e33cDbADc7E16e060E6276274560bbAB1",
//     "0x19F96D5e33cDbADc7E16e060E6276274560bbAB1",
//     [
//       1000000000000000n,
//       1000000000000000n,
//       1000000000000000n,
//       1000000000000000n,
//     ],
//     0n,
//     1n
//   );

//   console.log(withdrawCircuitInputParams, withdrawCircuitInputError);
// }

// test();

// const provider = new ethers.JsonRpcProvider(
//   "https://data-seed-prebsc-1-s2.bnbchain.org:8545"
// );
// const DKGContract = new Contract(
//   "0x9cD832530AaFE09D28C6A224F28bE88211376c26",
//   DKGABI,
//   provider
// );

// export const GenerateNullifier = async (): Promise<TRandomNullifier> => {
//   try {
//     const nullifier = await RandomNullifier();

//     if (nullifier === 0n) {
//       return {
//         randomNullifier: 0n,
//         errorRN: true,
//       };
//     }

//     return {
//       randomNullifier: nullifier,
//       errorRN: false,
//     };
//   } catch (e) {
//     return {
//       randomNullifier: 0n,
//       errorRN: true,
//     };
//   }
// };

// export const Deposit = async (
//   nullifier: bigint,
//   v: bigint[]
// ): Promise<TMixerDeposit> => {
//   try {
//     const { pk, errorPk } = await GenerateFromNullifierPk(nullifier);
//     if (errorPk) {
//       return {
//         params: "",
//         error: true,
//       };
//     }

//     const amountTotal = v.reduce((a, b) => a + b);

//     const commitment = poseidon([nullifier, ...v]);

//     let depositParams: any = {};

//     depositParams.commitment = commitment;
//     depositParams.amount = amountTotal;
//     depositParams.pk = pk;

//     return {
//       params: depositParams,
//       error: false,
//     };
//   } catch (e) {
//     return {
//       params: "",
//       error: true,
//     };
//   }
// };

// Deposit(
//   2088452556533488318573987680222685864467250075685843068433217623990023912972n,
//   [1000000000000000n, 1000000000000000n, 1000000000000000n, 1000000000000000n]
// ).then((res) => {
//   console.log(res);
// });

// export const Withdraw = async (
//   nullifier: bigint,
//   recipient: string,
//   relayer: string,
//   v: bigint[],
//   indexAmount: bigint, // index of element in v
//   feePercent: bigint // %
// ) => {
//   try {
//     const amount = v[Number(indexAmount.toString())];
//     const fee = (feePercent * amount) / 100n;

//     //  get PK DAO from DKG contract
//     const PKDAO = await DKGContract.PK_COMMITTEE();
//     // console.log("PKDAO", PKDAO);

//     const { pk, errorPk } = await GenerateFromNullifierPk(nullifier);
//     if (errorPk) {
//       return {
//         circuitInput: "",
//         error: true,
//       };
//     }

//     const shareKey = babyJub.mulPointEscalar(PKDAO, nullifier);
//     // console.log("shareKey", shareKey);

//     const { poseidonHash, errorCPH } = await CaculatePoseidonHash(nullifier, v);
//     if (errorCPH) {
//       return {
//         circuitInput: "",
//         error: true,
//       };
//     }

//     // console.log("poseidonHash", poseidonHash);

//     const { leafHash, errorLH } = await CaculateLeafHash(poseidonHash, pk, v);
//     if (errorLH) {
//       return {
//         circuitInput: "",
//         error: true,
//       };
//     }

//     // console.log("leafHash", leafHash);

//     const { nullifierHash, errorNH } = await CaculateNullifierHash(
//       nullifier,
//       amount,
//       indexAmount
//     );
//     if (errorNH) {
//       return {
//         circuitInput: "",
//         error: true,
//       };
//     }

//     // console.log("nullifierHash", nullifierHash);

//     const { lead, errorL } = await CaculateLead(shareKey[0], indexAmount);
//     if (errorL) {
//       return {
//         circuitInput: "",
//         error: true,
//       };
//     }
//     // console.log("lead", lead);

//     // is leaf in tree
//     // when release,  need to check leaf in tree from server or database
//     const index = tree.indexOf(String(leafHash));
//     if (index === -1) {
//       // return {
//       //   circuitInput: "",
//       //   error: true,
//       // };

//       // only for testing
//       tree.insert(String(leafHash));
//     }

//     const proof = tree.proof(String(leafHash));

//     const circuitInput: any = {};
//     circuitInput.root = proof.pathRoot;
//     circuitInput.nullifierHash = String(nullifierHash);
//     circuitInput.lead = String(lead);
//     circuitInput.amount = String(amount);
//     circuitInput.pkDAO = PKDAO.map((_) => String(_));
//     circuitInput.recipient = recipient;
//     circuitInput.relayer = relayer;
//     circuitInput.fee = String(fee);

//     circuitInput.nullifier = String(nullifier);
//     circuitInput.v = v.map((_) => String(_));
//     circuitInput.pathElements = proof.pathElements;
//     circuitInput.pathIndices = proof.pathIndices.map((_) => String(_));
//     circuitInput.index = String(indexAmount);

//     // console.log("circuitInput", circuitInput);
//     return {
//       circuitInput: circuitInput,
//       error: false,
//     };
//   } catch (e) {
//     console.log(e);
//     return {
//       circuitInput: "",
//       error: true,
//     };
//   }
// };

// export const Swap = async (
//   nullifier: bigint, // private nullifier
//   recipient: string, // recipient address
//   relayer: string, // relayer address , receive fee
//   v: bigint[], // private array
//   indexAmount: bigint, // index of element in v
//   feePercent: bigint, // % fee
//   tokenOut: string, // token out address
//   amountTokenOutMin: bigint // min amount token out
// ) => {
//   try {
//     const amount = v[Number(indexAmount.toString())];
//     const fee = (feePercent * amount) / 100n;

//     //  get PK DAO from DKG contract
//     const PKDAO = await DKGContract.PK_COMMITTEE();
//     // console.log("PKDAO", PKDAO);

//     const { pk, errorPk } = await GenerateFromNullifierPk(nullifier);
//     if (errorPk) {
//       return {
//         circuitInput: "",
//         error: true,
//       };
//     }

//     const shareKey = babyJub.mulPointEscalar(PKDAO, nullifier);
//     // console.log("shareKey", shareKey);

//     const { poseidonHash, errorCPH } = await CaculatePoseidonHash(nullifier, v);
//     if (errorCPH) {
//       return {
//         circuitInput: "",
//         error: true,
//       };
//     }

//     // console.log("poseidonHash", poseidonHash);

//     const { leafHash, errorLH } = await CaculateLeafHash(poseidonHash, pk, v);
//     if (errorLH) {
//       return {
//         circuitInput: "",
//         error: true,
//       };
//     }

//     // console.log("leafHash", leafHash);

//     const { nullifierHash, errorNH } = await CaculateNullifierHash(
//       nullifier,
//       amount,
//       indexAmount
//     );
//     if (errorNH) {
//       return {
//         circuitInput: "",
//         error: true,
//       };
//     }

//     // console.log("nullifierHash", nullifierHash);

//     const { lead, errorL } = await CaculateLead(shareKey[0], indexAmount);
//     if (errorL) {
//       return {
//         circuitInput: "",
//         error: true,
//       };
//     }
//     // console.log("lead", lead);

//     // is leaf in tree
//     // when release,  need to check leaf in tree from server or database
//     const index = tree.indexOf(String(leafHash));
//     if (index === -1) {
//       // return {
//       //   circuitInput: "",
//       //   error: true,
//       // };

//       // only for testing
//       tree.insert(String(leafHash));
//     }

//     const proof = tree.proof(String(leafHash));

//     const circuitInput: any = {};
//     circuitInput.root = proof.pathRoot;
//     circuitInput.nullifierHash = String(nullifierHash);
//     circuitInput.lead = String(lead);
//     circuitInput.amount = String(amount);
//     circuitInput.pkDAO = PKDAO.map((_) => String(_));
//     circuitInput.recipient = recipient;
//     circuitInput.relayer = relayer;
//     circuitInput.fee = String(fee);
//     circuitInput.tokenOut = tokenOut;
//     circuitInput.amountTokenOutMin = String(amountTokenOutMin);

//     circuitInput.nullifier = String(nullifier);
//     circuitInput.v = v.map((_) => String(_));
//     circuitInput.pathElements = proof.pathElements;
//     circuitInput.pathIndices = proof.pathIndices.map((_) => String(_));
//     circuitInput.index = String(indexAmount);

//     // console.log("circuitInput", circuitInput);
//     return {
//       circuitInput: circuitInput,
//       error: false,
//     };
//   } catch (e) {
//     console.log(e);
//     return {
//       circuitInput: "",
//       error: true,
//     };
//   }
// };

// Swap(
//   2565768520321566751814776235936631015488583705485544099469764147870754320603n,
//   "0x19F96D5e33cDbADc7E16e060E6276274560bbAB1",
//   "0x19F96D5e33cDbADc7E16e060E6276274560bbAB1",
//   [1000000000000000n, 1000000000000000n, 1000000000000000n, 1000000000000000n],
//   0n,
//   1n,
//   "0x19F96D5e33cDbADc7E16e060E6276274560bbAB1",
//   1000000000000000n
// ).then((res) => {
//   console.log(res);
// });
