const { ethers } = require("hardhat");

const proofBytes =
  "0x0140f9485f99ef6ba64afc00c49e5604a7a8d624210330c7192a55ada43c69cb2963468a177571809b32de16f2a20dc88f70c5cd6da8b1d170ea2407cbb441622e7afda4935159e62af46cb19f2336892b4fdbf1a8c9e04247c06bcc4fccfa1d056f41589d38ac5334b694fd98c1cf871faf46250dec38e7251700b88f1326fc0ebbbe052a1069072e6fc25f1e4ec14d8c84e3b196648775c8cf1fb64f3da23f2671fa28565670c3155dc97d737a62da4437380da5fd85f468927b4af4bcc09f27abc2e7f86051ddae7156e6ded74c50f36d3a4fc74dd77972302b283157881715fab804d544fbf85f3dca2974b1fecc7ba8cfb0b1792f0e890a25f009c674a3";
const publicInput = [
  "10618799330704101965734848585834142656546426425175136688602085388641240644006",
  "9706127653673437904913286441550470179391329121265760033301340505599930811398",
  "20792832894105690845711263331289902225746955981417935440265876570428047529044",
];
const sourceWallet = "0xBc8f25A46f36CBA767f6eb8C442DdF22Dc78F5b9";

let ETHPrivateContract;
let ethPrivateContract;
let user1;
let Groth16VerifierReedSolomon, groth16VerifierReedSolomon;
let Groth16VerifierRound2, groth16VerifierRound2;
let Groth16VerifierWithdraw, groth16VerifierWithdraw;
let Groth16VerifierReveal, groth16VerifierReveal;
let Verifier, verifier;

before(async () => {
  [user1] = await ethers.getSigners();
  Groth16VerifierReedSolomon = await ethers.getContractFactory(
    "Groth16VerifierReedSolomon"
  );
  groth16VerifierReedSolomon = await Groth16VerifierReedSolomon.deploy();

  Groth16VerifierRound2 = await ethers.getContractFactory(
    "Groth16VerifierRound2"
  );
  groth16VerifierRound2 = await Groth16VerifierRound2.deploy();

  Groth16VerifierReveal = await ethers.getContractFactory(
    "Groth16VerifierReveal"
  );
  groth16VerifierReveal = await Groth16VerifierReveal.deploy();

  Groth16VerifierWithdraw = await ethers.getContractFactory(
    "Groth16VerifierWithdraw"
  );
  groth16VerifierWithdraw = await Groth16VerifierWithdraw.deploy();

  console.log(
    "Groth16VerifierReedSolomon deployed to:",
    await groth16VerifierReedSolomon.getAddress()
  );

  Verifier = await ethers.getContractFactory("Verifier");
  verifier = await Verifier.deploy([
    groth16VerifierRound2.getAddress(),
    groth16VerifierReveal.getAddress(),
    groth16VerifierWithdraw.getAddress(),
    groth16VerifierReedSolomon.getAddress(),
  ]);

  console.log("Verifier deployed to:", await verifier.getAddress());

  // ethPrivateContract = await ETHPrivateContract.deploy();
  // groth16VerifierReedSolomon = await ethers.getContractFactory("Groth16VerifierReedSolomon");
  // groth16VerifierReedSolomon = await groth16VerifierReedSolomon.deploy();
});

describe("Recovery", function () {
  it("Should recover the public input", async function () {
    const result = await verifier
      .connect(user1)
      .verifyProof(4, proofBytes, publicInput);

    console.log("result", result);
  });
});
