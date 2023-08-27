// components/P5Wrapper.tsx

import { useEffect, useRef } from "react";
import { P5Instance } from "../types/p5"; // We'll define this type soon
import p5 from "p5";

interface P5WrapperProps {
  sketch: (p5: P5Instance) => void;
}

const P5Wrapper: React.FC<P5WrapperProps> = ({ sketch }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  let p5Instance: p5 | null = null;

  useEffect(() => {
    if (wrapperRef.current) {
      p5Instance = new p5(sketch, wrapperRef.current);
    }
    return () => {
      p5Instance?.remove();
    };
  }, [sketch]);

  return <div ref={wrapperRef} style={{ width: "100%", height: "100vh" }} />;
};

export default P5Wrapper;
