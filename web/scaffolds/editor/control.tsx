import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import {
  LightningBoltIcon,
  DownloadIcon,
  CameraIcon,
  TransparencyGridIcon,
  ColorWheelIcon,
  FontStyleIcon,
} from "@radix-ui/react-icons";
import * as Tabs from "@radix-ui/react-tabs";
import { BakedImageSequence3DView } from "components/interactive-3d-object-baked-sequence-view";
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
            onSubmit={(e) => {
              setExpanded(false);
              e.preventDefault();
              // onSubmit?.(e, {
              //   preset,
              // });
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

function Options() {
  const { template } = useEditor();
  const [color, setColor] = useState<string>();
  const [font, setFont] = useState<string>();

  return (
    <OptionsWrapper className="TabsRoot" defaultValue="preset">
      <Tabs.List className="list" aria-label="Manage your account">
        {/* <Tabs.Trigger className="trigger" value="preset">
          <TransparencyGridIcon />
          Preset
        </Tabs.Trigger> */}
        <Tabs.Trigger className="trigger" value="color">
          <ColorWheelIcon />
          Color
        </Tabs.Trigger>
        <Tabs.Trigger className="trigger" value="font">
          <FontStyleIcon />
          Font
        </Tabs.Trigger>
        <Tabs.Trigger className="trigger" value="camera">
          <CameraIcon />
          Camera
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content className="content" value="preset">
        {template.presets.map((it, i) => (
          <ItemContainer
            key={i}
            // data-selected={preset === it.key}
            // onClick={() => {
            //   setPreset(it.key);
            // }}
          >
            <img
              src={
                ""
                // it.thumbnail
              }
              width="100%"
              height="100%"
            />
          </ItemContainer>
        ))}
      </Tabs.Content>
      <Tabs.Content className="content" value="color">
        {["#FFFFFFFF", "#feea00", "#f7f4ea", "#FADF63", "#531CB3"].map(
          (c, i) => (
            <OptionsColorChip
              key={c}
              color={c}
              selected={color === c}
              onClick={() => {
                setColor(c);
              }}
            />
          )
        )}
      </Tabs.Content>
      <Tabs.Content className="content" value="font">
        {[
          {
            id: "arial-400",
            fontFamily: "Arial",
            fontWeight: 400,
          },
          {
            id: "arial-700",
            fontFamily: "Arial",
            fontWeight: 700,
          },
          {
            id: "helvetica-400",
            fontFamily: "Helvetica",
            fontWeight: 700,
          },
        ].map((d, i) => (
          <OptionsFontChip
            key={i}
            fontFamily={d.fontFamily}
            fontWeight={d.fontWeight}
            selected={font === d.id}
            onClick={() => {
              setFont(d.id);
            }}
          />
        ))}
      </Tabs.Content>
      <Tabs.Content className="content" value="camera">
        <div>angle</div>
        {/* <CameraComposition /> */}
      </Tabs.Content>
    </OptionsWrapper>
  );
}

const OptionsWrapper = styled(Tabs.Root)`
  .list {
    display: flex;
    flex-direction: row;
    gap: 8px;
    margin-bottom: 16px;
  }

  .trigger {
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    gap: 8px;
    background: transparent;
    color: white;
    opacity: 0.7;
    &[data-state="active"] {
      opacity: 1;
      background: rgba(255, 255, 255, 0.1);
    }
    outline: none;
    border: none;
  }

  .content {
    display: flex;
    flex-direction: row;
    gap: 16px;
  }
`;

function OptionsColorChip({
  color,
  selected,
  ...props
}: {
  color: React.CSSProperties["color"];
  selected: boolean;
} & React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <OptionsColorChipContainer
      {...props}
      data-selected={selected}
      style={{
        background: color,
      }}
    />
  );
}

const OptionsColorChipContainer = styled.button`
  --border-radius: 12px;
  position: relative;
  cursor: pointer;
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius);
  outline: none;
  border: none;

  &[data-selected="true"] {
    /* border */
    ::after {
      content: "";
      position: absolute;
      border-radius: calc(var(--border-radius) + 4px);
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border: white 2px solid;
    }
  }
`;

function OptionsFontChip({
  fontFamily,
  fontWeight,
  selected,
  ...props
}: {
  fontFamily: React.CSSProperties["fontFamily"];
  fontWeight: React.CSSProperties["fontWeight"];
  selected?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <OptionsFontChipContainer data-selected={selected} {...props}>
      <span
        style={{
          fontFamily,
          fontWeight,
        }}
      >
        Ag
      </span>
    </OptionsFontChipContainer>
  );
}

const OptionsFontChipContainer = styled.button`
  --border-radius: 12px;
  position: relative;
  cursor: pointer;
  width: 60px;
  height: 60px;
  border-radius: var(--border-radius);
  outline: none;
  border: none;

  &[data-selected="true"] {
    /* border */
    ::after {
      content: "";
      position: absolute;
      border-radius: calc(var(--border-radius) + 4px);
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border: white 2px solid;
    }
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    text-align: center;
    user-select: none;
    font-size: 40px;
  }
`;

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
