// @ts-nocheck
import React, {
  FC,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { VideoProvider } from "../VideoProvider";

interface FaceProps {}

export const FaceRecovery: FC<FaceProps> = () => {
  const [persionalData, setPersionalData] = useState<any>({
    question: "",
    answer: "",
  });
  return (
    <>
      <div className=" md:w-[50%] w-[95%]  mx-auto ">
        <div className="text-white flex flex-col gap-4  my-24  border-features py-8">
          <div className="w-[90%] flex flex-col justify-center items-center text-center gap-12 mx-auto">
            <div className="flex xl:flex-col lg:flex-col md:flex-col  flex-col w-full gap-8">
              <div className="flex flex-col w-full gap-3">
                <div className="text-left">Proof question :</div>
                <input
                  className=" bg-transparent rounded-md px-4 py-3"
                  placeholder="question"
                  type=""
                  style={{
                    background: "#142631",
                  }}
                  onChange={(e) => handlePersionalQuestion(e)}
                />
              </div>
              <div className="flex flex-col w-full gap-3">
                <div className="text-left">Proof answer :</div>
                <input
                  className=" bg-transparent rounded-md px-4 py-3"
                  placeholder="answer"
                  type="password"
                  style={{
                    background: "#142631",
                  }}
                  onChange={(e) => handlePersionalAnswer(e)}
                />
              </div>
            </div>
            <div className="flex flex-col w-full gap-3">
              <div className="text-left">New Owner:</div>
              <input
                className=" bg-transparent rounded-md px-4 py-3"
                placeholder="new owner address"
                style={{
                  background: "#142631",
                }}
              />
            </div>
            <div className="flex flex-col w-full gap-3">
              <div className="text-left">Face Proof :</div>
              <div className="text-xl">
                <VideoProvider />
              </div>
            </div>

            <div
              className={[
                "  cursor-pointer text-center items-center justify-center w-full px-3 py-3",
                "deposit-button text-black hover:text-white ",
              ].join(" ")}
              // onClick={() => setDepositPopup(true)}
            >
              Recovery
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
