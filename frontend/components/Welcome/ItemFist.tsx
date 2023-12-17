import { shortenIfAddress } from "@usedapp/core";
import { FC } from "react";

export type ItemFirstProps = {
  context?: string;
  onClick?: () => void;
};

// 76  146 218
export const ItemFirst: FC<ItemFirstProps> = (props) => {
  return (
    <svg
      width="172"
      height="68"
      viewBox="0 0 172 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.2"
        d="M86.3106 0L0.5 34.1235L85.6894 68L171.5 33.8765L86.3106 0Z"
        fill="url(#paint0_linear_225_5529)"
        fill-opacity="0.4"
      />
      <defs>
        <linearGradient
          id="paint0_linear_225_5529"
          x1="86"
          y1="0"
          x2="86"
          y2="68"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#04C4F1" />
          <stop offset="1" stop-color="#04C4F1" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
