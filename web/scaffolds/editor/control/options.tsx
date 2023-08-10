import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import * as Tabs from "@radix-ui/react-tabs";
import {
  CameraIcon,
  ColorWheelIcon,
  FontStyleIcon,
} from "@radix-ui/react-icons";
import { useEditor } from "@/core/states/use-editor";

const colors = [
  "#FFFFFFFF",
  "#feea00",
  "#F84AA7",
  "#FADF63",
  "#531CB3",
  "#B5D6D6",
];

const fonts = [
  {
    id: "Inter-400",
    fontFamily: "Inter",
    fontWeight: 400,
  },
  {
    id: "Cherry Bomb One",
    fontFamily: "Cherry Bomb One",
    fontWeight: 400,
  },
  {
    id: "Pacifico",
    fontFamily: "Pacifico",
    fontWeight: 400,
  },
  {
    id: "Bowlby One",
    fontFamily: "Bowlby One",
    fontWeight: 400,
  },
  {
    id: "Fugaz One",
    fontFamily: "Fugaz One",
    fontWeight: 400,
  },
] as const;

export function Options() {
  const { template, data, setUserData } = useEditor();

  const color = data["color.0"];
  const font = data["font"];

  const setColor = useCallback(
    (c: string) =>
      setUserData({
        ...data,
        "color.0": c,
      }),
    [data, setUserData]
  );

  const setFont = useCallback(
    (id: string, family: string, weight: number | string) =>
      setUserData({
        ...data,
        ["font"]: {
          id: id,
          "font-family": family,
          "font-weight": weight,
        },
      }),
    [data, setUserData]
  );

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
        {colors.map((c, i) => (
          <OptionsColorChip
            key={c}
            color={c}
            selected={color === c}
            onClick={() => {
              setColor(c);
            }}
          />
        ))}
      </Tabs.Content>
      <Tabs.Content className="content" value="font">
        {fonts.map((d, i) => (
          <OptionsFontChip
            key={i}
            fontFamily={d.fontFamily}
            fontWeight={d.fontWeight}
            selected={font?.id === d.id}
            onClick={() => {
              setFont(d.id, d.fontFamily, d.fontWeight);
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
  children,
  ...props
}: React.PropsWithChildren<{
  fontFamily: React.CSSProperties["fontFamily"];
  fontWeight: React.CSSProperties["fontWeight"];
  selected?: boolean;
}> &
  React.HTMLAttributes<HTMLButtonElement>) {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    // Load the font dynamically using the Google Fonts API
    const link = document.createElement("link");
    const href = `https://fonts.googleapis.com/css2?family=${fontFamily!.replace(
      " ",
      "+"
    )}:wght@400&display=swap`;
    console.log(href);
    link.href = href;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    link.onload = () => {
      setFontLoaded(true);
    };

    return () => {
      document.head.removeChild(link);
    };
  }, [fontFamily]);

  return (
    <OptionsFontChipContainer
      data-selected={selected}
      {...props}
      title={fontFamily}
    >
      <span
        style={{
          fontFamily,
          fontWeight,
        }}
      >
        {children ?? <>Ag</>}
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
