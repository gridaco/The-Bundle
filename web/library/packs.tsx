import bundle from "@/k/bundle.json";
import Image from "next/image";
import Link from "next/link";

const materials = bundle.materials;

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
            className="flex flex-wrap gap-10 sm:gap-16 md:gap-20 mb-40"
          >
            {packs.map((item: string, i: number) => (
              <Link key={i} href={`/${k}/${item}`}>
                <button>
                  <PackItem
                    src={`/bundle/thumbnails/${k}/${item}.png`}
                    n1={name}
                    n2={item.toUpperCase()}
                    id1={k}
                    id2={item}
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

function PackItem({
  n1,
  n2,
  id1,
  id2,
  src,
}: {
  src: string;
  n1: string;
  n2: string;
  id1: string;
  id2: string;
}) {
  return (
    <div className="w-32 h-32 sm:w-56 sm:h-56 xl:w-64 xl:h-64 2xl:w-80 2xl:h-80">
      <Image src={src} width={512} height={512} alt="" />
      <div className="flex opacity-90 flex-col items-start gap-1 md:gap-0">
        <div className="flex flex-row justify-stretch w-full">
          <h4
            className="text-md font-semibold md:text-lg lg:text-xl md:font-bold flex-1"
            style={{
              textAlign: "left",
            }}
          >
            {n1}
          </h4>
          <span className="text-sm font-bold md:font-black border p-[2px] md:p-1 rounded-sm min-w-[24px] md:min-w-[32px] h-min">
            {n2}
          </span>
        </div>
        <p className="text-sm font-light text-left">
          {/* TODO: update this with informative properties */}
          4K · {id1} · {id2}
        </p>
      </div>
    </div>
  );
}
