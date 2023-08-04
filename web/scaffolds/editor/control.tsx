import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import {
  LightningBoltIcon,
  DownloadIcon,
  CameraIcon,
  TransparencyGridIcon,
} from "@radix-ui/react-icons";
import * as Tabs from "@radix-ui/react-tabs";
import { BakedImageSequence3DView } from "components/interactive-3d-object-baked-sequence-view";
import { templates } from "@/k/templates";
import { useEditor } from "@/core/states/use-editor";

const SnapWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
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
    options: {
      preset?: string;
    }
  ) => void;
}) {
  const {
    //
  } = useEditor();

  const [expanded, setExpanded] = useState(false);
  const [preset, setPreset] = useState<string>();

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
          <Tabs.Root className="TabsRoot" defaultValue="preset">
            <Tabs.List className="TabsList" aria-label="Manage your account">
              <Tabs.Trigger className="TabsTrigger" value="preset">
                Preset <TransparencyGridIcon />
              </Tabs.Trigger>
              <Tabs.Trigger className="TabsTrigger" value="camera">
                Camera <CameraIcon />
              </Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content className="TabsContent" value="preset">
              <div
                style={{
                  display: "flex",
                  gap: 12,
                }}
              >
                {templates.map((it, i) => (
                  <ItemContainer
                    key={i}
                    data-selected={preset === it.key}
                    onClick={() => {
                      setPreset(it.key);
                    }}
                  >
                    <img src={it.thumbnail} width="100%" height="100%" />
                  </ItemContainer>
                ))}
              </div>
            </Tabs.Content>
            <Tabs.Content className="TabsContent" value="camera">
              <CameraComposition />
            </Tabs.Content>
          </Tabs.Root>
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
            onSubmit={(e) => {
              setExpanded(false);
              e.preventDefault();
              onSubmit?.(e, {
                preset,
              });
            }}
          >
            <input
              id="body"
              type="text"
              placeholder="Type text to render"
              maxLength={7}
              autoFocus
              autoComplete="off"
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

const ItemContainer = styled.div`
  user-select: none;
  display: flex;
  color: black;
  align-items: center;
  justify-content: center;

  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background: black;

  &[data-selected="true"] {
    border: 2px solid white;
  }
`;

const Bar = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 60px;
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
    height: 100%;
    aspect-ratio: 1 /1;
    color: white;
  }

  form {
    display: flex;
    width: 100%;
    flex-direction: row;
    gap: 16px;
  }

  input {
    flex: 1;
    width: 100%;
    padding: 8px;
    background: none;
    border: none;
    color: white;
    outline: none;
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
