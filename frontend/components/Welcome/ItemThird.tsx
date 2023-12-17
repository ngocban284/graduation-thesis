import { shortenIfAddress } from "@usedapp/core";
import { FC } from "react";

export type ItemFirstProps = {
  context?: string;
  onClick?: () => void;
};

// 76  146 218
export const ItemThird: FC<ItemFirstProps> = (props) => {
  return (
    <svg
      width="166"
      height="73"
      viewBox="0 0 166 73"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M83.3015 0L0 36.4733L82.6985 72.6826L166 36.2093L83.3015 0Z"
        fill="url(#paint0_linear_225_5526)"
        fill-opacity="0.4"
      />
      <defs>
        <linearGradient
          id="paint0_linear_225_5526"
          x1="83"
          y1="0"
          x2="83"
          y2="72.6826"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#01FF85" />
          <stop offset="1" stop-color="#01FF85" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
