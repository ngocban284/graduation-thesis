const { ethers, upgrades } = require("hardhat");
const Mixer = require("mixerswap-helper-sdk");
const { abi } = require("./DKG.json");
const snarkjs = require("snarkjs");

const DKGA = "0x9cD832530AaFE09D28C6A224F28bE88211376c26";

async function proveReveal(inputs) {
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    inputs,
    __dirname + "/../zk-resource/reveal/Reveal.wasm",
    __dirname + "/../zk-resource/reveal/Reveal.zkey"
  );
  return { proof, publicSignals };
}

async function main() {
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

  const commitee1Coef = [
    516721395682801561716141896460050508274695713304743182937781325109698655987n,
    2407872435259171036839867874296209060248713403025001185341679275251691216027n,
    1434636916374214503983811962075477901978993914377126406639617085903476234233n,
  ];

  const pkAddressIn = [
    11504656306667765137504037971796461430914255895455958202365368149753066664983n,
    9604695707863003473345644549569384556017439611893764141909045059476297154194n,
  ];

  const {
    circuitInput: commitee1RevealCircuitInput,
    error: commitee1RevealError,
  } = await DKG.RevealCommit(commitee1.address, commitee1Coef, pkAddressIn);

  // console.log("commitee1RevealCircuitInput", commitee1RevealCircuitInput);

  if (commitee1RevealError) {
    console.log("commitee1RevealError", commitee1RevealError);
  }

  const {
    proof: commitee1RevealProofs,
    publicSignals: commitee1RevealPublicSignals,
  } = await proveReveal(commitee1RevealCircuitInput);

  // console.log("commitee1RevealProofs", commitee1RevealProofs);
  // console.log("commitee1RevealPublicSignals", commitee1RevealPublicSignals);

  const abiCoder = new ethers.AbiCoder();
  const commitee1RevealProofByte = abiCoder.encode(
    ["uint256[8]"],
    [
      [
        BigInt(commitee1RevealProofs.pi_a[0]),
        BigInt(commitee1RevealProofs.pi_a[1]),
        BigInt(commitee1RevealProofs.pi_b[0][1]),
        BigInt(commitee1RevealProofs.pi_b[0][0]),
        BigInt(commitee1RevealProofs.pi_b[1][1]),
        BigInt(commitee1RevealProofs.pi_b[1][0]),
        BigInt(commitee1RevealProofs.pi_c[0]),
        BigInt(commitee1RevealProofs.pi_c[1]),
      ],
    ]
  );

  // each commitee generate round2
  const provider = new ethers.JsonRpcProvider(
    "https://data-seed-prebsc-1-s2.bnbchain.org:8545"
  );
  const DKGContract = await ethers.getContractAt(abi, DKGA);

  const commitee1RevealParams = [
    [commitee1RevealPublicSignals[18], commitee1RevealPublicSignals[19]],
    [commitee1RevealPublicSignals[20], commitee1RevealPublicSignals[21]],
    commitee1RevealProofByte,
  ];

  // console.log("params", params);

  // const tx = await DKGContract.connect(commitee1).reveal(commitee1RevealParams);

  // commitee2

  const commitee2Coef = [
    1901237419054470941361649772576472965016856170582647588236242780088118629623n,
    518182743620056513312444249929965298814256622963323714694837083626646647159n,
    1055825209958165072125142686141760994686377649488509316568710270557928018573n,
  ];

  const {
    circuitInput: commitee2RevealCircuitInput,
    error: commitee2RevealError,
  } = await DKG.RevealCommit(commitee2.address, commitee2Coef, pkAddressIn);

  // console.log("commitee2RevealCircuitInput", commitee2RevealCircuitInput);

  if (commitee2RevealError) {
    console.log("commitee2RevealError", commitee2RevealError);
  }

  const {
    proof: commitee2RevealProofs,
    publicSignals: commitee2RevealPublicSignals,
  } = await proveReveal(commitee2RevealCircuitInput);

  const commitee2RevealProofByte = abiCoder.encode(
    ["uint256[8]"],
    [
      [
        BigInt(commitee2RevealProofs.pi_a[0]),
        BigInt(commitee2RevealProofs.pi_a[1]),
        BigInt(commitee2RevealProofs.pi_b[0][1]),
        BigInt(commitee2RevealProofs.pi_b[0][0]),
        BigInt(commitee2RevealProofs.pi_b[1][1]),
        BigInt(commitee2RevealProofs.pi_b[1][0]),
        BigInt(commitee2RevealProofs.pi_c[0]),
        BigInt(commitee2RevealProofs.pi_c[1]),
      ],
    ]
  );

  const commitee2RevealParams = [
    [commitee2RevealPublicSignals[18], commitee2RevealPublicSignals[19]],
    [commitee2RevealPublicSignals[20], commitee2RevealPublicSignals[21]],
    commitee2RevealProofByte,
  ];

  // const tx2 = await DKGContract.connect(commitee2).reveal(
  //   commitee2RevealParams
  // );

  // commitee3

  const commitee3Coef = [
    1788562556299813093658109076324303851515237563428699911284434520142526261112n,
    1137050750540276090734859947128586280471647661614118050018324754820362875571n,
    1242708645567300516494058399653147757581981498487488919771358411751921518967n,
  ];

  const {
    circuitInput: commitee3RevealCircuitInput,
    error: commitee3RevealError,
  } = await DKG.RevealCommit(commitee3.address, commitee3Coef, pkAddressIn);

  // console.log("commitee2RevealCircuitInput", commitee2RevealCircuitInput);

  if (commitee3RevealError) {
    console.log("commitee2RevealError", commitee2RevealError);
  }

  const {
    proof: commitee3RevealProofs,
    publicSignals: commitee3RevealPublicSignals,
  } = await proveReveal(commitee3RevealCircuitInput);

  const commitee3RevealProofByte = abiCoder.encode(
    ["uint256[8]"],
    [
      [
        BigInt(commitee3RevealProofs.pi_a[0]),
        BigInt(commitee3RevealProofs.pi_a[1]),
        BigInt(commitee3RevealProofs.pi_b[0][1]),
        BigInt(commitee3RevealProofs.pi_b[0][0]),
        BigInt(commitee3RevealProofs.pi_b[1][1]),
        BigInt(commitee3RevealProofs.pi_b[1][0]),
        BigInt(commitee3RevealProofs.pi_c[0]),
        BigInt(commitee3RevealProofs.pi_c[1]),
      ],
    ]
  );

  const commitee3RevealParams = [
    [commitee3RevealPublicSignals[18], commitee3RevealPublicSignals[19]],
    [commitee3RevealPublicSignals[20], commitee3RevealPublicSignals[21]],
    commitee3RevealProofByte,
  ];

  // const tx3 = await DKGContract.connect(commitee3).reveal(
  //   commitee3RevealParams
  // );

  process.exit(0);
}

main();
