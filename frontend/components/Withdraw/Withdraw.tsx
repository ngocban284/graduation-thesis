import { ethers } from "ethers";
import { useMemo, useEffect, useState } from "react";

interface WithdrawProps {
  handleWithdraw?: () => void;
  amountWithdraw?: string;
  recipientAddress?: string;
}

export const WithdrawToken = (props: WithdrawProps) => {
  const [amountWithdraw, setAmountWithdraw] = useState<string>("");
  const [recipientAddress, setRecipientAddress] = useState<string>("");

  useEffect(() => {
    console.log("amountWithdraw", props.amountWithdraw);
    //  parse string to big number and divide by 10^18
    if (props.amountWithdraw) {
      setAmountWithdraw(
        ethers.utils.formatUnits(
          props.amountWithdraw ? props.amountWithdraw : "",
          18
        )
      );
    }

    if (props.recipientAddress) {
      setRecipientAddress(props.recipientAddress);
    }
  }, [
    props.amountWithdraw,
    props.recipientAddress,
    amountWithdraw,
    recipientAddress,
  ]);

  return (
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
        {props.amountWithdraw ? (
          <div>
            {String(
              ethers.utils.formatUnits(
                props.amountWithdraw ? props.amountWithdraw : "",
                18
              )
            )}
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
        {props.recipientAddress ? (
          <div>{props.recipientAddress}</div>
        ) : (
          <div>---</div>
        )}
      </div>

      <div
        className={[
          " cursor-pointer text-center items-center  px-3 py-3 justify-center ",
          "deposit-button text-black hover:text-white",
        ].join(" ")}
        onClick={() => {}}
      >
        Withdraw
      </div>
    </div>
  );
};
