import React, { useEffect, useMemo, useState } from "react";
import { LinearProgress } from "@mui/material";
import styled from "@emotion/styled";
import { BakedImageSequence3DView } from "components/interactive-3d-object-baked-sequence-view";

export function Canvas({ src, busy }: { src?: string; busy?: boolean }) {
  return (
    <CanvasWrapper>
      {busy && (
        <div className="loading">
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
        </div>
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
      {src && <img className="main" src={src} />}
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
    z-index: 1;
    backdrop-filter: blur(8px);
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
