import { ethers } from "ethers";
import { useMemo, useEffect, useState } from "react";

import {
  Goerli,
  Mainnet,
  shortenIfAddress,
  useEtherBalance,
  useEthers,
} from "@usedapp/core";

import { EthItem } from "../Util/eth";
import { BnbItem } from "../Util/bnb";
import { UsdtItem } from "../Util/usdt";
import { SelectTokenPopup } from "../Popup/SelectTokenPopup";
import { WithdrawToken } from "./Withdraw";
import { SwapToken } from "./Swap";

export const Withdraw = () => {
  const { switchNetwork, chainId, account, deactivate, activateBrowserWallet } =
    useEthers();

  useEffect(() => {
    if (!chainId) {
      switchNetwork(Goerli.chainId).then(() => activateBrowserWallet());
    }
  }, [chainId]);
  const balanceHex = useEtherBalance(account);

  const [amount, setAmount] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [selectTokenPopup, setSelectTokenPopup] = useState(false);
  const [selectTargetTokenPopup, setSelectTargetTokenPopup] = useState(false);
  const [network, setNetwork] = useState({
    ethereum: true,
    bnb: false,
    zksync: false,
  });
  const [selectedToken, setSelectedToken] = useState("");
  const [selectedTargetToken, setSelectedTargetToken] = useState("");
  const [despositPopup, setDepositPopup] = useState(false);

  const [action, setAction] = useState({
    withdraw: true,
    swap: false,
  });

  const balance = useMemo(() => {
    if (balanceHex) {
      // convert string 0.004844403164078278 to number and round to 2 decimals

      const balance = parseFloat(ethers.utils.formatEther(balanceHex)).toFixed(
        5
      );

      return balance;
    }
  }, [balanceHex]);

  const handleSetAmount = (e: any) => {
    setAmount(e.value);
  };

  const handleSetSecretKey = (e: any) => {
    setSecretKey(e.value);
  };

  const handleNetwork = (network: string) => {
    if (network === "ethereum") {
      setNetwork({
        ethereum: true,
        bnb: false,
        zksync: false,
      });
    } else if (network === "bnb") {
      setNetwork({
        ethereum: false,
        bnb: true,
        zksync: false,
      });
    } else if (network === "zksync") {
      setNetwork({
        ethereum: false,
        bnb: false,
        zksync: true,
      });
    }
  };

  const handleSelectedToken = (token: string) => {
    setSelectedToken(token);
    setSelectTokenPopup(false);
  };

  const handleSelectedTargetToken = (token: string) => {
    setSelectedTargetToken(token);
    setSelectTargetTokenPopup(false);
  };

  const handleActionOption = (option: string) => {
    if (option === "withdraw") {
      setAction({
        withdraw: true,
        swap: false,
      });
    } else if (option === "swap") {
      setAction({
        withdraw: false,
        swap: true,
      });
    }
  };

  return (
    <>
      {selectTokenPopup && (
        <SelectTokenPopup
          network={network}
          setSelectTokenPopup={setSelectTokenPopup}
          handleNetwork={handleNetwork}
          handleSelectedToken={handleSelectedToken}
        />
      )}

      {selectTargetTokenPopup && (
        <SelectTokenPopup
          network={network}
          setSelectTokenPopup={setSelectTargetTokenPopup}
          handleNetwork={handleNetwork}
          handleSelectedToken={handleSelectedTargetToken}
        />
      )}

      <div className=" md:w-[50%] w-[95%]  mx-auto ">
        <div className="text-white flex flex-col gap-4  my-24  border-features py-8">
          <div className="flex flex-row text-sm justify-end mx-6">
            <div
              className="flex flex-row gap-1 cursor-pointer"
              onClick={() => setSelectTokenPopup(true)}
            >
              {selectedToken == "" ? (
                <>
                  <div> Select Token </div>

                  <div className="-mt-1">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 10L12 14L16 10"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </>
              ) : selectedToken === "eth" ? (
                <>
                  <div className="-mt-1">
                    <EthItem />
                  </div>
                  <div className="my-auto"> ETH </div>
                </>
              ) : selectedToken === "bnb" ? (
                <>
                  <div className="-mt-1">
                    <BnbItem />
                  </div>
                  <div className="my-auto"> BNB </div>
                </>
              ) : (
                <>
                  <div className="-mt-1">
                    <UsdtItem />
                  </div>
                  <div className="my-auto"> USDT </div>
                </>
              )}
            </div>
          </div>

          <div className=" mx-6 flex flex-col items-center">
            <div className="md:w-1/2 w-[90%] flex flex-row gap-4 justify-center items-center">
              <input
                className="md:w-1/6 w-1/4 bg-transparent  rounded-xl py-4 text-center"
                placeholder="0"
                type="number"
                // value={amount1 == 0 ? "" : amount1}
                // onChange={(e) => handleAmount1(e)}
                style={{
                  background: "#142631",
                }}
              />
              <input
                className="md:w-1/6 w-1/4 bg-transparent  rounded-xl py-4 text-center"
                placeholder="0"
                type="number"
                // value={amount2 == 0 ? "" : amount2}
                // onChange={(e) => handleAmount2(e)}
                style={{
                  background: "#142631",
                }}
              />
              <input
                className="md:w-1/6 w-1/4 bg-transparent  rounded-xl py-4 text-center"
                placeholder="0"
                type="number"
                // value={amount3 == 0 ? "" : amount3}
                // onChange={(e) => handleAmount3(e)}
                style={{
                  background: "#142631",
                }}
              />
              <input
                className="md:w-1/6 w-1/4 bg-transparent  rounded-xl py-4 text-center"
                placeholder="0"
                type="number"
                // value={amount4 == 0 ? "" : amount4}
                // onChange={(e) => handleAmount4(e)}
                style={{
                  background: "#142631",
                }}
              />
            </div>
          </div>

          <input
            className="mx-6 bg-transparent rounded-md px-4 py-3"
            placeholder="Secret Key"
            value={secretKey}
            type="password"
            style={{
              background: "#142631",
            }}
            onChange={(e: any) => handleSetSecretKey(e)}
          />

          <input
            className="mx-6 bg-transparent rounded-md px-4 py-3"
            placeholder="Recipient address"
            value={secretKey}
            // type="password"
            style={{
              background: "#142631",
            }}
            onChange={(e: any) => handleSetSecretKey(e)}
          />

          <div className="mx-6  flex flex-row mt-6">
            <div
              className={[
                "text-center w-1/2 p-2  cursor-pointer",
                action.withdraw
                  ? "withdraw-btn-active-background"
                  : "withdraw-btn-disable-background",
              ].join(" ")}
              style={{
                borderTopLeftRadius: "6px",
                borderBottomLeftRadius: "6px",
                border: action.withdraw ? "1px solid #00BBB0" : "",
                borderRight: action.withdraw ? "1px solid #00BBB0" : "none",
                background: action.withdraw
                  ? "withdraw-btn-active-background"
                  : "",
                color: action.withdraw ? "white" : "#637592",
              }}
              onClick={() => handleActionOption("withdraw")}
            >
              Withdraw
            </div>
            <div
              className={[
                "text-center w-1/2 p-2 cursor-pointer",
                action.swap
                  ? "withdraw-btn-active-background"
                  : "withdraw-btn-disable-background",
              ].join(" ")}
              style={{
                borderTopRightRadius: "6px",
                borderBottomRightRadius: "6px",
                border: action.swap ? "1px solid #00BBB0" : "",
                borderLeft: action.swap ? "1px solid #00BBB0" : "none",
                color: action.swap ? "white" : "#637592",
              }}
              onClick={() => handleActionOption("swap")}
            >
              Swap
            </div>
          </div>

          {action.withdraw ? (
            <>
              <WithdrawToken />
            </>
          ) : (
            <>
              <SwapToken
                setSelectTargetTokenPopup={setSelectTargetTokenPopup}
                selectedTargetToken={selectedTargetToken}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};
