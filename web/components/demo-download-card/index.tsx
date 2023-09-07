import Image from "next/image";
import Link from "next/link";
import React from "react";

export function DemoDownloadCard() {
  return (
    <div className="flex">
      <div className="flex flex-col flex-1 justify-between items-start gap-4">
        <div className="flex flex-col">
          <h3 className="text-2xl font-bold text-start">Try our Demo file</h3>
          <p className="text-sm opacity-80">
            Having trouble to decide? Try our demo file, see what you can do for
            yourself.
          </p>
        </div>
        <div className="flex flex-col">
          <span className="opacity-80 text-xs">*non-commercial use only</span>
          <Link
            className="underline"
            href={"/library/download?item=v1/bin/The+Bundle+V1+Demo.zip"}
          >
            Download Free Demo File
          </Link>
        </div>
      </div>

      <div className="relative flex-1">
        <div className="absolute bottom-0 right-8">
          <Image
            src="/bundle/assets/try-our-demo-card-artwork.png"
            alt="download demo illust"
            width={150}
            height={180}
          />
        </div>
      </div>
    </div>
  );
}
