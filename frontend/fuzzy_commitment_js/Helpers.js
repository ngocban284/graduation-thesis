// import { buildPoseidon } from 'circomlibjs';
const { buildPoseidon } = require("circomlibjs");
const { ethers } = require("ethers");
var sha256 = require("js-sha256").sha256;
// import { parse } from 'marked';
// const bigInt = require("big-integer");

const crypto = require("crypto");

const generateRandomSecret = (length) => {
  var secret = crypto.randomBytes(length);
  return new Uint8Array(secret);
};

const binaryQuantize = (value) => {
  if (value < 0) {
    return 0;
  } else {
    return 1;
  }
};

const padArray = (arr, size, paddingValue) => {
  console.log("arr", arr);
  var result = new Uint8Array(size);
  result.set(arr);
  for (var i = arr.length; i < size; i++) {
    result[i] = paddingValue;
  }
  return result;
};

const xor = (a, b) => {
  var result = new Int32Array(a.length);
  for (var i = 0; i < a.length; i++) {
    result[i] = a[i] ^ b[i];
  }
  return result;
};

const poseidon128Hash = async (inputs) => {
  if (inputs.length !== 128) {
    throw new Error("Input array must contain 128 elements.");
  }
  const poseidon = await buildPoseidon();
  console.log("inputs", inputs);
  // convert inputs to BigInts
  const bigIntInputs = Object.values(inputs).map((value) => BigInt(value));
  // Hash inputs in chunks of 16
  const intermediateHashes = [];
  for (let i = 0; i < 8; i++) {
    const chunk = bigIntInputs.slice(i * 16, (i + 1) * 16);
    const hashChunk = poseidon(chunk);
    intermediateHashes.push(hashChunk);
  }

  // Hash the intermediate hashes into a final single hash
  const finalHash = poseidon(intermediateHashes);
  const finalHashStr = poseidon.F.toString(finalHash);
  return BigInt(finalHashStr);
};

const poseidonHash = async (input) => {
  console.log("input", input);
  const poseidon = await buildPoseidon();
  const hashStr = poseidon.F.toString(poseidon(input));
  return BigInt(hashStr);
};

const generateRandom128Bit = () => {
  const hexLength = 16; // 128 bits in hex is 32 characters
  let randomHex = "0x";

  while (randomHex.length < hexLength + 2) {
    // +2 for '0x'
    randomHex += Math.floor(Math.random() * 16).toString(16);
  }
  // const randomInt = parseInt(randomHex, 16);
  return BigInt(randomHex);
};

// function to hash string based on sha256 and return bigInt
const sha256ToBigInt = async (str) => {
  // Encode the string as a Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(str);

  // Calculate the SHA-256 hash
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert the hash to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Convert the hexadecimal string to BigInt
  const hashBigInt = "0x" + hashHex;

  return BigInt(hashBigInt);
};

const sha256HasherToBigInt = async (str) => {
  const hashed = sha256(str);

  //  convert the hash to a BigInt
  const hashBigInt = "0x" + hashed;

  return BigInt(hashBigInt);
};

module.exports = {
  generateRandomSecret,
  binaryQuantize,
  padArray,
  xor,
  poseidon128Hash,
  poseidonHash,
  generateRandom128Bit,
  sha256ToBigInt,
  sha256HasherToBigInt,
};
