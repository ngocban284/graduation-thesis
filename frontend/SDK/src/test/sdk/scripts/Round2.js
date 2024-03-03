const { ethers, upgrades } = require("hardhat");
const Mixer = require("mixerswap-helper-sdk");
const { abi } = require("./DKG.json");
const jsonBigint = require("json-bigint");
const snarkjs = require("snarkjs");
const DKGA = "0x9cD832530AaFE09D28C6A224F28bE88211376c26";

async function proveRound2(inputs) {
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    inputs,
    __dirname + "/../zk-resource/round2/Round2.wasm",
    __dirname + "/../zk-resource/round2/Round2.zkey"
  );
  return { proof, publicSignals };
}

async function main() {
  try {
    // Your existing code here
    const [commitee1, commitee2, commitee3, commitee4, commitee5] =
      await ethers.getSigners();

    console.log("commitee1", commitee1.address);
    console.log("commitee2", commitee2.address);
    console.log("commitee3", commitee3.address);
    console.log("commitee4", commitee4.address);
    console.log("commitee5", commitee5.address);

    const DKG = new Mixer.default.DKGHelper(
      "https://data-seed-prebsc-1-s2.bnbchain.org:8545",
      "0x9cD832530AaFE09D28C6A224F28bE88211376c26"
    );

    const coefCommitee1 = [
      516721395682801561716141896460050508274695713304743182937781325109698655987n,
      2407872435259171036839867874296209060248713403025001185341679275251691216027n,
      1434636916374214503983811962075477901978993914377126406639617085903476234233n,
    ];

    const {
      circuitInput: commitee1Round2CitcuitInput,
      error: commitee1Round2Error,
    } = await DKG.Round2Commit(commitee1.address, coefCommitee1);
    // console.log("commitee1 address", commitee1.address);
    // console.log("commitee1Round2CitcuitInput", commitee1Round2CitcuitInput);
    // console.log("commitee1Round2CitcuitInput", commitee1Round2CitcuitInput);

    if (commitee1Round2Error) {
      console.log("generate commitment round2 for commitee1 failed");
    }

    const { proof: commitee1Proofs, publicSignals: commitee1PublicSignals } =
      await proveRound2(commitee1Round2CitcuitInput);

    // console.log("proof", commitee1Proofs);
    // console.log("publicSignals", commitee1PublicSignals);

    const abiCoder = new ethers.AbiCoder();
    const commitee1ProofByte = abiCoder.encode(
      ["uint256[8]"],
      [
        [
          BigInt(commitee1Proofs.pi_a[0]),
          BigInt(commitee1Proofs.pi_a[1]),
          BigInt(commitee1Proofs.pi_b[0][1]),
          BigInt(commitee1Proofs.pi_b[0][0]),
          BigInt(commitee1Proofs.pi_b[1][1]),
          BigInt(commitee1Proofs.pi_b[1][0]),
          BigInt(commitee1Proofs.pi_c[0]),
          BigInt(commitee1Proofs.pi_c[1]),
        ],
      ]
    );

    const commitee1Round2encrypted = commitee1Round2CitcuitInput.encrypted;

    // each commitee generate round2
    const DKGContract = await ethers.getContractAt(abi, DKGA);

    // commitee1 submit round2
    const commitee1Round2 = await DKGContract.connect(commitee1).round2([
      commitee1Round2encrypted,
      commitee1ProofByte,
    ]);

    const coefCommitee2 = [
      1901237419054470941361649772576472965016856170582647588236242780088118629623n,
      518182743620056513312444249929965298814256622963323714694837083626646647159n,
      1055825209958165072125142686141760994686377649488509316568710270557928018573n,
    ];

    const {
      circuitInput: commitee2Round2CitcuitInput,
      error: commitee2Round2Error,
    } = await DKG.Round2Commit(commitee2.address, coefCommitee2);

    if (commitee2Round2Error) {
      console.log("generate commitment round2 for commitee2 failed");
    }

    const { proof: commitee2Proofs, publicSignals: commitee2PublicSignals } =
      await proveRound2(commitee2Round2CitcuitInput);

    const commitee2ProofByte = abiCoder.encode(
      ["uint256[8]"],
      [
        [
          BigInt(commitee2Proofs.pi_a[0]),
          BigInt(commitee2Proofs.pi_a[1]),
          BigInt(commitee2Proofs.pi_b[0][1]),
          BigInt(commitee2Proofs.pi_b[0][0]),
          BigInt(commitee2Proofs.pi_b[1][1]),
          BigInt(commitee2Proofs.pi_b[1][0]),
          BigInt(commitee2Proofs.pi_c[0]),
          BigInt(commitee2Proofs.pi_c[1]),
        ],
      ]
    );

    const commitee2Round2encrypted = commitee2Round2CitcuitInput.encrypted;

    console.log("commitee2ProofByte", commitee2ProofByte);
    console.log("commitee2Round2encrypted", commitee2Round2encrypted);

    // commitee2 submit round2
    // const commitee2Round2 = await DKGContract.connect(commitee2).round2([
    //   commitee2Round2encrypted,
    //   commitee2ProofByte,
    // ]);

    const coefCommitee3 = [
      1788562556299813093658109076324303851515237563428699911284434520142526261112n,
      1137050750540276090734859947128586280471647661614118050018324754820362875571n,
      1242708645567300516494058399653147757581981498487488919771358411751921518967n,
    ];

    const {
      circuitInput: commitee3Round2CitcuitInput,
      error: commitee3Round2Error,
    } = await DKG.Round2Commit(commitee3.address, coefCommitee3);
    if (commitee3Round2Error) {
      console.log("generate commitment round2 for commitee3 failed");
    }

    const { proof: commitee3Proofs, publicSignals: commitee3PublicSignals } =
      await proveRound2(commitee3Round2CitcuitInput);
    const commitee3ProofByte = abiCoder.encode(
      ["uint256[8]"],
      [
        [
          BigInt(commitee3Proofs.pi_a[0]),
          BigInt(commitee3Proofs.pi_a[1]),
          BigInt(commitee3Proofs.pi_b[0][1]),
          BigInt(commitee3Proofs.pi_b[0][0]),
          BigInt(commitee3Proofs.pi_b[1][1]),
          BigInt(commitee3Proofs.pi_b[1][0]),
          BigInt(commitee3Proofs.pi_c[0]),
          BigInt(commitee3Proofs.pi_c[1]),
        ],
      ]
    );

    const commitee3Round2encrypted = commitee3Round2CitcuitInput.encrypted;

    console.log("commitee3ProofByte", commitee3ProofByte);
    console.log("commitee3Round2encrypted", commitee3Round2encrypted);

    // commitee3 submit round2
    // const commitee3Round2 = await DKGContract.connect(commitee3).round2([
    //   commitee3Round2encrypted,
    //   commitee3ProofByte,
    // ]);

    const coefCommitee4 = [
      1341431653376105841150986907845468034559433614654449793971973332222386913507n,
      2556575020791091849022491421886011725382068733287645895273159015906253677146n,
      773582669012852305538745942213458441842635783478579235837184955261462811611n,
    ];

    const {
      circuitInput: commitee4Round2CitcuitInput,
      error: commitee4Round2Error,
    } = await DKG.Round2Commit(commitee4.address, coefCommitee4);
    if (commitee4Round2Error) {
      console.log("generate commitment round2 for commitee4 failed");
    }

    const { proof: commitee4Proofs, publicSignals: commitee4PublicSignals } =
      await proveRound2(commitee4Round2CitcuitInput);
    const commitee4ProofByte = abiCoder.encode(
      ["uint256[8]"],
      [
        [
          BigInt(commitee4Proofs.pi_a[0]),
          BigInt(commitee4Proofs.pi_a[1]),
          BigInt(commitee4Proofs.pi_b[0][1]),
          BigInt(commitee4Proofs.pi_b[0][0]),
          BigInt(commitee4Proofs.pi_b[1][1]),
          BigInt(commitee4Proofs.pi_b[1][0]),
          BigInt(commitee4Proofs.pi_c[0]),
          BigInt(commitee4Proofs.pi_c[1]),
        ],
      ]
    );

    const commitee4Round2encrypted = commitee4Round2CitcuitInput.encrypted;

    console.log("commitee4ProofByte", commitee4ProofByte);
    console.log("commitee4Round2encrypted", commitee4Round2encrypted);

    // commitee4 submit round2
    // const commitee4Round2 = await DKGContract.connect(commitee4).round2([
    //   commitee4Round2encrypted,
    //   commitee4ProofByte,
    // ]);

    const coefCommitee5 = [
      141364381501255733088209815728307868939285254965505776700474419622973616005n,
      134495137644486801299688823169512318534347188909658448867536645392731486417n,
      530395214626502723742899685770659949809902741632924518659221933541562387787n,
    ];

    const {
      circuitInput: commitee5Round2CitcuitInput,
      error: commitee5Round2Error,
    } = await DKG.Round2Commit(commitee5.address, coefCommitee5);
    if (commitee5Round2Error) {
      console.log("generate commitment round2 for commitee5 failed");
    }

    const { proof: commitee5Proofs, publicSignals: commitee5PublicSignals } =
      await proveRound2(commitee5Round2CitcuitInput);
    const commitee5ProofByte = abiCoder.encode(
      ["uint256[8]"],
      [
        [
          BigInt(commitee5Proofs.pi_a[0]),
          BigInt(commitee5Proofs.pi_a[1]),
          BigInt(commitee5Proofs.pi_b[0][1]),
          BigInt(commitee5Proofs.pi_b[0][0]),
          BigInt(commitee5Proofs.pi_b[1][1]),
          BigInt(commitee5Proofs.pi_b[1][0]),
          BigInt(commitee5Proofs.pi_c[0]),
          BigInt(commitee5Proofs.pi_c[1]),
        ],
      ]
    );

    const commitee5Round2encrypted = commitee5Round2CitcuitInput.encrypted;

    console.log("commitee5ProofByte", commitee5ProofByte);
    console.log("commitee5Round2encrypted", commitee5Round2encrypted);

    // commitee5 submit round2
    // const commitee5Round2 = await DKGContract.connect(commitee5).round2([
    //   commitee5Round2encrypted,
    //   commitee5ProofByte,
    // ]);

    // kill process
    process.exit(0);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
