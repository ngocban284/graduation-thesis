import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { EthItem } from "../Util/eth";
import { BnbItem } from "../Util/bnb";
import { UsdtItem } from "../Util/usdt";
import { Coppy } from "../Util/coppy";
import { Download } from "../Util/download";

import { ETH_PRIVATE_ABI } from "../../abis/ETHPrivate";
import { ETH_PRIVATE_ADDRESS } from "../../constants/index";
import { getDepositParams } from "../../hooks/private-zkHook";

import { useContractByAddress } from "../../hooks/use-contract";
import {
  useEthers,
  BSCTestnet,
  useCall,
  useContractFunction,
} from "@usedapp/core";

interface DepositPopupProps {
  setDepositPopup?: (value: boolean) => void;
  selectedToken?: string;
  setGasPrice?: (value: number) => void;
  amount1?: number | string;
  amount2?: number | string;
  amount3?: number | string;
  amount4?: number | string;
  total?: number | string;
  gasPrice?: number;
  nullifier?: string;
}

const combineData = (amounts, nullifier) => {
  // Combine amounts and nullifier into a single string or JSON structure
  const combinedData = {
    amount1: amounts.amount1,
    amount2: amounts.amount2,
    amount3: amounts.amount3,
    amount4: amounts.amount4,
    nullifier: nullifier,
  };

  // Convert the combined data to a JSON string
  const jsonString = JSON.stringify(combinedData, null, 2);

  return jsonString;
};

export const DepositPopup = (props: DepositPopupProps) => {
  const [isBackedUp, setIsBackedUp] = useState(false);
  const [ticked, setTicked] = useState(false);

  const ETHPrivateContract = useContractByAddress(
    ETH_PRIVATE_ADDRESS,
    ETH_PRIVATE_ABI
  );

  const DepositFunction = useContractFunction(ETHPrivateContract, "deposit");

  const handleCopy = () => {
    const combinedData = combineData(props, props.nullifier);

    // Copy the combined data to the clipboard
    navigator.clipboard.writeText(combinedData);

    // Set state or provide feedback to indicate the copy action
    setIsBackedUp(true);
  };

  const handleDownload = () => {
    const combinedData = combineData(props, props.nullifier);

    const blob = new Blob([combinedData], { type: "application/json" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "deposit_data.json";

    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(downloadLink.href);
  };

  const handleDeposit = async () => {
    if (
      props.amount1 &&
      props.amount2 &&
      props.amount3 &&
      props.amount4 &&
      props.nullifier
    ) {
      const { error, params } = await getDepositParams(props.nullifier, [
        BigInt(ethers.utils.parseUnits(String(props.amount1), "ether")._hex),
        BigInt(ethers.utils.parseUnits(String(props.amount2), "ether")._hex),
        BigInt(ethers.utils.parseUnits(String(props.amount3), "ether")._hex),
        BigInt(ethers.utils.parseUnits(String(props.amount4), "ether")._hex),
      ]);

      if (error) {
        console.log("Error: ", error);
      } else {
        const depositTX = await DepositFunction.send(params, {
          value: ethers.utils.parseUnits(String(props.total), "ether"),
        });

        if (depositTX) {
          props.setDepositPopup(false);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="fixed inset-0 "
        style={{
          background: "#fff",
          opacity: 0.2,
        }}
        onClick={() => props.setDepositPopup(false)}
      ></div>
      <div className="md:w-[45%] w-[95%] h-[650px] text-white rounded-xl select-token-popup transform  translate-y-[6%]">
        <div className="mx-[10%]">
          <div className="flex flex-row justify-between my-6">
            <div className="text-2xl mt-8">Your private note</div>
            <div
              className="my-auto cursor-pointer text-2xl  w-6 h-6 rounded-full flex items-center justify-center"
              onClick={() => props.setDepositPopup(false)}
            >
              &times;
            </div>
          </div>
          <div className="text-left text-sm mt-8">
            Please backup your note. You will need it later to withdraw your
            deposit back.
          </div>
          <div
            className="text-left flex flex-col gap-4 p-4 rounded-xl text-sm break-words mt-8"
            style={{
              background: "rgb(24,38,48)",
            }}
          >
            <div className="text-[#01E37C]">{props.nullifier}</div>
            <div className="flex flex-row justify-between">
              <div className="flex gap-4">
                <div className=" my-auto">Private array</div>
                <div className="flex gap-2 text-[#01E37C]">
                  <div
                    className="px-4 py-2 rounded"
                    style={{
                      background: "#00131E",
                    }}
                  >
                    {props.amount1}
                  </div>
                  <div
                    className="px-4 py-2 rounded"
                    style={{
                      background: "#00131E",
                    }}
                  >
                    {props.amount2}
                  </div>
                  <div
                    className="px-4 py-2 rounded"
                    style={{
                      background: "#00131E",
                    }}
                  >
                    {props.amount3}
                  </div>
                  <div
                    className="px-4 py-2 rounded"
                    style={{
                      background: "#00131E",
                    }}
                  >
                    {" "}
                    {props.amount4}
                  </div>
                </div>
              </div>
              <div className=" flex flex-row gap-4 my-auto">
                <div onClick={handleCopy}>
                  <Coppy />
                </div>
                <div onClick={handleDownload}>
                  <Download />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col text-sm mt-4">
            <div className="w-full flex flex-row justify-between">
              <div>Gas Price</div>
              <div>Gwei: 34</div>
            </div>

            <input
              id="small-range"
              type="range"
              min="1"
              max="3"
              value={props.gasPrice}
              onChange={(e) => props.setGasPrice(Number(e.target.value))}
              onMouseMove={(
                e: React.MouseEvent<HTMLInputElement, MouseEvent>
              ) => props.setGasPrice(Number(e.currentTarget.value))}
              className="w-full h-0.5 my-3 rounded-lg  cursor-pointer range-sm "
            />

            <div className="w-full flex flex-row justify-between">
              <div>Slow</div>
              <div>Standard</div>
              <div>Fast</div>
            </div>
          </div>

          <div className="flex flex-col text-left border p-3 rounded-xl text-sm mt-4">
            You can also save encrypted notes ori-chain by setting up the Note
            Account, create one on the account page.
          </div>

          <div className="flex flex-col text-left  rounded-xl text-sm mt-4">
            <div>
              {/* checkbox */}
              <div className="flex flex-row gap-4 items-center">
                <input
                  type="checkbox"
                  className="form-checkbox rounded-xl"
                  id="checkbox"
                  onChange={() => setTicked(!ticked)}
                  style={{
                    accentColor: "#01E37C",
                  }}
                />
                <label htmlFor="checkbox">I backed up the note</label>
              </div>
            </div>
          </div>

          {ticked ? (
            <div
              className={[
                " cursor-pointer text-center items-center w-full px-3 py-3 justify-center mt-8",
                "deposit-button text-black hover:text-white",
              ].join(" ")}
              onClick={handleDeposit}
            >
              Send Deposit
            </div>
          ) : (
            <button
              className={[
                " cursor-pointer text-center  items-center w-full px-3 py-3 justify-center mt-8 disabled: rounded-xl",
              ].join(" ")}
              style={{
                background: "gray",
              }}
              disabled
            >
              Send Deposit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
