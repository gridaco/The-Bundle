import Image from "next/image";
import { Dela_Gothic_One } from "next/font/google";
import { Slides } from "@/home/slider";
import Link from "next/link";

const delta_gothic_one = Dela_Gothic_One({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col justify-between gap-40">
      <section className="flex flex-row items-center justify-between pl-48 pb-24 min-h-screen">
        <div className="flex flex-col items-start">
          <h1 className="text-8xl">
            <span className={delta_gothic_one.className}>The Bundle</span>
          </h1>
          <div className="h-4" />
          <button className="bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded">
            Get The Bundle
          </button>
        </div>
        <Slides />
      </section>
      <section
        className="flex min-w-max p-20 gap-2"
        style={{
          height: 900,
        }}
      >
        <div className="bg-neutral-900 flex-1 rounded-sm" />
        <div className="bg-neutral-700 flex-1 rounded-sm" />
        <div className="bg-neutral-900 flex-1 rounded-sm" />
        <div className="bg-neutral-700 flex-1 rounded-sm" />
        <div className="bg-neutral-900 flex-1 rounded-sm" />
      </section>
      <section className="flex pl-48 justify-between items-center">
        <div className="flex flex-col justify-between h-[500px]">
          <div className="flex flex-col flex-grow">
            <h2 className="text-3xl font-bold">
              100,000 <span className="opacity-50">4K PNGs</span>
              <br />
              <span className="opacity-50">50 Angles</span> 500 Objects
              <br />
              50 Materials <span className="opacity-50">20 Scenes</span>
            </h2>
            <span className="opacity-50 text-sm">*Starting from $499 / Mo</span>
            <div className="h-10" />
            <div className="flex gap-4">
              <Link href="/signin">
                <button className="bg-white hover:bg-neutral-200 text-black font-bold py-2 px-4 rounded">
                  Get The Bundle
                </button>
              </Link>
              <Link href="/demo.zip" target="_blank" download>
                <button className="border-white hover:bg-neutral-900 text-white font-bold py-2 px-4 rounded">
                  Download Free Demo File
                </button>
              </Link>
            </div>
          </div>
          <footer>
            <span className="opacity-50">
              The Bundle by Grida - © {new Date().getFullYear()} Grida, Inc. All
              Rights Reserved.
            </span>
          </footer>
        </div>
        <Image
          src="/home/cta-bg-4k-example.png"
          className="select-none"
          alt={"cta-bg-4k-example"}
          width={950}
          height={750}
        />
      </section>
    </main>
  );
}
