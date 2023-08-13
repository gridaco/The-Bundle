import React, { useEffect, useMemo, useState } from "react";
import { LinearProgress } from "@mui/material";
import styled from "@emotion/styled";
import { BakedImageSequence3DView } from "components/interactive-3d-object-baked-sequence-view";
import { useEditor } from "@/core/states/use-editor";
import { motion } from "framer-motion";

export function Canvas({ busy }: { busy?: boolean }) {
  const { template, result } = useEditor();

  const src = result?.src ?? template.preview;

  return (
    <CanvasWrapper>
      {busy && (
        <motion.div
          className="loading"
          initial={{
            backdropFilter: "blur(0px)",
            opacity: 0,
          }}
          animate={{
            backdropFilter: "blur(32px)",
            opacity: 1,
          }}
        >
          <LinearProgress
            sx={{
              backgroundColor: "white",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "black",
              },
            }}
            style={{
              width: "50%",
            }}
          />
        </motion.div>
      )}
      {/* <BakedImageSequence3DView
        style={{
          width: "100%",
          height: "100%",
        }}
        onChange={() => {}}
        resolver={({ rotation }) => {
          return `http://localhost:3000/render_x${rotation.y}_y${rotation.x}_z0.png`;
        }}
      /> */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="main"
        src={src}
        onLoad={() => {
          //
        }}
        alt="result"
      />

      {/* <div
        style={{
          padding: 40,
        }}
      >
        <h1>{templateId}</h1>
      </div> */}
    </CanvasWrapper>
  );
}

const CanvasWrapper = styled.div`
  overflow: hidden;
  width: 100%;
  height: 100%;

  .loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }

  /* disable right-click */
  user-select: none;
  img {
    pointer-events: none;
  }

  img.main {
    width: 100%;
    height: 100%;
  }
`;
