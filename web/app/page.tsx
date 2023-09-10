import Image from "next/image";
import { Dela_Gothic_One } from "next/font/google";
import ImageColumn from "@/home/image-column";
import Link from "next/link";
import { HeroVideo } from "@/home/hero-video";

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
  const cta_link = "/pricing";
  const cta_txt = "Get The Bundle";
  // const demo_link = "/demo.zip";

  return (
    <main className="relative flex min-h-screen flex-col justify-between gap-40">
      <section className="max-w-screen-xl m-auto w-full pl-8 xl:pl-0 flex flex-row items-center justify-between pb-24 min-h-screen">
        <div className="flex flex-col items-start">
          <h1 className="text-5xl lg:text-7xl">
            <span className={delta_gothic_one.className}>The Bundle</span>
          </h1>
          <div className="h-4" />
          <Link href={"/library"} target="_blank">
            <button className="bg-white hover:bg-gray-200 text-black font-bold py-2 px-4 rounded">
              Visit Library
            </button>
          </Link>
        </div>
        <div className="overflow-hidden flex h-max items-center justify-center flex-1 -z-10">
          <div className="w-full h-fit opacity-80 absolute inset-0 top-[50vh] md:relative md:opacity-100 md:top-[80px] md:left-[80px]">
            {/* position: relative;
  top: 80px;
  left: 80px; */}
            <HeroVideo />
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
      <section className="max-w-screen-xl m-auto min-w-max overflow-visible">
        <div className="w-screen flex gap-2 justify-center">
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
        </div>
      </section>
      <div className="h-8 md:h-24" />
      <section className="max-w-screen-xl m-auto w-full pl-8 xl:pl-0 flex pb-36 justify-between items-center">
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
              {/* <Link href={contacts.demo} target="_blank">
                <button className="border-white hover:bg-neutral-900 text-white font-bold py-2 px-4 rounded">
                  Book a Demo
                </button>
              </Link> */}
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
          className="md:opacity-100 opacity-25 select-none lg:w-8/12 flex-1 absolute right-0 bottom-0 -z-10 max-w-4xl"
          alt={"cta-bg-4k-example"}
          width={950}
          height={750}
        />
      </section>
    </main>
  );
}
