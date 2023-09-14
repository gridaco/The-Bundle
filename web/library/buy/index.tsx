"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BuyThisPackButton() {
  const pathName = usePathname();
  return (
    <Link href={pathName + "/checkout"}>
      <button className="bg-white hover:bg-neutral-200 text-black font-bold py-2 px-4 rounded">
        Purchase
      </button>
    </Link>
  );
}
