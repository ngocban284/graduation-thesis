interface WithdrawProps {
  handleWithdraw?: () => void;
}

export const WithdrawToken = (props: WithdrawProps) => {
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
        <div>---</div>
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
        <div>---</div>
      </div>

      {/* <div
        className={[
          " cursor-pointer text-center items-center  px-3 py-3 justify-center ",
          "deposit-button text-black hover:text-white",
        ].join(" ")}
        onClick={() => {}}
      >
        Withdraw
      </div> */}
      <div className=" group justify-center text-center flex w-full">
        <div
          className={[
            " text-center items-center  px-3 py-3 justify-center w-full ",
            "deposit-disabled-button cursor-not-allowed text-[#637592]",
          ].join(" ")}
          onClick={() => {}}
        >
          Withdraw
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
      </div>
    </div>
  );
};
