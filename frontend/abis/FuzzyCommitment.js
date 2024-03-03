export const FuzzyCommitmentAbi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_verifierAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "featureVectorHash",
        type: "uint256",
      },
    ],
    name: "RecoveryRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "nullifierHash",
        type: "uint256",
      },
    ],
    name: "WalletRecovered",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_wallet",
        type: "address",
      },
    ],
    name: "getCommitment",
    outputs: [
      {
        internalType: "uint256[128]",
        name: "",
        type: "uint256[128]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_wallet",
        type: "address",
      },
    ],
    name: "getFeatureVectorHash",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_wallet",
        type: "address",
      },
    ],
    name: "getHashOfPersonalInfoHash",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getOwner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_nullifierHash",
        type: "uint256",
      },
    ],
    name: "getUsedNullifierHash",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVerifierAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[2]",
        name: "_a",
        type: "uint256[2]",
      },
      {
        internalType: "uint256[2][2]",
        name: "_b",
        type: "uint256[2][2]",
      },
      {
        internalType: "uint256[2]",
        name: "_c",
        type: "uint256[2]",
      },
      {
        internalType: "uint256[3]",
        name: "_input",
        type: "uint256[3]",
      },
      {
        internalType: "address",
        name: "_wallet",
        type: "address",
      },
    ],
    name: "recoverWallet",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_featureVectorHash",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_hashOfPersonalInfoHash",
        type: "uint256",
      },
      {
        internalType: "uint256[128]",
        name: "_commitment",
        type: "uint256[128]",
      },
    ],
    name: "registerForRecovery",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256[128]",
        name: "_zeroCommitment",
        type: "uint256[128]",
      },
    ],
    name: "removeRecovery",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_verifierAddress",
        type: "address",
      },
    ],
    name: "setVerifierAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
