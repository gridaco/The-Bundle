"use client";
import React from "react";
import { ArrowUpIcon } from "@radix-ui/react-icons";

export function ScrollToTop() {
  const onclick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      about="scroll-to-top"
      aria-label="scroll-to-top"
      title="Scroll to Top"
      className="w-[40px] h-[40px] rounded-full border flex items-center justify-center"
      onClick={onclick}
    >
      <ArrowUpIcon />
    </button>
  );
}
