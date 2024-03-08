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
  generateRandom128Bit,
} from "../../fuzzy_commitment_js/Helpers";

import { ETH_PRIVATE_ABI } from "../../abis/ETHPrivate";
import { ETH_PRIVATE_ADDRESS } from "../../constants/index";

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

  const ETHPrivateContract = useContractByAddress(
    ETH_PRIVATE_ADDRESS,
    ETH_PRIVATE_ABI
  );

  const getCommitmentOfWallet = useCall(
    sourceWallet && {
      contract: ETHPrivateContract,
      method: "faceCommitments",
      args: [sourceWallet],
    }
  );

  const primeCommitment = useMemo(() => {
    if (!getCommitmentOfWallet) return "----------";

    if (getCommitmentOfWallet.error) return "----------";

    let _resCommitment = getCommitmentOfWallet.value[0];
    // change string "123,1,4,5," to array 128
    let _commitment = _resCommitment.split(",").map((item) => parseInt(item));

    return _commitment;
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
    try {
      if (isVideoReady.current && videoRef.current && isModelLoaded) {
        console.log("handleRecovery");
        const options = new faceapi.TinyFaceDetectorOptions();
        const detections = await faceapi
          .detectAllFaces(videoRef.current, options)
          .withFaceLandmarks()
          .withFaceDescriptors();

        console.log("detections", detections[0]);
        // backup detection[0].descriptor json file

        console.log("primeCommitment", primeCommitment);

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
          // const { commitment, featureVectorHash } = await RS_EC.fuzzyCommitment(
          //   detections[0].descriptor
          // );

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

          const nullifier = await generateRandom128Bit();

          const nullifierHash = await poseidonHash([nullifier]);

          console.log("primeCommitment", primeCommitment);
          console.log("detect", detections[0].descriptor);
          // recover use reed solomon
          const { err_vector, feat_vec_prime, feature_vec_hash } =
            await RS_EC.recover(detections[0].descriptor, primeCommitment);

          const circuitInputMerge = {
            feat_vec_prime: feat_vec_prime,
            err_code: err_vector,
            hash_feat_vec: feature_vec_hash,
            nullifier: nullifier,
            nullifierHash: nullifierHash,
            personalInfoHash: persionalDataHash,
            hashOfPersonalInfoHash: persionalPoseidonHash,
          };

          // console.log("circuitInputMerge", circuitInputMerge);

          const worker = new Worker("./worker.js");

          worker.postMessage(["fullProveRecovery", circuitInputMerge]);

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

          // if (tx.status == 1) {
          //   toast.success("Face Recover Success", {
          //     position: "top-right",
          //     autoClose: 5000,
          //     hideProgressBar: false,
          //     closeOnClick: true,
          //     progress: undefined,
          //     theme: "dark",
          //   });
          // } else {
          //   toast.error("Face Recover Failed", {
          //     position: "top-right",
          //     autoClose: 5000,
          //     hideProgressBar: false,
          //     closeOnClick: true,
          //     progress: undefined,
          //     theme: "dark",
          //   });
          // }

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
    } catch (error) {
      console.log("error", error);
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
