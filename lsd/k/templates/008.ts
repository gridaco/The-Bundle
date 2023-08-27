import fonts from "./fonts";

export const options = {
  colors: [
    ["#E2FFEE", "#E84BFF", "#FFFFFF"],
    ["#E2FFEE", "#49FF31", "#FFFFFF"],
    ["#E2FFEE", "#FF6800", "#FFFFFF"],
    ["#E2FFEE", "#5400FF", "#FFFFFF"],
    ["#E2FFEE", "#31FFEF", "#FFFFFF"],
  ],
  fonts: [
    fonts["Racing Sans One"],
    fonts["Cherry Bomb One"],
    fonts["Press Start 2P"],
    fonts["Russo One"],
    fonts["Anton"],
  ],
  text: {
    min: 3,
    max: 8,
  },
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
  const text_objects = ["border", "text"];

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

  return { ...text_objects_data, ...light_objects_data };
}
