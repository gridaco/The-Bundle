"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export function MaterialsNav() {
  return (
    <div className="flex flex-row gap-8 w-fit">
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
          <motion.div
            className="select-none w-24 h-24"
            whileHover={{
              scale: 1.1,
            }}
          >
            <Image
              src={`/bundle/icons/${m}.png`}
              width={100}
              height={100}
              alt={m}
            />
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
