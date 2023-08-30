"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export function Slides() {
  const [index, setIndex] = useState(0);

  const images = [
    "/home/slides/1.png",
    "/home/slides/2.png",
    "/home/slides/3.png",
    "/home/slides/4.png",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const src = images[index];
  const nextIndex = (index + 1) % images.length;
  const nextSrc = images[nextIndex];

  const motionProps = {
    initial: { opacity: 1 },
    animate: { opacity: 0 },
    exit: { opacity: 1 },
    transition: { duration: 1 },
    key: index,
  };

  return (
    <div style={{ position: "relative", width: 950, height: 750 }}>
      <Image
        src={nextSrc}
        alt={`slide ${nextIndex}`}
        width={950}
        height={750}
      />
      <AnimatePresence mode="wait">
        <motion.div
          {...motionProps}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <Image src={src} alt={`slide ${index}`} width={950} height={750} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
