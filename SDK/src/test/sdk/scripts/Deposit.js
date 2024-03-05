const { ethers, upgrades } = require("hardhat");
const Mixer = require("mixerswap-helper-sdk");
const { abi } = require("./ETHMixer.json");

// const ETHMixerA = "0x18A0df5c96B2Df788dB3083f4cF75aa9A3a9cf45"; // bsc testnet
const ETHMixerA = "0x09D94F32Dc76bbbd5aFdf27451daD208E90652cE"; // arb sepolia

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
    "https://sepolia-rollup.arbitrum.io/rpc",
    "0x4506A373BFfDf5F113d4f40f7CA7A4CAB4f1C91d"
  );

  // const { randomNullifier: nullifier, errorRN: nullifierError } =
  //   await MixerHelper.GenerateNullifier();
  // console.log("nullifier", nullifier);

  // if (nullifierError) {
  //   console.log("generate nullifier failed");
  // }
  // const nullifier =
  //   2565768520321566751814776235936631015488583705485544099469764147870754320603n;
  const nullifier =
    2565768520321566751814776235936631015488583705485544099469764147870754320603n;

  const { params: depositParams, error: depositError } =
    await MixerHelper.Deposit(nullifier, [
      1000000000000000n,
      1000000000000000n,
      1000000000000000n,
      1000000000000000n,
    ]);

  if (depositError) {
    console.log("gen deposit params failed");
  }

  console.log("depositParams", depositParams);

  // deposit
  const depositTx = await ETHMixerContract.connect(commitee3).deposit(
    depositParams,
    {
      value: 4000000000000000,
    }
  );

  // const hashLeaf =
  //   await ETHMixerContract.connect(commitee3).getHashLeaf(depositParams);
  // console.log("hashLeaf", hashLeaf);
}

main();
