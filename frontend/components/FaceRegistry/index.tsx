import React, { FC, useContext, useState, useEffect } from "react";
import * as faceapi from "face-api.js";
import { VideoContext } from "../VideoProvider";
interface FaceProps {}

export const FaceRegistry: FC<FaceProps> = () => {
  // const { handleCaptureClick, detections } = useContext(VideoContext);

  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    console.log("FaceRegistry");
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("../../models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("../../models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("../../models");
      setIsModelLoaded(true);
      console.log("Models loaded");
    };

    loadModels().catch(console.error);
  }, []);

  return (
    <>
      <div className=" md:w-[50%] w-[95%]  mx-auto ">
        <div className="text-white flex flex-col gap-4  my-24  border-features py-8">
          <div className="w-[90%] flex flex-col justify-center items-center text-center gap-12 mx-auto">
            <div className="flex flex-row w-full gap-8">
              <div className="flex flex-col w-full gap-3">
                <div className="text-left">First proof question :</div>
                <input
                  className=" bg-transparent rounded-md px-4 py-3"
                  placeholder="first question"
                  type="password"
                  style={{
                    background: "#142631",
                  }}
                />
              </div>
              <div className="flex flex-col w-full gap-3">
                <div className="text-left">Second proof question :</div>
                <input
                  className=" bg-transparent rounded-md px-4 py-3"
                  placeholder="second question"
                  type="password"
                  style={{
                    background: "#142631",
                  }}
                />
              </div>
              <div className="flex flex-col w-full gap-3">
                <div className="text-left">Third proof question :</div>
                <input
                  className=" bg-transparent rounded-md px-4 py-3"
                  placeholder="third question"
                  type="password"
                  style={{
                    background: "#142631",
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col w-full gap-3">
              <div className="text-left">Face Proof :</div>
              <div className="text-xl">{/* <VideoProvider /> */}</div>
            </div>

            <div
              className={[
                "  cursor-pointer text-center items-center justify-center w-full px-3 py-3",
                "deposit-button text-black hover:text-white ",
              ].join(" ")}
              // onClick={() => setDepositPopup(true)}
            >
              Registry
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
