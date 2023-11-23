import React from "react";
import { Dela_Gothic_One } from "next/font/google";

const delta_gothic_one = Dela_Gothic_One({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default function Title() {
  return (
    <header className="flex flex-col items-center justify-center h-full mb-20">
      <h1 className="text-5xl lg:text-7xl">
        <span className={delta_gothic_one.className}>The Bundle</span>
      </h1>
    </header>
  );
}
