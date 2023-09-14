import DissolveSlider from "@/home/desolve-slider";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { packdata } from "@/data";
import { BuyThisPackButton } from "@/library/buy";

type Props = {
  params: { matpack: string; objpack: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const { label, images } = packdata(params);

    const previousImages = (await parent).openGraph?.images || [];

    return {
      title: `${label} | The Bundle`,
      openGraph: {
        images: [images.thumbnail.src, ...previousImages],
      },
    };
  } catch (e) {
    return {};
  }
}

export default function PackDetailPage(props: Props) {
  const alpha = !!props.searchParams.alpha;
  const { images, matpack, objpack, download, label } = packdata(props.params);

  return (
    <main className="relative p-4 md:max-w-screen-xl md:p-24 m-auto align-center text-center">
      <div className="absolute p-4 md:pl-24 md:pr-24 top-4 right-4 left-4 md:max-w-screen-xl m-auto flex">
        <Link href="/library" className="opacity-80 hover:opacity-100">
          <button className="flex flex-row items-center gap-2 p-3 bg-black rounded-full hover:invert transition-all">
            <ArrowLeftIcon />
          </button>
        </Link>
      </div>
      <header className="flex flex-col items-center">
        <div>
          <DissolveSlider
            style={{
              width: 600,
              height: 600,
            }}
            images={[
              images.thumbnail.src,
              //
              // "/bundle/tmp/p-01.png",
              // "/bundle/tmp/p-02.png",
            ]}
            interval={5}
            delay={0}
            duration={1}
          />
          {/* <Image src={} alt="." width={800} height={800} /> */}
        </div>
        <h1 className="flex gap-4 text-6xl font-bold p-24">
          {matpack.name}{" "}
          <span className="border p-1 text-2xl rounded-sm h-full min-w-[40px]">
            {objpack.name}
          </span>
        </h1>
        <div className="flex flex-col gap-8">
          <Link href={download} target="_blank">
            <button className="bg-white hover:bg-neutral-200 text-black font-bold py-2 px-4 rounded">
              Download {label}
            </button>
          </Link>
          {alpha && <BuyThisPackButton />}
        </div>
      </header>
      <div className="select-none pointer-events-none">
        {images.previews.map(({ src, alt }, i) => (
          <div key={i} className="flex flex-col items-center mt-40">
            <Image src={src} alt={alt} width={800} height={800} />
          </div>
        ))}
      </div>
      <div className="p-24">
        <Link href={download} target="_blank">
          <button className="bg-white hover:bg-neutral-200 text-black font-bold py-2 px-4 rounded">
            Download {label}
          </button>
        </Link>
      </div>
      <div></div>
      <footer className="p-4 pt-40 flex flex-col items-center justify-center text-center">
        <p className="opacity-50 text-xs leading-tight">
          The Bundle by Grida -<br />© {new Date().getFullYear()} Grida, Inc.
          All Rights Reserved.
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
    </main>
  );
}
