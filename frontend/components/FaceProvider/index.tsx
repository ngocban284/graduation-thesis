import React, {
  createContext,
  useState,
  useEffect,
  FC,
  PropsWithChildren,
} from "react";
import * as faceapi from "face-api.js";

// Define the type for the FaceApiContext value
export type FaceApiContextValue = {
  isModelLoaded: boolean;
  faceapi: typeof faceapi;
};

// Create the context with an initial empty object
export let FaceApiContext = createContext<FaceApiContextValue>({
  isModelLoaded: false,
  faceapi: faceapi,
});

// Define the props type for FaceApiProvider
export type FaceProps = PropsWithChildren<{}>;

// Define the component with the provided types
export const FaceApiProvider: FC<FaceProps> = ({ children }) => {
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

  // Use the defined type for the context value
  const contextValue: FaceApiContextValue = { isModelLoaded, faceapi };

  return (
    <FaceApiContext.Provider value={contextValue}>
      {children}
    </FaceApiContext.Provider>
  );
};
