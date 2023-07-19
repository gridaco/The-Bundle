import React, { useEffect, useMemo, useState } from "react";
import { LinearProgress } from "@mui/material";
import styled from "@emotion/styled";

export function Canvas({ src, busy }: { src?: string; busy?: boolean }) {
  return (
    <div className="canvas">
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
        <img className="main" src={src} />
      </CanvasWrapper>
    </div>
  );
}

const CanvasWrapper = styled.div`
  position: relative;
  min-width: 500px;
  min-height: 500px;
  aspect-ratio: 1 / 1;
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);

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
