import Image from "next/image";
import { Dela_Gothic_One } from "next/font/google";

const delta_gothic_one = Dela_Gothic_One({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-between gap-40">
      <section className="flex flex-row items-center justify-between pl-24">
        <div className="flex flex-col items-start">
          <h1 className="text-8xl">
            <span className={delta_gothic_one.className}>The Bundle</span>
          </h1>
          <div className="h-4" />
          <button className="bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded">
            Get The Bundle
          </button>
        </div>
        <Image
          src="/home/slides/slide-1.png"
          alt={"slide 1"}
          width={950}
          height={750}
        />
      </section>
      <section
        className="flex min-w-max p-20"
        style={{
          height: 900,
        }}
      >
        <div className="bg-gray-900 flex-1" />
        <div className="bg-gray-700 flex-1" />
        <div className="bg-gray-900 flex-1" />
        <div className="bg-gray-700 flex-1" />
        <div className="bg-gray-900 flex-1" />
        <div className="bg-gray-700 flex-1" />
      </section>
      <section className="flex pl-24 justify-between">
        <div className="flex flex-col">
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
            <button className="bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded">
              Get The Bundle
            </button>
            <button className="border-white hover:bg-gray-900 text-white font-bold py-2 px-4 rounded">
              Download Free Demo File
            </button>
          </div>
        </div>
        <Image
          src="/home/cta-bg-4k-example.png"
          alt={"cta-bg-4k-example"}
          width={950}
          height={750}
        />
      </section>
      <footer className="p-24">
        <span className="opacity-50">
          The Bundle by Grida - © {new Date().getFullYear()} Grida, Inc. All
          Rights Reserved.
        </span>
      </footer>
    </main>
  );
}
