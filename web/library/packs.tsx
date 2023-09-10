import { materials } from "@/k/bundle.json";
import Image from "next/image";
import Link from "next/link";

export function Packs() {
  return (
    <>
      {Object.keys(materials).map((k) => {
        const item = (materials as any)[k];
        const name = item.name;
        const packs = item.packs;
        return (
          <div
            key={k}
            id={k}
            className="grid grid-cols-2 place-items-center gap-8 mt-24"
          >
            {packs.map((item: string, i: number) => (
              <Link key={i} href={`/library/${k}/${item}`}>
                <button>
                  <PackItem
                    src={`/bundle/thumbnails/${k}/${item}.png`}
                    n1={name}
                    n2={item.toUpperCase()}
                  />
                </button>
              </Link>
            ))}
          </div>
        );
      })}
    </>
  );
}

function PackItem({ n1, n2, src }: { src: string; n1: string; n2: string }) {
  return (
    <div className="w-90 h-90">
      <Image src={src} width={340} height={340} alt="" />
      <div className="flex opacity-90 flex-col items-start">
        <div className="flex flex-row justify-stretch w-full">
          <h4
            className="text-xl font-bold flex-1"
            style={{
              textAlign: "left",
            }}
          >
            {n1}
          </h4>
          <span className="text-sm font-black border p-1 rounded-sm min-w-[32px]">
            {n2}
          </span>
        </div>
        <p className="text-sm font-light">200 Objects · 8 Angles · 4K</p>
      </div>
    </div>
  );
}
