import Image from "next/image";
import { Dela_Gothic_One } from "next/font/google";
import ImageColumn from "@/home/image-column";
import DisolveSlider from "@/home/desolve-slider";
import Link from "next/link";

const delta_gothic_one = Dela_Gothic_One({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const images = [
  "/bundle/home/slides/1.png",
  "/bundle/home/slides/2.png",
  "/bundle/home/slides/3.png",
  "/bundle/home/slides/4.png",
];

export default function Home() {
  const cta_link = "/signin";
  const cta_txt = "Get The Bundle";
  // const demo_link = "/demo.zip";

  return (
    <main className="relative flex min-h-screen flex-col justify-between gap-40">
      <section className="flex flex-row items-center justify-between pl-48 pb-24 min-h-screen">
        <div className="flex flex-col items-start">
          <h1 className="text-7xl">
            <span className={delta_gothic_one.className}>The Bundle</span>
          </h1>
          <div className="h-4" />
          <Link href={cta_link} target="_blank">
            <button className="bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded">
              {cta_txt}
            </button>
          </Link>
        </div>
        <div className="flex h-max items-center justify-center flex-1 relative">
          <div
            style={{
              position: "relative",
              top: 80,
              width: 860,
              height: 860,
            }}
          >
            <video
              muted
              autoPlay
              loop
              src="/bundle/tmp/seqs.mp4"
              // https://player.vimeo.com/progressive_redirect/playback/860123788/rendition/1080p/file.mp4?loc=external&log_user=0&signature=ac9c2e0d2e367d8a31af6490edad8c1f7bae87d085c4f3909773a7ca5a129cb6
            />
          </div>
          {/* <DisolveSlider
            images={images}
            interval={6}
            delay={0.2}
            duration={0.5}
            style={{
              width: "100%",
              height: "100vh",
            }}
          /> */}
        </div>
      </section>
      <section
        className="flex min-w-max pl-32 pr-32 gap-2 justify-center"
        style={{
          height: 540,
        }}
      >
        {[
          "/bundle/home/columns/1.png",
          "/bundle/home/columns/2.png",
          "/bundle/home/columns/3.png",
          "/bundle/home/columns/4.png",
          "/bundle/home/columns/5.png",
        ].map((src, i) => (
          <ImageColumn
            key={i}
            src={src}
            alt={i.toString()}
            objectFit="cover"
            width={256}
            height={512}
          />
        ))}
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
            <span className="opacity-50 text-sm">*Starting from $19 / Mo</span>
            <div className="h-10" />
            <div className="flex gap-4">
              <Link href={cta_link} target="_blank">
                <button className="bg-white hover:bg-neutral-200 text-black font-bold py-2 px-4 rounded">
                  {cta_txt}
                </button>
              </Link>
              <Link href={cta_link} target="_blank">
                <button className="border-white hover:bg-neutral-900 text-white font-bold py-2 px-4 rounded">
                  Download Free Demo File
                </button>
              </Link>
            </div>
          </div>
          <footer>
            <p className="opacity-50 text-xs leading-tight">
              The Bundle by Grida -<br />© {new Date().getFullYear()} Grida,
              Inc. All Rights Reserved.
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
        </div>
        <Image
          src="/bundle/home/cta-bg-4k-example.png"
          className="select-none"
          alt={"cta-bg-4k-example"}
          width={950}
          height={750}
        />
      </section>
    </main>
  );
}
