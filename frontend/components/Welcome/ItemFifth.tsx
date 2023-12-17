import { shortenIfAddress } from "@usedapp/core";
import { FC } from "react";

export type ItemFifthProps = {
  context?: string;
  onClick?: () => void;
};

// 76  146 218
export const ItemFifth: FC<ItemFifthProps> = (props) => {
  return (
    <svg
      width="171"
      height="68"
      viewBox="0 0 171 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.2"
        d="M85.8106 0L0 34.1235L85.1894 68L171 33.8765L85.8106 0Z"
        fill="url(#paint0_linear_225_5530)"
        fill-opacity="0.4"
      />
      <defs>
        <linearGradient
          id="paint0_linear_225_5530"
          x1="85.5"
          y1="0"
          x2="85.5"
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
