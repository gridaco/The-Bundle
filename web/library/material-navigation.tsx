import Image from "next/image";
import Link from "next/link";

export function MaterialsNav() {
  return (
    <div className="flex flex-row gap-4 w-fit">
      {[
        "cmp.aluminium-foil",
        "cmp.battered",
        "cmp.clay",
        "cmp.frosted-dispersion-glass",
        "cmp.frosted-glass",
        "cmp.glass",
        "cmp.gold-foil",
        "cmp.marble",
        "cmp.plastic",
        "cmp.subtle-imperfections",
        "m.blob",
        "m.chrome",
        "m.cloudy",
        "m.copper",
        "m.gold",
        "m.hologram",
        "m.silver",
        "p.reflective",
        "p.rough",
        "sss",
      ].map((m, i) => (
        <Link href={`/library/#${m}`} key={i}>
          <div className="select-none w-20 h-20">
            <Image
              src={`/bundle/icons/${m}.png`}
              width={100}
              height={100}
              alt={m}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
