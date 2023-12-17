export const Payment = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_newDev",
        type: "address",
      },
    ],
    name: "changeDevAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum HEHEHE.SubcriptionTier",
        name: "_subcriptionTier",
        type: "uint8",
      },
      {
        internalType: "uint256",
        name: "_holdRequirement",
        type: "uint256",
      },
    ],
    name: "changeHoldRequirement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum HEHEHE.SubcriptionTier",
        name: "_subcriptionTier",
        type: "uint8",
      },
      {
        components: [
          {
            internalType: "uint256",
            name: "cost",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "duration",
            type: "uint256",
          },
        ],
        internalType: "struct HEHEHE.SubcriptionInfo",
        name: "_subcriptionInfo",
        type: "tuple",
      },
    ],
    name: "changeSubcriptionInfos",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_newToken",
        type: "address",
      },
    ],
    name: "changeTokenAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_reciever",
        type: "address",
      },
    ],
    name: "extendSubscription",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_dev",
        type: "address",
      },
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
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
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum HEHEHE.SubcriptionTier",
        name: "_subscriptionTier",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "_reciever",
        type: "address",
      },
    ],
    name: "subcribe",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "_user",
        type: "address[]",
      },
    ],
    name: "userProfiles",
    outputs: [
      {
        components: [
          {
            internalType: "enum HEHEHE.SubcriptionTier",
            name: "subscriptionType",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "startTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "endTime",
            type: "uint256",
          },
        ],
        internalType: "struct HEHEHE.UserProfile[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawETH",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
];
