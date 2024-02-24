export const DAPP_URL = "";

export const TELEGRAM_URL = "";

export const X_URL = "";

export const MEDIUM_URL = "";

export const C_URL = "";
export const C_TITLE = "SafeChest";
export const C_DESCRIPTION = "";
export const C_SEO_DESCRIPTION = C_DESCRIPTION;

export const GA_ID = "";

export const TOKEN_ADDRESS_TESTNET = ""; // testnet goerli
export const TOKEN_ADDRESS_MAINNET = "";

export const ERC20_ADDRESS = "";
export const PAYMENT_ADDRESS = ""; // testnet goerli
export const ETH_ADDRESS = "0x0000000000000000000000000000000000000000";
export const PAIR_TOKEN_ADDRESS = "";

export type AppConfig = {
  abis: {
    [name: string]: any;
  };
  addresses: {
    [chainId: number]: {
      [address: string]: string;
    };
  };
};

export const config: AppConfig = {
  abis: {
    Token: require("./abis/Token").Token,

    Payment: require("./abis/Payment").Payment,
  },

  addresses: {},
};
