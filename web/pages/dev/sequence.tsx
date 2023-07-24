import styled from "@emotion/styled";
import { useGesture } from "@use-gesture/react";
import React, { useEffect, useRef, useState } from "react";

const inbetween = (min, max, value) => Math.max(min, Math.min(max, value));

export default function Sequence() {
  const canvasRef = useRef<HTMLCanvasElement>();
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const step = 3;

  const x_min = -45;
  const x_max = 45;
  const y_min = -30;
  const y_max = 30;
  const z_min = 0;
  const z_max = 0;

  const handler = ({ event, offset: [x, y], delta }) => {
    event.preventDefault();
    let rotationX = Math.round(x / step) * step;
    let rotationY = Math.round(y / step) * step;

    rotationX = inbetween(x_min, x_max, rotationX);
    rotationY = inbetween(y_min, y_max, rotationY);

    setRotation({ x: rotationX, y: rotationY });
  };

  useGesture(
    {
      onDragStart: () => {
        setIsDragging(true);
      },
      onDragEnd: () => {
        setIsDragging(false);
      },
      onDrag: handler,
      onWheel: ({ event, offset: [, y], delta: [, dy] }) => {
        event.preventDefault();
        setZoom(zoom - dy / 1000);
      },
    },
    {
      target: canvasRef,
      eventOptions: { passive: false },
    }
  );

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = function () {
      const x = canvas.width / 2 - (img.width / 2) * zoom;
      const y = canvas.height / 2 - (img.height / 2) * zoom;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(x, y);
      ctx.scale(zoom, zoom);
      ctx.drawImage(img, 0, 0, img.width, img.height);
      ctx.restore();
    };

    img.src = `http://localhost:3000/render_x${rotation.y}_y${rotation.x}_z0.png`;
  }, [rotation, zoom]);

  return (
    <Main>
      <div className="info">
        <p>
          position: 0 0 0
          <br />
          rotation: {rotation.x}° {rotation.y}° {"0"}°
        </p>
      </div>
      <canvas
        id="canvas"
        ref={canvasRef}
        data-interaction={isDragging ? "dragging" : ""}
      />
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;

  .info {
    position: absolute;
    top: 0;
    left: 0;
    padding: 1rem;
  }

  canvas {
    cursor: grab;
    width: 500px;
    display: block;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);

    &[data-interaction="dragging"] {
      cursor: grabbing;
    }
  }
`;
