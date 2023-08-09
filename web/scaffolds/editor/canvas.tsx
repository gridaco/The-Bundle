import React, { useEffect, useMemo, useState } from "react";
import { LinearProgress } from "@mui/material";
import styled from "@emotion/styled";
import { BakedImageSequence3DView } from "components/interactive-3d-object-baked-sequence-view";
import { useEditor } from "@/core/states/use-editor";

export function Canvas({ busy }: { busy?: boolean }) {
  const { template, result } = useEditor();

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
      {result?.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="main" src={result?.src} alt="result" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="main" src={template.preview} alt="result" />
      )}
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
