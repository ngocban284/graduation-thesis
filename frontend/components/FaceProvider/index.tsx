import React, {
  createContext,
  useState,
  useEffect,
  FC,
  PropsWithChildren,
} from "react";
import * as faceapi from "face-api.js";

export const FaceApiContext = createContext({});

export type FaceProps = PropsWithChildren<{}>;

export const FaceApiProvider = ({ children }) => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
      setIsModelLoaded(true);
      console.log("Models loaded");
    };

    loadModels().catch(console.error);
  }, []);

  return (
    <FaceApiContext.Provider value={{ isModelLoaded, faceapi }}>
      {children}
    </FaceApiContext.Provider>
  );
};
