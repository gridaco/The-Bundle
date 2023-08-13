import fonts from "./fonts";

export const options = {
  colors: [
    ["#FFFFFF", "#747CFF", "#6EC6FF"],
    ["#FFFFFF", "#85FFC5", "#FF9661"],
    ["#FFFFFF", "#D37CFF", "#8EAEE0"],
    ["#FFF19F", "#FFD869", "#E0A320"],
    ["#FFFFFF", "#FFFFFF", "#3B3B3B"],
  ],
  fonts: [fonts["Lugrasimo"]],
} as const;

export default function data({
  text,
  font,
  colors,
}: {
  text: string;
  colors?: string[];
  font?: {
    "font-family": string;
    "font-weight": string;
  };
}) {
  const text_objects = ["text"];

  const text_objects_data = text_objects.reduce(
    (p, c) => ({
      [c]: {
        data: {
          body: text,
          font: font,
        },
      },
      ...p,
    }),
    {}
  );

  const light_objects = ["light.0", "light.1", "light.2"];

  const light_objects_data = colors
    ? light_objects.reduce((d, c, i) => {
        const color = colors[i];

        if (!color) return d;

        const light = {
          data: {
            color: colors[i],
          },
        };

        return {
          [c]: light,
          ...d,
        };
      }, {})
    : {};

  return {
    ...text_objects_data,
    ...light_objects_data,
  };
}
