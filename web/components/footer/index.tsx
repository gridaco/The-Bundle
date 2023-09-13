import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="p-4 pt-40 flex flex-col items-center justify-center text-center">
      <p className="opacity-50 text-xs leading-tight">
        The Bundle by Grida -<br />© {new Date().getFullYear()} Grida, Inc. All
        Rights Reserved.
      </p>
      <Link href="https://instagram.com/grida.co">
        <div className="mt-4">
          <Image
            src="/bundle/grida.svg"
            alt="Grida Logo"
            width={20}
            height={20}
          />
        </div>
      </Link>
    </footer>
  );
}
