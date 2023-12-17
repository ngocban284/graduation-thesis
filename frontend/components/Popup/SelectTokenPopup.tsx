import { EthItem } from "../Util/eth";
import { BnbItem } from "../Util/bnb";
import { UsdtItem } from "../Util/usdt";
import { ZkSyncItem } from "../Util/zksync";

interface SelectTokenPopupProps {
  network?: any;
  setSelectTokenPopup?: (value: boolean) => void;
  handleNetwork?: (value: string) => void;
  handleSelectedToken?: (value: string) => void;
}

export const SelectTokenPopup = (props: SelectTokenPopupProps) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 1,
      }}
    >
      <div
        className="fixed inset-0 "
        style={{
          background: "#fff",
          opacity: 0.2,
        }}
        onClick={() => props.setSelectTokenPopup(false)}
      ></div>
      <div className="md:w-[45%] w-[95%] h-[548px] text-white rounded-lg select-token-popup transform  translate-y-[15%]">
        <div className="mx-[10%]">
          <div className="flex flex-row justify-between my-12">
            <div className="text-xl">Select Token</div>
            <div
              className="my-auto cursor-pointer w-6 h-6 rounded-full text-2xl flex items-center justify-center"
              onClick={() => props.setSelectTokenPopup(false)}
            >
              &times;
            </div>
          </div>

          <input
            className="w-full select-input bg-transparent  rounded-lg px-4 py-4"
            placeholder="Search token name"
          />

          <div className="flex flex-row mt-8 gap-12">
            <div
              className="flex flex-col gap-8 rounded-lg px-4 py-4 h-full"
              style={{
                background: " #14273180",
              }}
            >
              <div
                className=" rounded-lg px-2 py-2 cursor-pointer "
                style={{
                  border: props.network.ethereum ? "1px solid #00BBB0" : "",
                }}
                onClick={() => props.handleNetwork("ethereum")}
              >
                <EthItem />
              </div>
              <div
                className=" rounded-lg px-2 py-2 cursor-pointer "
                style={{
                  border: props.network.zksync ? "1px solid #00BBB0" : "",
                }}
                onClick={() => props.handleNetwork("zksync")}
              >
                <ZkSyncItem />
              </div>
              <div
                className=" rounded-lg px-2 py-2 cursor-pointer "
                style={{
                  border: props.network.bnb ? "1px solid #00BBB0" : "",
                }}
                onClick={() => props.handleNetwork("bnb")}
              >
                <BnbItem />
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              {props.network.ethereum ? (
                <>
                  {" "}
                  <>
                    <div> Ethereum Network</div>
                    <div
                      className="flex flex-row px-2 py-2 gap-4 rounded-lg w-full cursor-pointer"
                      style={{
                        background: " #14273180",
                      }}
                      onClick={() => props.handleSelectedToken("eth")}
                    >
                      <div className="my-auto">
                        <EthItem />
                      </div>
                      <div className="flex flex-col ">
                        <div className="text-left text-base">ETH</div>
                        <div className="text-left text-sm">Ethereum</div>
                      </div>
                    </div>
                    <div
                      className="flex flex-row px-2 py-2 gap-4 rounded-lg w-full cursor-pointer"
                      style={{
                        background: " #14273180",
                      }}
                      onClick={() => props.handleSelectedToken("usdt")}
                    >
                      <div className="my-auto">
                        <UsdtItem />
                      </div>
                      <div className="flex flex-col ">
                        <div className="text-left text-base">USDT</div>
                        <div className="text-left text-sm">Tether USD</div>
                      </div>
                    </div>
                  </>
                </>
              ) : props.network.bnb ? (
                <>
                  <>
                    <div> Binance Smart Chain</div>
                    <div
                      className="flex flex-row px-2 py-2 gap-4 rounded-lg w-full"
                      style={{
                        background: " #14273180",
                      }}
                      onClick={() => props.handleSelectedToken("bnb")}
                    >
                      <div className="my-auto">
                        <BnbItem />
                      </div>
                      <div className="flex flex-col ">
                        <div className="text-left text-base">BNB</div>
                        <div className="text-left text-sm">BNB Token</div>
                      </div>
                    </div>
                    <div
                      className="flex flex-row px-2 py-2 gap-4 rounded-lg w-full"
                      style={{
                        background: " #14273180",
                      }}
                      onClick={() => props.handleSelectedToken("usdt")}
                    >
                      <div className="my-auto">
                        <UsdtItem />
                      </div>
                      <div className="flex flex-col ">
                        <div className="text-left text-base">USDT</div>
                        <div className="text-left text-sm">Tether USD</div>
                      </div>
                    </div>
                  </>
                </>
              ) : (
                <>
                  {" "}
                  <>
                    <div>Zksync Network</div>
                    <div
                      className="flex flex-row px-2 py-2 gap-4 rounded-lg w-full cursor-pointer"
                      style={{
                        background: " #14273180",
                      }}
                      onClick={() => props.handleSelectedToken("eth")}
                    >
                      <div className="my-auto">
                        <EthItem />
                      </div>
                      <div className="flex flex-col ">
                        <div className="text-left text-base">ETH</div>
                        <div className="text-left text-sm">Ethereum</div>
                      </div>
                    </div>
                    <div
                      className="flex flex-row px-2 py-2 gap-4 rounded-lg w-full cursor-pointer"
                      style={{
                        background: " #14273180",
                      }}
                      onClick={() => props.handleSelectedToken("usdt")}
                    >
                      <div className="my-auto">
                        <UsdtItem />
                      </div>
                      <div className="flex flex-col ">
                        <div className="text-left text-base">USDT</div>
                        <div className="text-left text-sm">Tether USD</div>
                      </div>
                    </div>
                  </>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
