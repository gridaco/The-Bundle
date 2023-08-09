import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import * as Tabs from "@radix-ui/react-tabs";
import {
  CameraIcon,
  ColorWheelIcon,
  FontStyleIcon,
} from "@radix-ui/react-icons";
import { useEditor } from "@/core/states/use-editor";

export function Options() {
  const { template } = useEditor();
  const [color, setColor] = useState<string>();
  const [font, setFont] = useState<string>();

  return (
    <OptionsWrapper className="TabsRoot" defaultValue="color">
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
          <PresetContainer
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
          </PresetContainer>
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

const PresetContainer = styled.div`
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
