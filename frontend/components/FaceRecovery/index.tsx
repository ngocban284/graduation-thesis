// @ts-nocheck
import React, {
  FC,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
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
import {
  useEthers,
  BSCTestnet,
  useCall,
  useContractFunction,
} from "@usedapp/core";
import { ethers } from "ethers";

interface FaceProps {}

export const FaceRecovery: FC<FaceProps> = () => {
  const { switchNetwork, chainId, account, deactivate, activateBrowserWallet } =
    useEthers();

  useEffect(() => {
    if (!chainId) {
      switchNetwork(BSCTestnet.chainId).then(() => activateBrowserWallet());
    }
  }, [chainId]);

  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [detections, setDetections] = useState<any>(null);
  const [sourceWallet, setSourceWallet] = useState<any>("");
  const [newOwner, setNewOwner] = useState<any>("");
  const [persionalData, setPersionalData] = useState<any>({
    question: "",
    answer: "",
  });

  const fuzzyCommitmentContract = useContractByAddress(
    FUZZY_COMMITMENT_ADDRESS,
    FuzzyCommitmentAbi
  );

  const getCommitmentOfWallet = useCall(
    sourceWallet && {
      contract: fuzzyCommitmentContract,
      method: "getCommitment",
      args: [sourceWallet],
    }
  );

  const primeCommitment = useMemo(() => {
    if (!getCommitmentOfWallet) return "----------";

    if (getCommitmentOfWallet.error) return "----------";

    let _resCommitment = getCommitmentOfWallet.value[0];
    //  convert to BigInt
    let _primeCommitment = [];

    for (let i = 0; i < _resCommitment.length; i++) {
      _primeCommitment.push(parseInt(_resCommitment[i]._hex, 16));
    }

    return _primeCommitment;
  }, [getCommitmentOfWallet]);

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

  const handleSourceWallet = (e) => {
    setSourceWallet(e.target.value);
  };

  const handleNewOwner = (e) => {
    setNewOwner(e.target.value);
  };

  const handleRecovery = async () => {
    if (isVideoReady.current && videoRef.current && isModelLoaded) {
      console.log("handleRecovery");
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
        persionalData.answer != "" &&
        sourceWallet != "" &&
        primeCommitment != "----------" &&
        newOwner != ""
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

        if (tx.status == 1) {
          toast.success("Face Recover Success", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          toast.error("Face Recover Failed", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            progress: undefined,
            theme: "dark",
          });
        }

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
                <div className="text-left">Source Wallet :</div>
                <input
                  className=" bg-transparent rounded-md px-4 py-3"
                  placeholder="question"
                  type=""
                  style={{
                    background: "#142631",
                  }}
                  onChange={(e) => handleSourceWallet(e)}
                />
              </div>
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
              <div className="flex flex-col w-full gap-3">
                <div className="text-left">New Owner :</div>
                <input
                  className=" bg-transparent rounded-md px-4 py-3"
                  placeholder="answer"
                  type=""
                  style={{
                    background: "#142631",
                  }}
                  onChange={(e) => handleNewOwner(e)}
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
                  "deposit-button text-black hover:text-white ",
                ].join(" ")}
                onClick={() => handleRecovery()}
              >
                Recovery
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
