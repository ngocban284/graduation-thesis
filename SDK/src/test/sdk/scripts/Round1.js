const { ethers, upgrades } = require("hardhat");
const Mixer = require("mixerswap-helper-sdk");
const { abi } = require("./DKG.json");

const DKGA = "0x9cD832530AaFE09D28C6A224F28bE88211376c26";

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

  const {
    coef: commitee1Coef,
    commitment: commitee1Round1,
    errorR1: commitee1Round1Error,
  } = await DKG.Round1RCommit();
  console.log("commitee1Coef", commitee1Coef);
  console.log("commitee1Round1", commitee1Round1);
  if (commitee1Round1Error) {
    console.log("generate commitment round1 for commitee1 failed");
  }

  const {
    coef: commitee2Coef,
    commitment: commitee2Round1,
    errorR1: commitee2Round1Error,
  } = await DKG.Round1RCommit();
  console.log("commitee2Coef", commitee2Coef);
  console.log("commitee2Round1", commitee2Round1);
  if (commitee2Round1Error) {
    console.log("generate commitment round1 for commitee2 failed");
  }

  const {
    coef: commitee3Coef,
    commitment: commitee3Round1,
    errorR1: commitee3Round1Error,
  } = await DKG.Round1RCommit();
  console.log("commitee3Coef", commitee3Coef);
  console.log("commitee3Round1", commitee3Round1);
  if (commitee3Round1Error) {
    console.log("generate commitment round1 for commitee3 failed");
  }

  const {
    coef: commitee4Coef,
    commitment: commitee4Round1,
    errorR1: commitee4Round1Error,
  } = await DKG.Round1RCommit();
  console.log("commitee4Coef", commitee4Coef);
  console.log("commitee4Round1", commitee4Round1);
  if (commitee4Round1Error) {
    console.log("generate commitment round1 for commitee4 failed");
  }

  const {
    coef: commitee5Coef,
    commitment: commitee5Round1,
    errorR1: commitee5Round1Error,
  } = await DKG.Round1RCommit();
  console.log("commitee5Coef", commitee5Coef);
  console.log("commitee5Round1", commitee5Round1);
  if (commitee5Round1Error) {
    console.log("generate commitment round1 for commitee5 failed");
  }

  // each commitee generate round2
  const provider = new ethers.JsonRpcProvider(
    "https://data-seed-prebsc-1-s2.bnbchain.org:8545"
  );
  const DKGContract = await ethers.getContractAt(abi, DKGA);

  const round1Commitee1 =
    await DKGContract.connect(commitee1).round1(commitee1Round1);

  const round1Commitee2 =
    await DKGContract.connect(commitee2).round1(commitee2Round1);

  const round1Commitee3 =
    await DKGContract.connect(commitee3).round1(commitee3Round1);

  const round1Commitee4 =
    await DKGContract.connect(commitee4).round1(commitee4Round1);

  const round1Commitee5 =
    await DKGContract.connect(commitee5).round1(commitee5Round1);
}

main();
