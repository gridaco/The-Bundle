import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";

interface ChipProps {
  selected?: boolean;
}

export function OptionsColorThemeChip({ colors }: { colors: string[] }) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
        padding: 8,
      }}
    >
      {colors.map((color, i) => (
        <div
          key={i}
          style={{
            width: 60,
            height: 60,
            background: color,
            borderRadius: 12,
          }}
        />
      ))}
    </div>
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
