import React, { useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import styled from "@emotion/styled";
import {
  LightningBoltIcon,
  DownloadIcon,
  TransparencyGridIcon,
} from "@radix-ui/react-icons";
import { BakedImageSequence3DView } from "components/interactive-3d-object-baked-sequence-view";
import { useEditor } from "@/core/states/use-editor";
import { Options } from "./options";

const SnapWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  /* height: 60px; */
  aspect-ratio: 1 / 1;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

function CameraComposition({}) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  return (
    <CameraCompsitionContainer>
      <BakedImageSequence3DView
        disableZoom
        onChange={(e) => {
          setRotation(e.rotation);
        }}
        resolver={({ rotation }) => {
          return `http://localhost:3000/render_x${rotation.y}_y${rotation.x}_z0.png`;
        }}
      />
      <input id="x" type="number" min={-45} max={45} value={rotation.x} />
      <input id="y" type="number" min={-30} max={30} value={rotation.y} />
      <input id="z" type="number" min={-30} max={30} value={0} />
    </CameraCompsitionContainer>
  );
}

const CameraCompsitionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: 100%;
  padding: 12px;

  canvas {
    width: 100%;
  }
`;

export function Controller({
  showDownload,
  onDownload,
  onSubmit,
}: {
  showDownload?: boolean;
  onDownload?: () => void;
  onSubmit?: (
    e: React.FormEvent<HTMLFormElement>,
    options?: {
      preset?: string;
    }
  ) => void;
}) {
  const {
    //
  } = useEditor();
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [expanded, setExpanded] = useState(false);
  // const [preset, setPreset] = useState<string>();

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        width: "100%",
        flexDirection: "column",
      }}
    >
      {expanded && (
        <Bar
          style={{
            height: "100%",
          }}
        >
          <Options />
        </Bar>
      )}

      <ControllerWrapper>
        <Bar>
          <div
            className="slot scene"
            onClick={() => {
              setExpanded(!expanded);
            }}
          >
            <TransparencyGridIcon width="100%" height="100%" />
          </div>
          <form
            ref={formRef}
            onSubmit={(e) => {
              setExpanded(false);
              e.preventDefault();
              onSubmit?.(e, {});

              // focus out the textarea
              inputRef.current?.blur();
            }}
          >
            <TextareaAutosize
              ref={inputRef}
              id="body"
              placeholder="Type text to render"
              // maxLength={7}
              minRows={1}
              maxRows={3}
              autoFocus
              autoComplete="off"
              onKeyDown={(e) => {
                // disable default enter behaviour - on enter, submit, not new line
                if (e.key === "Enter") {
                  if (e.shiftKey) {
                    return;
                  } else {
                    e.preventDefault();
                    // mock form submit
                    const event = new Event("submit", {
                      bubbles: true,
                      cancelable: true,
                    });
                    formRef.current?.dispatchEvent(event);
                  }
                }
              }}
            />
            <button type="submit">
              <LightningBoltIcon />
            </button>
          </form>
        </Bar>
        {showDownload && (
          <SnapWrapper
            onClick={() => {
              onDownload?.();
            }}
          >
            <DownloadIcon />
          </SnapWrapper>
        )}
      </ControllerWrapper>
    </div>
  );
}

const Bar = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  min-height: 60px;
  border-radius: 12px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
  gap: 16px;
  background: #232323;
`;

const ControllerWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;

  .slot {
    display: flex;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    overflow: hidden;
  }

  .slot.scene {
    cursor: pointer;
    height: 36px;
    aspect-ratio: 1 /1;
    color: white;
  }

  form {
    display: flex;
    width: 100%;
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }

  textarea {
    flex: 1;
    width: 100%;
    height: 100%;
    padding: 8px;
    background: none;
    border: none;
    color: white;
    outline: none;
    resize: none;
  }

  button {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    background: none;
    border: none;
    color: white;
  }
`;
