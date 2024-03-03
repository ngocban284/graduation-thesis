import { BigNumber, ethers } from "ethers";
import { useMemo, useEffect, useState } from "react";

import {
  shortenIfAddress,
  useEtherBalance,
  useEthers,
  BSCTestnet,
} from "@usedapp/core";

import { EthItem } from "../Util/eth";
import { BnbItem } from "../Util/bnb";
import { UsdtItem } from "../Util/usdt";

import { SelectTokenPopup } from "../Popup/SelectTokenPopup";
import { Introduction } from "./Introduction";
import { DepositPopup } from "../Popup/DepositPopup";

import { V_TOTAL } from "../../constants/index";

export const Deposit = () => {
  const { switchNetwork, chainId, account, deactivate, activateBrowserWallet } =
    useEthers();

  useEffect(() => {
    if (!chainId) {
      switchNetwork(BSCTestnet.chainId).then(() => activateBrowserWallet());
    }
  }, [chainId]);
  const balanceHex = useEtherBalance(account);

  const balance = useMemo(() => {
    if (balanceHex) {
      // convert string 0.004844403164078278 to number and round to 2 decimals

      const balance = parseFloat(ethers.utils.formatEther(balanceHex)).toFixed(
        5
      );

      return balance;
    }
  }, [balanceHex]);

  const [selectTokenPopup, setSelectTokenPopup] = useState(false);
  const [network, setNetwork] = useState({
    ethereum: true,
    bnb: false,
    zksync: false,
  });
  const [despositPopup, setDepositPopup] = useState(false);
  const [selectedToken, setSelectedToken] = useState("");
  const [amount, setAmount] = useState(0);
  const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");
  const [amount3, setAmount3] = useState("");
  const [amount4, setAmount4] = useState("");
  const [vPrivate, setVPrivate] = useState([]);
  const [total, setTotal] = useState("");
  const [gasPrice, setGasPrice] = useState(2);

  const handleGasChange = (e) => {
    setGasPrice(parseInt(e.target.value, 10));
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

  const handleAmount1 = (e) => {
    setAmount1(e.target.value);
  };

  const handleAmount2 = (e) => {
    setAmount2(e.target.value);
  };

  const handleAmount3 = (e) => {
    setAmount3(e.target.value);
  };

  const handleAmount4 = (e) => {
    setAmount4(e.target.value);
  };

  useEffect(() => {
    if (amount1 !== "" && amount2 !== "" && amount3 !== "" && amount4 !== "") {
      const total =
        parseFloat(amount1) +
        parseFloat(amount2) +
        parseFloat(amount3) +
        parseFloat(amount4);

      if (total == V_TOTAL) {
        setTotal(String(total));

        setVPrivate([
          BigInt(parseFloat(amount1) * 10 ** 18),
          BigInt(parseFloat(amount2) * 10 ** 18),
          BigInt(parseFloat(amount3) * 10 ** 18),
          BigInt(parseFloat(amount4) * 10 ** 18),
        ]);
        console.log("vPrivate", vPrivate);
      } else {
        setTotal("0");
      }
    } else {
      setTotal("0");
    }
  }, [amount1, amount2, amount3, amount4]);
  console.log("total", total);

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

      {despositPopup && (
        <DepositPopup
          setDepositPopup={setDepositPopup}
          selectedToken={selectedToken}
          setGasPrice={setGasPrice}
          amount1={amount1}
          amount2={amount2}
          amount3={amount3}
          amount4={amount4}
          total={total}
          gasPrice={gasPrice}
        />
      )}

      <div className=" md:w-[50%] w-[95%]  mx-auto ">
        <div className="text-white flex flex-col gap-4  my-24  border-features py-8">
          <div className="flex flex-row text-sm justify-between mx-6">
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
            <div>Balance: {balance} ETH</div>
          </div>
          {/* input  */}

          {/* <input
            className=" mx-6 bg-transparent  rounded-md px-4 py-3"
            placeholder="0.00"
            value={amount}
            style={{
              background: "#142631",
            }}
          /> */}

          <div className=" mx-6 flex flex-col items-center">
            <div className="md:w-1/2 w-[90%] flex flex-row gap-4 justify-center items-center">
              <input
                className="md:w-1/6 w-1/4 bg-transparent  rounded-xl py-4 text-center"
                placeholder="0"
                value={amount1}
                onChange={(e) => handleAmount1(e)}
                style={{
                  background: "#142631",
                }}
              />
              <input
                className="md:w-1/6 w-1/4  bg-transparent  rounded-xl py-4 text-center"
                placeholder="0"
                value={amount2}
                onChange={(e) => handleAmount2(e)}
                style={{
                  background: "#142631",
                }}
              />
              <input
                className="md:w-1/6 w-1/4  bg-transparent  rounded-xl py-4 text-center"
                placeholder="0"
                type="number"
                value={amount3}
                onChange={(e) => handleAmount3(e)}
                style={{
                  background: "#142631",
                }}
              />
              <input
                className="md:w-1/6 w-1/4  bg-transparent  rounded-xl py-4 text-center"
                placeholder="0"
                value={amount4}
                onChange={(e) => handleAmount4(e)}
                style={{
                  background: "#142631",
                }}
              />
            </div>
          </div>

          <div className="mx-6 flex flex-col gap-4 mt-4">
            <div className="flex flex-row justify-between">
              <div>Total Deposit</div>
              <div className="relative group my-auto">
                <Introduction />

                <div
                  className="whitespace-nowrap text-sm px-24 py-16 absolute ml-4 hidden group-hover:flex  text-white rounded-lg"
                  style={{
                    background: "#334155",
                    left: "99%", // Đặt vị trí ở bên phải
                    top: "100%", // Duy trì giữa theo chiều dọc
                    transform: "translateY(-50%)", // Dịch chuyển để đảm bảo giữa chiều dọc
                  }}
                >
                  <div
                    className="absolute w-0 h-0"
                    style={{
                      left: "-25px", // Điều chỉnh vị trí của mũi nhọn trỏ
                      top: "50%",
                      transform: "translateY(-50%)",
                      borderTop: "0px solid transparent",
                      borderBottom: "20px solid transparent",
                      borderRight: "25px solid #334155", // Màu của mũi nhọn trỏ
                      content: "''",
                      display: "inline-block",
                    }}
                  />
                  {/* This is a introduction */}
                </div>
              </div>
            </div>
            <input
              className="w-full bg-transparent  rounded-xl px-3 py-3 text-center"
              placeholder="0"
              value={total}
              style={{
                background: "#142631",
              }}
              disabled
            />
          </div>

          <div
            className={[
              "  cursor-pointer text-center items-center justify-center px-3 py-3 mx-6 mt-4",
              "deposit-button text-black hover:text-white",
            ].join(" ")}
            onClick={() => setDepositPopup(true)}
          >
            Deposit
          </div>
          {/* <div className="group justify-center text-center flex w-full">
            <div
              className={[
                " text-center items-center mx-6  px-3 py-3 justify-center w-full ",
                "deposit-disabled-button cursor-not-allowed text-[#637592]",
              ].join(" ")}
              onClick={() => {}}
            >
              Deposit
            </div>
            <div
              className="whitespace-nowrap text-sm absolute hidden group-hover:flex  p-2 mt-14 text-black rounded-lg "
              // className="text-center absolute justify-center"
              style={{
                background: "#01d096",
              }}
            >
              Coming Soon
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};
