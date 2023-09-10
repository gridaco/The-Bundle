import DissolveSlider from "@/home/desolve-slider";
import { materials } from "@/k/bundle.json";
import assert from "assert";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function PackDetailPage(props: { params: any }) {
  const matPack = props.params.matpack;
  const objPack = props.params.objpack;
  const objPackName = objPack.toUpperCase();

  let matPackName: string;
  try {
    const __mat = (materials as any)[matPack];
    assert(__mat["packs"].includes(objPack));

    matPackName = __mat["name"];
  } catch (e) {
    notFound();
  }

  return (
    <main className="max-w-screen-xl p-24 m-auto align-center text-center">
      <header className="flex flex-col items-center">
        <div>
          <DissolveSlider
            style={{
              width: 600,
              height: 600,
            }}
            images={["/bundle/tmp/p-01.png", "/bundle/tmp/p-02.png"]}
            interval={5}
            delay={0}
            duration={1}
          />
          {/* <Image src={} alt="." width={800} height={800} /> */}
        </div>
        <h1 className="flex gap-4 text-6xl font-bold p-24">
          {matPackName}{" "}
          <span className="border p-1 text-2xl rounded-sm h-full min-w-[40px]">
            {objPackName}
          </span>
        </h1>
        <Link
          href={`/library/download?item=${`v1/bin/${matPack}/${objPack}.zip`}`}
          download
          target="_blank"
        >
          <button className="bg-white hover:bg-neutral-200 text-black font-bold py-2 px-4 rounded">
            Download {matPackName} {objPackName}
          </button>
        </Link>
      </header>
      <div className="select-none pointer-events-none">
        <div className="flex flex-col items-center mt-40">
          <Image src={"/bundle/tmp/01.png"} alt="." width={800} height={800} />
        </div>
        <div className="flex flex-col items-center mt-40">
          <Image src={"/bundle/tmp/02.png"} alt="." width={800} height={800} />
        </div>
      </div>
      <div></div>
      <footer></footer>
    </main>
  );
}
