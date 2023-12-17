import React, {
  createContext,
  useRef,
  useState,
  useCallback,
  useContext,
  useEffect,
} from "react";
import { FaceApiProvider } from "../FaceProvider";

interface VideoContextValue {
  isModelLoaded: boolean;
  faceapi: any; // Replace 'any' with the actual type of 'faceapi'
}

export const VideoContext = createContext<VideoContextValue>(
  {} as VideoContextValue
);

export const VideoProvider = () => {
  const { isModelLoaded, faceapi } = useContext(VideoContext);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        let video = videoRef.current;
        if (video) {
          video.srcObject = stream;
        }
      })
      .catch((err) => console.error("Error accessing camera:", err));
  };

  useEffect(() => {
    startVideo();
  }, []);

  return (
    <>
      {/* Add video element */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={true} // Mute the video if needed
        style={{ width: "100%", height: "auto", border: "1px solid #00BBB0" }}
        className="rounded-xl"
      />
    </>
  );
};
