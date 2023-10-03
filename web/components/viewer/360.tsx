"use client";
import React, { useEffect, useRef, useState } from "react";
import { useGesture } from "@use-gesture/react";
import styled from "@emotion/styled";

const inbetween = (min: number, max: number, value: number) =>
  Math.max(min, Math.min(max, value));

interface Object3DViewChangeEvent {
  rotation: { x: number; y: number; z: number };
  zoom: number;
}

const HARD_MIN = -360;
const HARD_MAX = 360;

type Resolver = (value: Object3DViewChangeEvent) => string;

interface RotationSpec {
  xmin?: number;
  xmax?: number;
  ymin?: number;
  ymax?: number;
  zmin?: number;
  zmax?: number;
  step?: number;
  xstep?: number;
  ystep?: number;
  zstep?: number;
}

export function V360View({
  onChange,
  resolver,
  disableZoom,
  style,
  width = 1000,
  height = 1000,
  //
  xmax = 360,
  xmin = -360,
  ymax = 360,
  ymin = -360,
  zmax = 360,
  zmin = -360,
  step = 1,
  xstep = 1,
  ystep = 1,
  zstep = 1,
}: {
  onChange?: (e: Object3DViewChangeEvent) => void;
  resolver: Resolver;
  disableZoom?: boolean;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
} & RotationSpec) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const isBrowser = typeof window !== "undefined";

  const img = useRef(isBrowser ? new Image() : {});

  const handler = ({ event, offset: [x, y], delta }: any) => {
    event.preventDefault();
    let rotationX = Math.round(x / step) * step;
    let rotationY = Math.round(y / step) * step;

    rotationX = inbetween(xmin, xmax, rotationX);
    rotationY = inbetween(ymin, ymax, rotationY);

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
    <Canvas
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

const Canvas = styled.canvas`
  cursor: grab;
  width: 500px;
  display: block;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &[data-interaction="dragging"] {
    cursor: grabbing;
  }
`;
