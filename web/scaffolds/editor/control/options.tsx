import React, { useCallback } from "react";
import styled from "@emotion/styled";
import * as Tabs from "@radix-ui/react-tabs";
import {
  CameraIcon,
  ColorWheelIcon,
  FontStyleIcon,
} from "@radix-ui/react-icons";
import { useEditor } from "@/core/states/use-editor";
import {
  OptionsColorChip,
  OptionsColorThemeChip,
  OptionsFontChip,
} from "./chips";
import { Template, templates, templatesMap } from "@/k/templates";

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

  const colorsData = data["colors"];
  const font = data["font"];

  const setColorsData = useCallback(
    (colors: ReadonlyArray<string>) => {
      setUserData({
        ...data,
        colors,
        // "color.0": c,
      });
    },
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

  const options = (templatesMap[template.key] as Template).options;

  return (
    <OptionsWrapper defaultValue="color">
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
        {options.colors.map((colors, i) => {
          const key = colors.join(".");
          if (colors.length === 0) {
            return <></>;
          } else if (colors.length === 1) {
            return (
              <OptionsColorChip
                key={key}
                color={colors[0]}
                selected={colorsData?.join(".") === key}
                onClick={() => {
                  setColorsData(colors);
                }}
              />
            );
          }
          return (
            <OptionsColorThemeChip
              key={key}
              colors={colors}
              selected={colorsData?.join(".") === key}
              onClick={() => {
                setColorsData(colors);
              }}
            />
          );
        })}
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
  display: flex;
  flex-direction: column;
  width: 100%;

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
    flex-wrap: wrap;
    gap: 16px;
    height: auto;
    width: 100%;
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
