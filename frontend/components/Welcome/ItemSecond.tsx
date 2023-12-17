import { shortenIfAddress } from "@usedapp/core";
import { FC } from "react";

export type ItemFirstProps = {
  context?: string;
  onClick?: () => void;
};

// 76  146 218
export const ItemSecond: FC<ItemFirstProps> = (props) => {
  return (
    <svg
      width="142"
      height="57"
      viewBox="0 0 142 57"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M71.2579 0L0 28.4443L70.7421 56.6826L142 28.2384L71.2579 0Z"
        fill="url(#paint0_linear_225_5528)"
        fill-opacity="0.4"
      />
      <defs>
        <linearGradient
          id="paint0_linear_225_5528"
          x1="71"
          y1="0"
          x2="71"
          y2="56.6826"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#01FF85" />
          <stop offset="1" stop-color="#01FF85" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
