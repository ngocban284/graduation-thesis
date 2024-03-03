import { EthItem } from "../Util/eth";
import { BnbItem } from "../Util/bnb";
import { UsdtItem } from "../Util/usdt";

import { Coppy } from "../Util/coppy";
import { Download } from "../Util/download";

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
}

export const DepositPopup = (props: DepositPopupProps) => {
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
            <div className="text-2xl">Your private note</div>
            <div
              className="my-auto cursor-pointer text-2xl  w-6 h-6 rounded-full flex items-center justify-center"
              onClick={() => props.setDepositPopup(false)}
            >
              &times;
            </div>
          </div>
          <div className="text-left text-sm">
            Please backup your note. You will need it later to withdraw your
            deposit back.Treat your note as a private key never share it with
            anyone, including mixerswap developers.
          </div>
          <div
            className="text-left flex flex-col gap-4 p-4 rounded-xl text-sm break-words mt-8"
            style={{
              background: "rgb(24,38,48)",
            }}
          >
            <div className="text-[#01E37C]">
              mixerswap-0.1-5-0x47ab6a268417747197366027886Ød9d88d62aa743ddc0f2972dd51ca9fe22eda7a962e6e0238597343146fe525cfb664eccb80e13f8b619119810499f15
            </div>
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
                <div>
                  <Coppy />
                </div>
                <div>
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
                  style={{
                    accentColor: "#01E37C",
                  }}
                />
                <label htmlFor="checkbox">I backed up the note</label>
              </div>
            </div>
          </div>

          <div
            className={[
              " cursor-pointer text-center items-center w-full px-3 py-3 justify-center mt-8",
              "deposit-button text-black hover:text-white",
            ].join(" ")}
            onClick={() => {}}
          >
            Send Deposit
          </div>
        </div>
      </div>
    </div>
  );
};
