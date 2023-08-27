import React, { useEffect, useMemo, useState } from "react";
import { LinearProgress } from "@mui/material";
import styled from "@emotion/styled";
import { BakedImageSequence3DView } from "components/interactive-3d-object-baked-sequence-view";
import { useEditor } from "@/core/states/use-editor";
import { motion } from "framer-motion";

function IdleOverlay({ idle }: { idle?: boolean }) {
  return (
    <IdleWrapper
      className="loading"
      variants={{
        hide: {
          opacity: 0,
        },
        show: {
          opacity: 1,
        },
      }}
      animate={idle ? "show" : "hide"}
    >
      {idle && (
        <div className="message">
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
          <span>this may take up to 5 minutes</span>
        </div>
      )}
    </IdleWrapper>
  );
}

const IdleWrapper = styled(motion.div)`
  .message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    font-size: 12px;
  }
`;

export function Canvas({ busy }: { busy?: boolean }) {
  const { template, result } = useEditor();
  const [idle, setIdle] = useState(busy);
  const [loaded, setLoaded] = useState(false);

  const src = result?.src ?? template.preview;

  useEffect(() => {
    if (busy) {
      setLoaded(false);
      setIdle(true);
    }
  }, [busy]);

  useEffect(() => {
    setLoaded(false);
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setLoaded(true);
    };
  }, [src]);

  useEffect(() => {
    if (loaded) {
      setIdle(false);
    }
  }, [loaded]);

  return (
    <CanvasWrapper>
      <IdleOverlay idle={idle} />
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
      <motion.img
        className="main"
        src={src}
        variants={{
          loaded: {
            filter: "blur(0px)",
            opacity: 1,
          },
          loading: {
            filter: "blur(32px)",
            opacity: 0.5,
          },
        }}
        animate={loaded ? "loaded" : "loading"}
        onLoad={() => {
          setTimeout(() => {
            // 200ms delay to prevent flickering
            setLoaded(true);
          }, 200);
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
    background: rgba(0, 0, 0, 0.2);
    z-index: 2;
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
