import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function SmoothLoadImage(props: React.ComponentProps<typeof Image>) {
  const [loaded, setLoaded] = React.useState(false);

  return (
    // @ts-ignore
    <AnimatedImage
      // @ts-ignore
      alt="fallback"
      {...props}
      onLoad={(e) => {
        setLoaded(true);
      }}
      variants={{
        hidden: {
          opacity: 0,
        },
        visible: {
          opacity: 1,
        },
      }}
      initial="hidden"
      animate={loaded ? "visible" : "hidden"}
    />
  );
}

const AnimatedImage = motion(Image);
