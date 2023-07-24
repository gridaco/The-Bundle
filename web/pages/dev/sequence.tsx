import styled from "@emotion/styled";
import { useGesture } from "@use-gesture/react";
import React, { useEffect, useRef, useState } from "react";

export default function Sequence() {
  const ref = useRef();
  const canvasRef = useRef<HTMLCanvasElement>();
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const step = 3;

  const handler = ({ event, offset: [x, y] }) => {
    event.preventDefault();
    let rotationX = Math.round(x / step) * step;
    let rotationY = Math.round(y / step) * step;

    rotationX = Math.max(-30, Math.min(30, rotationX));
    rotationY = Math.max(-45, Math.min(45, rotationY));

    setRotation({ x: rotationX, y: rotationY });
  };

  useGesture(
    {
      onDrag: handler,
      onWheel: handler,
    },
    {
      target: ref,
      eventOptions: { passive: false },
    }
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = function () {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    img.src = `http://localhost:3000/render_x${rotation.y}_y${rotation.x}_z0.png`;
  }, [rotation]);

  return (
    <Main ref={ref}>
      <canvas id="canvas" ref={canvasRef} />
    </Main>
  );
}

const Main = styled.main`
  width: 100vw;
  height: 100vh;

  canvas {
    height: 100vh;
    width: 100vw;
    display: block;
  }
`;
