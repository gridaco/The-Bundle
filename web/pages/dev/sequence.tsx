import styled from "@emotion/styled";
import { BakedImageSequence3DView } from "components/interactive-3d-object-baked-sequence-view";
import React, { useState } from "react";

export default function Sequence() {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  return (
    <Main>
      <div className="info">
        <p>
          position: 0 0 0
          <br />
          rotation: {rotation.x}° {rotation.y}° {"0"}°
        </p>
      </div>
      <BakedImageSequence3DView
        onChange={(e) => {
          setRotation({ x: e.rotation.x, y: e.rotation.y });
        }}
        resolver={({ rotation }) => {
          return `http://localhost:3000/render_x${rotation.y}_y${rotation.x}_z0.png`;
        }}
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
