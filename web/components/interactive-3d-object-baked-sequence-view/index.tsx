import { useGesture } from "@use-gesture/react";
import React, { useEffect, useRef, useState } from "react";

const inbetween = (min, max, value) => Math.max(min, Math.min(max, value));

interface Object3DViewChangeEvent {
  rotation: { x: number; y: number; z: number };
  zoom: number;
}

type Resolver = (value: Object3DViewChangeEvent) => string;

export function BakedImageSequence3DView({
  onChange,
  resolver,
  disableZoom,
}: {
  onChange?: (e: Object3DViewChangeEvent) => void;
  resolver: Resolver;
  disableZoom?: boolean;
}) {
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
      onWheel: disableZoom
        ? () => {}
        : ({ event, offset: [, y], delta: [, dy] }) => {
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

    img.src = resolver({
      rotation: {
        x: rotation.x,
        y: rotation.y,
        z: 0,
      },
      zoom,
    });

    onChange?.({
      rotation: {
        x: rotation.x,
        y: rotation.y,
        z: 0,
      },
      zoom,
    });
  }, [rotation, zoom]);

  return (
    <canvas
      id="canvas"
      ref={canvasRef}
      data-interaction={isDragging ? "dragging" : ""}
    />
  );
}
