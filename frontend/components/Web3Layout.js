import React from "react";

import { DAppProvider, BSCTestnet } from "@usedapp/core";
// import { getDefaultProvider } from "ethers";

const config = {
  readOnlyChainId: BSCTestnet.chainId,
  readOnlyUrls: {
    [421614]: "https://sepolia-rollup.arbitrum.io/rpc",
    [BSCTestnet.chainId]: "https://data-seed-prebsc-2-s2.bnbchain.org:8545/",
  },
};

function Web3Layout(props) {
  return <DAppProvider config={config}>{props.children}</DAppProvider>;
}

export { Web3Layout };
