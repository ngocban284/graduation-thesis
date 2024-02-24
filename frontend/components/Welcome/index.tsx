import { FC, PropsWithChildren, useEffect, useRef, useState } from "react";

import styles from "./index.module.css";

// import { useContractFunction, useEthers } from "@usedapp/core";

import { ItemFirst } from "./ItemFist";
import { ItemSecond } from "./ItemSecond";
import { ItemThird } from "./ItemThird";
import { ItemFourth } from "./ItemFourth";
import { ItemFifth } from "./ItemFifth";
import { ItemSeventh } from "./ItemSeventh";
import { Deposit } from "../Deposit";
import { Withdraw } from "../Withdraw";

import { FaceRegistry } from "../FaceRegistry";
import { FaceRecovery } from "../FaceRecovery";
import {
  shortenIfAddress,
  useEtherBalance,
  useEthers,
  BSCTestnet,
} from "@usedapp/core";
//  use react spring for animation
import { useSpring, animated } from "react-spring";

import { useMediaQuery } from "react-responsive";

export type WelcomeProps = PropsWithChildren<{}>;

export const Welcome: FC<WelcomeProps> = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const { switchNetwork, chainId, account, deactivate, activateBrowserWallet } =
    useEthers();

  useEffect(() => {
    if (!chainId) {
      switchNetwork(BSCTestnet.chainId).then(() => activateBrowserWallet());
    }
  }, [chainId]);

  const [visibility, setVisibility] = useState({
    deposit: false,
    withdraw: false,
    registry: true,
    recovery: false,
    info: false,
  });

  const handleCollapse = (button) => {
    if (button === "deposit") {
      setVisibility({
        deposit: true,
        withdraw: false,
        registry: false,
        recovery: false,
        info: false,
      });
    } else if (button === "withdraw") {
      setVisibility({
        deposit: false,
        withdraw: true,
        registry: false,
        recovery: false,
        info: false,
      });
    } else if (button === "registry") {
      setVisibility({
        deposit: false,
        withdraw: false,
        registry: true,
        recovery: false,
        info: false,
      });
    } else if (button === "recovery") {
      setVisibility({
        deposit: false,
        withdraw: false,
        registry: false,
        recovery: true,
        info: false,
      });
    } else if (button === "info") {
      setVisibility({
        deposit: false,
        withdraw: false,
        registry: false,
        recovery: false,
        info: true,
      });
    }
  };

  // const token = useContract("Token");
  // const claim = useContractFunction(token, "claim");

  return (
    <div
      id="home"
      style={{
        backgroundColor: "rgba(0,0,0,0)",
      }}
    >
      <div
        className={[
          "text-center pt-44 relative",
          "mx-auto",
          // "container",
          // styles.container,
        ].join(" ")}
      >
        <div className="absolute left-[25%] top-[30%] ">
          <ItemFirst />
        </div>
        <div className="absolute right-[10%]  ">
          <ItemSecond />
        </div>
        <div className="absolute left-[5%] top-[70%]  md:block hidden">
          <ItemThird />
        </div>
        <div className="absolute right-[10%] top-[80%]">
          <ItemFourth />
        </div>
        <div className="absolute left-[10%] top-[100%]">
          <ItemFifth />
        </div>
        <div className="absolute right-[30%] top-[110%]">
          <ItemSeventh />
        </div>
        <div
          className={[
            "relative mt-10 lg:mt-0 flex flex-col justify-center   items-center text-center  gap-12 w-1/3 mx-auto",
          ].join(" ")}
        >
          <div className="md:text-4xl text-3xl whitespace-nowrap font-medium home-context">
            Absolutely protect your assets with zk technology
          </div>
          <div
            className="text-xl md:text-5xl flex"
            style={{
              background: "#00131e",
              borderRadius: "6px",
            }}
          >
            <div
              className={[
                " md:text-base text-base cursor-pointer text-center items-center justify-center flex-1",
                visibility.deposit ? "active-button" : "disabled-btn",
              ].join(" ")}
              onClick={() => handleCollapse("deposit")}
            >
              Deposit
            </div>
            <div
              className={[
                " md:text-base text-base text-center cursor-pointer items-center justify-center flex-1",
                visibility.withdraw ? "active-button" : "disabled-btn",
              ].join(" ")}
              onClick={() => handleCollapse("withdraw")}
            >
              Withdraw
            </div>
            <div
              className={[
                " md:text-base text-base text-center cursor-pointer items-center justify-center flex-1",
                visibility.registry ? "active-button" : "disabled-btn",
              ].join(" ")}
              onClick={() => handleCollapse("registry")}
            >
              Registry
            </div>
            <div
              className={[
                " md:text-base text-base text-center cursor-pointer items-center justify-center flex-1",
                visibility.recovery ? "active-button" : "disabled-btn",
              ].join(" ")}
              onClick={() => handleCollapse("recovery")}
            >
              Recovery
            </div>
            <div
              className={[
                " md:text-base text-base text-center cursor-pointer items-center justify-center flex-1",
                visibility.info ? "active-button" : "disabled-btn",
              ].join(" ")}
              onClick={() => handleCollapse("info")}
            >
              MyChest
            </div>
          </div>
        </div>

        {visibility.deposit && <Deposit />}

        {visibility.withdraw && <Withdraw />}

        {visibility.registry && <FaceRegistry />}

        {visibility.recovery && <FaceRecovery />}
      </div>
    </div>
  );
};
