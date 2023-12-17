import React from "react";

import { Mainnet, DAppProvider, Goerli } from "@usedapp/core";
// import { getDefaultProvider } from "ethers";

const config = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    [Mainnet.chainId]: "https://eth.meowrpc.com",
    [Goerli.chainId]: "https://ethereum-goerli.publicnode.com",
  },
};

function Web3Layout(props) {
  return <DAppProvider config={config}>{props.children}</DAppProvider>;
}

export { Web3Layout };
