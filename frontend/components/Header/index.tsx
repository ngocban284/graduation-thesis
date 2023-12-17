import React, {
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
  useMemo,
} from "react";
import styles from "./index.module.css";
import { Logo } from "./Logo";
import { EthLogo } from "./ETH";
import {
  Goerli,
  Mainnet,
  shortenIfAddress,
  useEtherBalance,
  useEthers,
} from "@usedapp/core";

import { ethers } from "ethers";

import { useMediaQuery } from "react-responsive";
import { BnbItem } from "../Util/bnb";
import { EthItem } from "../Util/eth";
import { ZkSyncItem } from "../Util/zksync";

export type HeaderProps = PropsWithChildren<{}>;

export const Header: FC<HeaderProps> = (props: HeaderProps) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const [navbarOpen, setNavbarOpen] = React.useState(false);
  const headerRef = useRef<HTMLDivElement>();

  const { switchNetwork, chainId, account, deactivate, activateBrowserWallet } =
    useEthers();

  useEffect(() => {
    if (!chainId) {
      switchNetwork(Goerli.chainId).then(() => activateBrowserWallet());
    }
  }, [chainId]);

  const balanceHex = useEtherBalance(account);

  const balance = useMemo(() => {
    if (balanceHex) {
      // convert string 0.004844403164078278 to number and round to 2 decimals

      const balance = parseFloat(ethers.utils.formatEther(balanceHex)).toFixed(
        5
      );

      return balance;
    }
  }, [balanceHex]);

  const [shownetwork, setShownetwork] = React.useState(false);

  const handleShowNetwork = () => {
    setShownetwork(!shownetwork);
  };

  return (
    <div
      className={[
        "fixed top-0 w-full z-30 transition duration-300 ease-in-out ",
        styles.container,
      ].join(" ")}
      ref={headerRef}
      style={{
        background: "#00131E",
      }}
    >
      <div className="py-3 container px-4 font-heading flex mx-auto items-center justify-between">
        <div className="flex flex-row items-center justify-between space-x-0 w-full lg:w-auto">
          <a
            href="/"
            className="text-lg font-bold rounded-lg tracking-widest focus:outline-none focus:shadow-outline"
          >
            <h1 className="text-4xl Avenir tracking-tighter text-white md:text-4x1 lg:text-3xl">
              <Logo />
            </h1>
          </a>
        </div>
        <div
          className={
            "absolute top-0 mt-[4.5rem] h-[calc(100vh-10rem)] lg:h-auto bg-white w-full left-0 lg:relative lg:mt-auto lg:w-auto lg:bg-transparent lg:flex lg:flex-row flex-col items-center" +
            (navbarOpen ? " flex" : " hidden")
          }
        ></div>

        <nav className="flex-col flex md:flex-row gap-4">
          <div
            className={[" chain-border md:px-4 md:py-2 py-2 rounded-lg"].join(
              ""
            )}
          >
            {account == null ? (
              <>
                <div className="text-center">chain</div>
              </>
            ) : chainId == 1 ? (
              <>
                <div className="relative group my-auto">
                  <div
                    className="flex  justify-center cursor-pointer"
                    onClick={() => handleShowNetwork()}
                  >
                    <div>
                      <EthLogo />
                    </div>
                    <div>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 10L12 14L16 10"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  {shownetwork && (
                    <div
                      className="whitespace-nowrap text-sm p-6 absolute ml-4    text-white rounded-lg"
                      style={{
                        background: "#334155",
                        left: "0%", // Đặt vị trí ở bên phải
                        top: "200%", // Duy trì giữa theo chiều dọc
                      }}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-row gap-2">
                          <EthItem />
                          <div className="my-auto">Ethereum</div>
                        </div>
                        <div className="flex flex-row gap-2">
                          <ZkSyncItem />
                          <div className="my-auto">Zksync (comming soon)</div>
                        </div>
                        <div className="flex flex-row gap-2">
                          <BnbItem />
                          <div className="my-auto">BSC (comming soon)</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="relative group my-auto">
                  <div
                    className="flex  justify-center cursor-pointer"
                    onClick={() => handleShowNetwork()}
                  >
                    <div>
                      <EthLogo />
                    </div>
                    <div>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8 10L12 14L16 10"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                  {shownetwork && (
                    <div
                      className="whitespace-nowrap text-sm p-6 absolute ml-4    text-white rounded-lg"
                      style={{
                        background: "#334155",
                        left: "0%", // Đặt vị trí ở bên phải
                        top: "200%", // Duy trì giữa theo chiều dọc
                      }}
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-row gap-2">
                          <EthItem />
                          <div className="my-auto">Ethereum</div>
                        </div>
                        <div className="flex flex-row gap-2">
                          <ZkSyncItem />
                          <div className="my-auto">Zksync (comming soon)</div>
                        </div>
                        <div className="flex flex-row gap-2">
                          <BnbItem />
                          <div className="my-auto">BSC (comming soon)</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <ul className="flex flex-row flex-grow justify-end flex-wrap md:items-center text-base gap-1">
            <li className="whitespace-nowrap">
              {account && (
                <div
                  className=" launch-button cursor-pointer hidden-md px-4 py-2 text-black hover:text-white hover:border-white"
                  onClick={deactivate}
                >
                  {/* truncate address  */}
                  <div className="text-black md:block hidden">{balance} | </div>
                  <a>{shortenIfAddress(account)}</a>
                </div>
              )}
              {!account && (
                <div
                  className=" launch-button cursor-pointer hidden-md px-4 py-2 text-black hover:text-white hover:border-white "
                  onClick={activateBrowserWallet}
                >
                  <a className="text-lg">Connect Wallet</a>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
