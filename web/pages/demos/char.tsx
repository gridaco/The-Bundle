// pages/index.tsx

import dynamic from "next/dynamic";
import { sketch } from "@motions/char/sketch";

// We don't want Next.js to render this component on the server, because p5.js needs a browser environment
const DynamicP5Wrapper = dynamic(() => import("../../components/p5-wrapper"), {
  ssr: false,
});

export default function Home() {
  // @ts-ignore
  return <DynamicP5Wrapper sketch={sketch} />;
}
