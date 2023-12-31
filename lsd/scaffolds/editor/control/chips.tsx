import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { HexColorPicker } from "react-colorful";
import * as Popover from "@radix-ui/react-popover";
import { OpacityIcon } from "@radix-ui/react-icons";
import * as Select from "@radix-ui/react-select";

interface ChipProps {
  selected?: boolean;
}

export function OptionsColorThemeChip({
  colors,
  selected,
  ...props
}: ChipProps & {
  colors: string[] | ReadonlyArray<string>;
} & React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <OptionsColorChipContainer
      {...props}
      data-selected={selected}
      style={{
        background: "transparent",
        aspectRatio: "auto",
        padding: 8,
      }}
    >
      {colors.map((color, i) => (
        <div
          key={i}
          style={{
            width: 36,
            height: 36,
            background: color,
            borderRadius: "50%",
          }}
        />
      ))}
    </OptionsColorChipContainer>
  );
}

export function OptionsColorChip({
  color,
  selected,
  ...props
}: ChipProps & {
  color: React.CSSProperties["color"];
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

export function OptionsColorPickerChip({
  color,
  selected,
  onChange,
  ...props
}: ChipProps & {
  color: React.CSSProperties["color"];
  onChange?: (color: string) => void;
} & React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <OptionsColorChipContainer
          {...props}
          data-selected={selected}
          style={{
            background: color,
          }}
        >
          <OpacityIcon color={invertColor(color)} />
        </OptionsColorChipContainer>
      </Popover.Trigger>
      <Popover.Content align="center" sideOffset={16}>
        <div
          style={{
            background: "black",
            border: "rgba(255, 255, 255, 0.2) 1px solid",
            borderRadius: 12,
            padding: 8,
          }}
        >
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}

const OptionsColorChipContainer = styled.button`
  --border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  position: relative;
  cursor: pointer;
  gap: 8px;
  height: 60px;
  aspect-ratio: 1 / 1;
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

export function OptionsFontChip({
  fontFamily,
  fontWeight,
  selected,
  children,
  ...props
}: React.PropsWithChildren<
  ChipProps & {
    fontFamily: React.CSSProperties["fontFamily"];
    fontWeight: React.CSSProperties["fontWeight"];
  }
> &
  React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <OptionsFontChipContainer
      data-selected={selected}
      {...props}
      title={fontFamily}
    >
      <FontView fontFamily={fontFamily} fontWeight={fontWeight}>
        {children}
      </FontView>
    </OptionsFontChipContainer>
  );
}

const listGoogleFonts = async () => {
  const res = await fetch("/lsd/fonts/data/fonts.google.com/list.json");
  const data = await res.json();
  return data;
};

export function OptionsFontSelectChip({
  fontFamily,
  fontWeight,
  onChange,
  selected,
}: ChipProps & {
  onChange?: (fontFamily: React.CSSProperties["fontFamily"]) => void;
  fontFamily?: React.CSSProperties["fontFamily"];
  fontWeight?: React.CSSProperties["fontWeight"];
}) {
  const [fonts, setFonts] = useState<ReadonlyArray<string> | null>(null);

  useEffect(() => {
    listGoogleFonts().then((data) => {
      setFonts(data);
    });
  }, []);

  console.log(fontFamily);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <OptionsFontChipContainer data-selected={selected} title={fontFamily}>
          <div>
            {fontFamily ? (
              <FontView fontFamily={fontFamily} fontWeight={fontWeight} />
            ) : (
              "More"
            )}
          </div>
        </OptionsFontChipContainer>
      </Popover.Trigger>
      <Popover.Content align="center" sideOffset={16}>
        <FontsList>
          {fonts?.map((d, i) => (
            <Popover.Close
              className="item"
              key={d}
              onClick={() => {
                onChange?.(d);
              }}
            >
              <FontView fontFamily={d}>{d}</FontView>
            </Popover.Close>
          ))}
        </FontsList>
      </Popover.Content>
    </Popover.Root>
  );
}

const FontsList = styled.ul`
  display: flex;
  flex-direction: column;
  max-height: 200px;
  padding: 8px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 200px;
  user-select: none;
  border-radius: 12px;
  border: rgba(255, 255, 255, 0.2) 1px solid;
  background: black;

  .item {
    background: none;
    border: none;
    color: white;
    text-align: left;
    cursor: pointer;
    /* disable dot */
    list-style: none;
    font-size: 21px;
    border-radius: 4px;
    padding: 4px;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

function FontView({
  fontFamily,
  fontWeight,
  children,
}: React.PropsWithChildren<{
  fontFamily: React.CSSProperties["fontFamily"];
  fontWeight?: React.CSSProperties["fontWeight"];
}>) {
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
    <span
      style={{
        fontFamily,
        fontWeight,
      }}
    >
      {children ?? <>Ag</>}
    </span>
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

function invertColor(hex) {
  if (hex.indexOf("#") === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error("Invalid HEX color.");
  }
  // invert color components
  var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
    g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
    b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
  // pad each with zeros and return
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len?) {
  len = len || 2;
  var zeros = new Array(len).join("0");
  return (zeros + str).slice(-len);
}
