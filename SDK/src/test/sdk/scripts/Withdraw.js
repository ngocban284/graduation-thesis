const { ethers, upgrades } = require("hardhat");
const Mixer = require("mixerswap-helper-sdk");
const { abi } = require("./ETHMixer.json");
const snarkjs = require("snarkjs");
const ETHMixerA = "0xe9F98D6B186cAa76555350d959b86eDf67b5af75";

async function proveWithdraw(inputs) {
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    inputs,
    __dirname + "/../zk-resource/withdraw/Withdraw.wasm",
    __dirname + "/../zk-resource/withdraw/Withdraw.zkey"
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

  const ETHMixerContract = await ethers.getContractAt(abi, ETHMixerA);

  console.log("ETHMixerContract", await ETHMixerContract.getAddress());

  const MixerHelper = new Mixer.default.MixerHelper(
    "https://data-seed-prebsc-1-s2.bnbchain.org:8545",
    "0x9cD832530AaFE09D28C6A224F28bE88211376c26"
  );

  //   2565768520321566751814776235936631015488583705485544099469764147870754320603n
  const {
    circuitInput: withdrawCircuitInputParams,
    error: withdrawCircuitInputError,
  } = await MixerHelper.Withdraw(
    2565768520321566751814776235936631015488583705485544099469764147870754320603n,
    commitee3.address,
    commitee3.address,
    [
      1000000000000000n,
      1000000000000000n,
      1000000000000000n,
      1000000000000000n,
    ],
    0n,
    1n
  );

  if (withdrawCircuitInputError) {
    console.log("gen withdraw circuit input failed");
  }

  // console.log("withdrawCircuitInputParams", withdrawCircuitInputParams);

  const {
    proof: commitee3WithdrawProofs,
    publicSignals: commitee3WithdrawPublicSignals,
  } = await proveWithdraw(withdrawCircuitInputParams);

  // console.log("proof", commitee3WithdrawProofs);
  // console.log("publicSignals", commitee3WithdrawPublicSignals);

  const abiCoder = new ethers.AbiCoder();
  const commitee3WithdrawProofByte = abiCoder.encode(
    ["uint256[8]"],
    [
      [
        BigInt(commitee3WithdrawProofs.pi_a[0]),
        BigInt(commitee3WithdrawProofs.pi_a[1]),
        BigInt(commitee3WithdrawProofs.pi_b[0][1]),
        BigInt(commitee3WithdrawProofs.pi_b[0][0]),
        BigInt(commitee3WithdrawProofs.pi_b[1][1]),
        BigInt(commitee3WithdrawProofs.pi_b[1][0]),
        BigInt(commitee3WithdrawProofs.pi_c[0]),
        BigInt(commitee3WithdrawProofs.pi_c[1]),
      ],
    ]
  );

  // console.log("commitee3WithdrawProofByte", commitee3WithdrawProofByte);
  // console.log("publicSignals", commitee3WithdrawPublicSignals);
  console.log("withdrawParams", [
    commitee3WithdrawProofByte,
    commitee3WithdrawPublicSignals[0],
    commitee3WithdrawPublicSignals[1],
    commitee3WithdrawPublicSignals[2],
    commitee3WithdrawPublicSignals[3],
    commitee3.address,
    commitee3.address,
    commitee3WithdrawPublicSignals[8],
  ]);
  // const withdrawTx = await ETHMixerContract.connect(commitee3).withdraw([
  //   commitee3WithdrawProofByte,
  //   commitee3WithdrawPublicSignals[0],
  //   commitee3WithdrawPublicSignals[1],
  //   commitee3WithdrawPublicSignals[2],
  //   commitee3WithdrawPublicSignals[3],
  //   commitee3.address,
  //   commitee3.address,
  //   commitee3WithdrawPublicSignals[8],
  // ]);

  // console.log("withdrawTx", withdrawTx);

  process.exit(0);
}

main();
