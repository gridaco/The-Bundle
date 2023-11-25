"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NextImage from "next/image";

type DissolveSliderProps = {
  interval: number;
  images: string[];
  delay: number;
  duration: number;
  style?: React.CSSProperties;
};

const DissolveSlider: React.FC<DissolveSliderProps> = ({
  interval,
  images,
  delay,
  duration,
  style,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [loaded, setLoaded] = useState<boolean[]>(
    new Array(images.length).fill(false)
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const preloadImage = (src: string, index: number) => {
      const img = new Image();
      img.onload = () => {
        setLoaded((prev) => {
          const newLoaded = [...prev];
          newLoaded[index] = true;
          return newLoaded;
        });
      };
      img.src = src;
    };

    images.forEach(preloadImage);
  }, [images]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      const nextIndex = (activeIndex + 1) % images.length;
      if (loaded[nextIndex]) {
        setNextIndex(nextIndex);
      }
    }, interval * 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeIndex, images.length, interval, loaded]);

  useEffect(() => {
    if (nextIndex !== null) {
      const timer = setTimeout(() => {
        setActiveIndex(nextIndex);
        setNextIndex(null);
      }, delay * 1000);

      return () => clearTimeout(timer);
    }
  }, [delay, nextIndex]);

  return (
    <div
      className="select-none pointer-events-none"
      style={{
        ...style,
        position: "relative",
      }}
    >
      <AnimatePresence>
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration }}
        >
          <NextImage src={images[activeIndex]} fill alt="hero slide" />
        </motion.div>
        {nextIndex !== null && (
          <motion.div
            key={nextIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration }}

          >
            <NextImage src={images[nextIndex]} fill alt="hero slide" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DissolveSlider;
