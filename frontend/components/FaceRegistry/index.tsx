import React, { FC, useContext, useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import { is } from "@react-spring/shared";
import { toast } from "react-toastify";
interface FaceProps {}

export const FaceRegistry: FC<FaceProps> = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [detections, setDetections] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideoReady = useRef(false);

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

  const handleRegistry = async () => {
    if (isVideoReady.current && videoRef.current && isModelLoaded) {
      console.log("handleRegistry");
      const options = new faceapi.TinyFaceDetectorOptions();
      const detections = await faceapi
        .detectAllFaces(videoRef.current, options)
        .withFaceLandmarks()
        .withFaceDescriptors();

      console.log("detections", detections[0]);
      if (detections.length > 0) {
        toast.success("Face detected", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          progress: undefined,
          theme: "dark",
        });

        setDetections(detections);
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
            <div className="flex xl:flex-row lg:flex-col md:flex-col  flex-col w-full gap-8">
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
