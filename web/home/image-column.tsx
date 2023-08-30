"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ImageColumn({
  ...props
}: {} & React.ComponentProps<typeof Image>) {
  return (
    <motion.div
      initial={{
        scale: 1,
        opacity: 0.75,
        // grey filter
        filter: "grayscale(100%)",
      }}
      whileHover={{
        scale: 1.01,
        opacity: 1,
        filter: "grayscale(0%)",
      }}
    >
      <Image
        src={props.src}
        alt={props.alt}
        width={props.width}
        height={props.height}
        className="flex-1 rounded-sm object-cover userselect-none"
      />
    </motion.div>
  );
}
