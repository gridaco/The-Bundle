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
  style,
  width = 1000,
  height = 1000,
}: {
  onChange?: (e: Object3DViewChangeEvent) => void;
  resolver: Resolver;
  disableZoom?: boolean;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const isBrowser = typeof window !== "undefined";

  const img = useRef(isBrowser ? new Image() : {});

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

    (img.current as HTMLImageElement).onload = function () {
      const iw = canvas.width;
      const ih = canvas.height;

      const x = canvas.width / 2 - (iw / 2) * zoom;
      const y = canvas.height / 2 - (ih / 2) * zoom;
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      ctx?.save();
      ctx?.translate(x, y);
      ctx?.scale(zoom, zoom);
      ctx?.drawImage(img.current as HTMLImageElement, 0, 0, iw, ih);
      ctx?.restore();
    };
  }, [zoom]);

  useEffect(() => {
    (img.current as HTMLImageElement).src = resolver({
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
  }, [onChange, resolver, rotation, zoom]);

  return (
    <canvas
      width={width}
      height={height}
      style={{
        ...style,
        cursor: isDragging ? "grabbing" : "default",
      }}
      id="canvas"
      ref={canvasRef}
      data-interaction={isDragging ? "dragging" : ""}
    />
  );
}
