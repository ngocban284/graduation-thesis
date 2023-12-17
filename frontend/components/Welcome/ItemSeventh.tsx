import { shortenIfAddress } from "@usedapp/core";
import { FC } from "react";

export type ItemSeventhProps = {
  context?: string;
  onClick?: () => void;
};

// 76  146 218
export const ItemSeventh: FC<ItemSeventhProps> = (props) => {
  return (
    <svg
      width="226"
      height="90"
      viewBox="0 0 226 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M113.41 0L0 45.1635L112.59 90L226 44.8365L113.41 0Z"
        fill="url(#paint0_linear_225_5527)"
        fill-opacity="0.4"
      />
      <defs>
        <linearGradient
          id="paint0_linear_225_5527"
          x1="113"
          y1="0"
          x2="113"
          y2="90"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#01FF85" />
          <stop offset="1" stop-color="#01FF85" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};
