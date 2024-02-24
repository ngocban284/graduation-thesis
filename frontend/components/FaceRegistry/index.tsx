// @ts-nocheck
import React, { FC, useContext, useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { is } from "@react-spring/shared";
import { toast } from "react-toastify";
import ReedSolomonEC from "../../fuzzy_commitment_js/ErrorCorrection";
import {
  sha256HasherToBigInt,
  poseidonHash,
} from "../../fuzzy_commitment_js/Helpers";

import { FuzzyCommitmentAbi } from "../../abis/FuzzyCommitment";
import { FUZZY_COMMITMENT_ADDRESS } from "../../constants/index";

import { useContractByAddress } from "../../hooks/use-contract";
import { useEthers, BSCTestnet } from "@usedapp/core";
import { getDefaultProvider } from "ethers";

interface FaceProps {}

export const FaceRegistry: FC<FaceProps> = () => {
  const { switchNetwork, chainId, account, deactivate, activateBrowserWallet } =
    useEthers();

  useEffect(() => {
    if (!chainId) {
      switchNetwork(BSCTestnet.chainId).then(() => activateBrowserWallet());
    }
  }, [chainId]);

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [detections, setDetections] = useState<any>(null);
  const [persionalData, setPersionalData] = useState<any>({
    question: "",
    answer: "",
  });
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideoReady = useRef(false);

  const RS_EC = new ReedSolomonEC();

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: {} })
      .then((stream) => {
        let video = videoRef.current;
        if (video) {
          video.srcObject = stream;
        }
        console.log("video is ready");
        isVideoReady.current = true;
      })
      .catch((err) => console.error("Error accessing camera:", err));
  };
  const handlePersionalQuestion = (e) => {
    setPersionalData({ ...persionalData, question: e.target.value });
  };

  const handlePersionalAnswer = (e) => {
    setPersionalData({ ...persionalData, answer: e.target.value });
  };

  const handleRegistry = async () => {
    if (isVideoReady.current && videoRef.current && isModelLoaded) {
      console.log("handleRegistry");
      const options = new faceapi.TinyFaceDetectorOptions();
      const detections = await faceapi
        .detectAllFaces(videoRef.current, options)
        .withFaceLandmarks()
        .withFaceDescriptors();

      console.log("detections", detections[0]);
      // backup detection[0].descriptor json file

      if (
        detections.length > 0 &&
        persionalData.question != "" &&
        persionalData.answer != ""
      ) {
        toast.success("Face detected", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "dark",
        });

        setDetections(detections);

        // start fuzzy commitment process
        const { commitment, featureVectorHash } = await RS_EC.fuzzyCommitment(
          detections[0].descriptor
        );

        // console.log("commitment", commitment);
        // console.log("featureVectorHash", featureVectorHash);

        // concat persionalData.question and persionalData.answer to one string
        const persionalDataConcat =
          persionalData.question + persionalData.answer;

        // convert persionalDataConcat str to BigInt
        const persionalDataHash = await sha256HasherToBigInt(
          persionalDataConcat
        );
        // console.log("persionalDataHash", persionalDataHash);

        const persionalPoseidonHash = await poseidonHash([persionalDataHash]);

        const fuzzyCommitmentContract = useContractByAddress(
          FUZZY_COMMITMENT_ADDRESS,
          FuzzyCommitmentAbi
        );

        // console.log("persionalPoseidonHash", persionalPoseidonHash);
      } else {
        toast.error("No face detected", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
  };

  useEffect(() => {
    startVideo();
  }, []);

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
              <div className="text-left">Face Proof :</div>
              <div className="text-xl">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted={true} // Mute the video if needed
                  style={{
                    width: "100%",
                    height: "auto",
                    border: "1px solid #00BBB0",
                  }}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <div
                className={[
                  "  cursor-pointer text-center items-center justify-center w-full px-3 py-3",
                  "capture-button text-black hover:text-white ",
                ].join(" ")}
                onClick={() => handleRegistry()}
              >
                Capture
              </div>

              <div
                className={[
                  "  cursor-pointer text-center items-center justify-center w-full px-3 py-3",
                  "deposit-button text-black hover:text-white ",
                ].join(" ")}
                // onClick={() => handleRegistry()}
              >
                Registry
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
