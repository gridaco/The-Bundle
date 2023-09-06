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
            className="grid grid-cols-2 place-items-center gap-4 mt-24"
          >
            {packs.map((item: string, i: number) => (
              <Link
                key={i}
                href={`/library/download?item=${`v1/bin/${k}/${item}.zip`}`}
                download
                target="_blank"
              >
                <button>
                  <PackItem item={`${name} ${item.toUpperCase()}`} />
                </button>
              </Link>
            ))}
          </div>
        );
      })}
    </>
  );
}

function PackItem({ item }: { item: string }) {
  return (
    <div className="w-90 h-90">
      <Image src={"/bundle/gallery/01.png"} width={340} height={340} alt="" />
      <div className="flex opacity-80 flex-col items-start">
        <div className="flex flex-row justify-stretch w-full">
          <h4
            className="text-xl font-bold flex-1"
            style={{
              textAlign: "left",
            }}
          >
            {item}
          </h4>
          <span>·</span>
        </div>
        <p className="text-sm font-light">200 Objects · 8 Angles · 4K</p>
      </div>
    </div>
  );
}
