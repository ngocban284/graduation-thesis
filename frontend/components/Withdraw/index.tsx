import { ethers } from "ethers";
import { useMemo, useEffect, useState } from "react";

import {
  useEthers,
  useEtherBalance,
  BSCTestnet,
  useCall,
  useContractFunction,
} from "@usedapp/core";

import {
  V_TOTAL,
  BSC_TESTNET_RPC,
  DKG_CONTRACT_ADDRESS,
} from "../../constants/index";

import { ETH_PRIVATE_ABI } from "../../abis/ETHPrivate";
import { ETH_PRIVATE_ADDRESS } from "../../constants/index";
import {
  getDepositParams,
  useGenerateWithdrawParams,
  useProveWithdrawProof,
  useGenerateWithdrawParamsHuhu,
  toAddress,
} from "../../hooks/private-zkHook";

import { useContractByAddress } from "../../hooks/use-contract";

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
      switchNetwork(BSCTestnet.chainId).then(() => activateBrowserWallet());
    }
  }, [chainId]);
  const balanceHex = useEtherBalance(account);

  const ETHPrivateContract = useContractByAddress(
    ETH_PRIVATE_ADDRESS,
    ETH_PRIVATE_ABI
  );

  const WithdrawFunction = useContractFunction(ETHPrivateContract, "withdraw");

  const [amount, setAmount] = useState("");
  const [amount1, setAmount1] = useState("");
  const [amount2, setAmount2] = useState("");
  const [amount3, setAmount3] = useState("");
  const [amount4, setAmount4] = useState("");

  const [vPrivate, setVPrivate] = useState([]);
  const [indexInPrivateV, setIndexInPrivateV] = useState(0);
  const [nullifier, setNullifier] = useState(BigInt(0));
  const [receipt, setReceipt] = useState("");
  const [total, setTotal] = useState("");

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

  const handleNullifier = (e) => {
    setNullifier(e.target.value);

    console.log("nullifier", nullifier);
  };

  const handleReceipt = (e) => {
    setReceipt(e.target.value);
    console.log("receipt", receipt);
  };

  const handleIndexInPrivateV = (e) => {
    setIndexInPrivateV(e.target.value);
    console.log("indexInPrivateV", indexInPrivateV);
  };

  const handleWithdraw = async () => {
    if (indexInPrivateV && nullifier && receipt) {
      const { error, circuitInput } = await useGenerateWithdrawParams(
        BigInt(nullifier),
        receipt,
        receipt,
        [
          BigInt(parseFloat(amount1) * 10 ** 18),
          BigInt(parseFloat(amount2) * 10 ** 18),
          BigInt(parseFloat(amount3) * 10 ** 18),
          BigInt(parseFloat(amount4) * 10 ** 18),
        ],
        BigInt(indexInPrivateV),
        BigInt(0)
      );

      if (error) {
        console.log("error", error);
      } else {
        const worker = new Worker("./worker.js");

        worker.postMessage(["fullProveWithdraw", circuitInput]);

        worker.onmessage = async function (e) {
          if (e.data == "Error: Couldn't prove the circuit") {
            console.log("Error: Couldn't prove the circuit");
            return;
          }
          const { proof, publicSignals } = e.data;

          // encode
          const encoder = await ethers.utils.defaultAbiCoder;

          const encodedProof = encoder.encode(
            ["uint256[8]"],
            [
              [
                BigInt(proof.pi_a[0]),
                BigInt(proof.pi_a[1]),
                BigInt(proof.pi_b[0][1]),
                BigInt(proof.pi_b[0][0]),
                BigInt(proof.pi_b[1][1]),
                BigInt(proof.pi_b[1][0]),
                BigInt(proof.pi_c[0]),
                BigInt(proof.pi_c[1]),
              ],
            ]
          );

          const callWithdrawParams = [
            encodedProof,
            publicSignals[0],
            publicSignals[1],
            publicSignals[2],
            publicSignals[3],
            await toAddress(publicSignals[6]),
            await toAddress(publicSignals[7]),
            publicSignals[8],
          ];

          const withdrawTx = await WithdrawFunction.send(callWithdrawParams);

          if (withdrawTx.status == 1) {
            console.log("Withdraw success");
          } else {
            console.log("Withdraw failed");
          }
        };
      }
    }
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
          parseFloat(amount1),
          parseFloat(amount2),
          parseFloat(amount3),
          parseFloat(amount4),
        ]);

        console.log("vPrivate", vPrivate);
      } else {
        setTotal("0");
      }
    } else {
      setTotal("0");
    }
  }, [total]);

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

          <input
            className="mx-6 bg-transparent rounded-md px-4 py-3"
            placeholder="Index in private array"
            // type="password"
            style={{
              background: "#142631",
            }}
            onChange={(e: any) => handleIndexInPrivateV(e)}
          />

          <input
            className="mx-6 bg-transparent rounded-md px-4 py-3"
            placeholder="Nullifier"
            // type="password"
            style={{
              background: "#142631",
            }}
            onChange={(e: any) => handleNullifier(e)}
          />

          <input
            className="mx-6 bg-transparent rounded-md px-4 py-3"
            placeholder="Recipient address"
            // type="password"
            style={{
              background: "#142631",
            }}
            onChange={(e: any) => handleReceipt(e)}
          />

          <div className="mx-6  flex flex-row mt-6">
            <div
              className={[
                "text-center w-full p-2  cursor-pointer rounded-md",
                action.withdraw
                  ? "withdraw-btn-active-background"
                  : "withdraw-btn-disable-background",
              ].join(" ")}
              style={{
                border: action.withdraw ? "1px solid #00BBB0" : "",
                borderRight: action.withdraw ? "1px solid #00BBB0" : "none",
                borderLeft: action.withdraw ? "1px solid #00BBB0" : "none",
                borderTop: action.withdraw ? "1px solid #00BBB0" : "none",
                borderBottom: action.withdraw ? "1px solid #00BBB0" : "none",
                background: action.withdraw
                  ? "withdraw-btn-active-background"
                  : "",
                color: action.withdraw ? "white" : "#637592",
              }}
              onClick={() => handleActionOption("withdraw")}
            >
              Withdraw
            </div>
          </div>

          {action.withdraw ? (
            <>
              <div className="flex flex-col mx-6 gap-4 mt-6">
                <div className="flex flex-row justify-between">
                  <div
                    className="text-sm"
                    style={{
                      color: "#637592",
                    }}
                  >
                    Amount withdraw
                  </div>
                  {indexInPrivateV ? (
                    <div>
                      {vPrivate[indexInPrivateV] != undefined
                        ? String(vPrivate[indexInPrivateV])
                        : "0.00"}
                    </div>
                  ) : (
                    <div>---</div>
                  )}
                </div>
                <div className="flex flex-row justify-between">
                  <div
                    className="text-sm"
                    style={{
                      color: "#637592",
                    }}
                  >
                    Recipient address
                  </div>
                  {receipt ? <div>{receipt}</div> : <div>---</div>}
                </div>

                <div
                  className={[
                    " cursor-pointer text-center items-center  px-3 py-3 justify-center ",
                    "deposit-button text-black hover:text-white",
                  ].join(" ")}
                  onClick={handleWithdraw}
                >
                  Withdraw
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};
