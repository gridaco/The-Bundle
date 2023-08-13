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
import { Template, templatesMap } from "@/k/templates";

export function Options({ options }: { options: Template["options"] }) {
  const { template, data, setUserData } = useEditor();

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
    (d: { "font-family": string; "font-weight": number }) =>
      setUserData({
        ...data,
        ["font"]: d,
      }),
    [data, setUserData]
  );

  return (
    <OptionsWrapper defaultValue="color">
      <Tabs.List className="list" aria-label="Manage your account">
        {/* <Tabs.Trigger className="trigger" value="preset">
          <TransparencyGridIcon />
          Preset
        </Tabs.Trigger> */}
        {options.colors.length > 1 && (
          <Tabs.Trigger className="trigger" value="color">
            <ColorWheelIcon />
            Color
          </Tabs.Trigger>
        )}
        {options.fonts.length > 1 && (
          <Tabs.Trigger className="trigger" value="font">
            <FontStyleIcon />
            Font
          </Tabs.Trigger>
        )}
        {/* <Tabs.Trigger className="trigger" value="camera">
          <CameraIcon />
          Camera
        </Tabs.Trigger> */}
      </Tabs.List>
      {/* <Tabs.Content className="content" value="preset">
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
      </Tabs.Content> */}
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
                selected={data["colors"]?.join(".") === key}
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
              selected={data["colors"]?.join(".") === key}
              onClick={() => {
                setColorsData(colors);
              }}
            />
          );
        })}
      </Tabs.Content>
      <Tabs.Content className="content" value="font">
        {options.fonts.map((d, i) => (
          <OptionsFontChip
            key={i}
            fontFamily={d["font-family"]}
            fontWeight={d["font-weight"]}
            selected={data["font"]?.["font-family"] === d["font-family"]}
            onClick={() => {
              setFont(d);
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
