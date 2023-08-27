import fonts from "./fonts";

export const options = {
  colors: [
    ["#DF7000"],
    ["#00DF3C"],
    ["#1957DF"],
    ["#DF0800"],
    ["#000000"],
    //
  ],
  fonts: [
    fonts["Racing Sans One"],
    fonts["Cherry Bomb One"],
    fonts["Press Start 2P"],
    fonts["Russo One"],
    fonts["Anton"],
  ],
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

  const material_slots = colors?.[0]
    ? {
        ["0"]: {
          node_tree: {
            nodes: {
              ["data"]: {
                node_tree: {
                  nodes: {
                    ["color.0"]: colors[0],
                  },
                },
              },
            },
          },
        },
      }
    : undefined;

  const text_objects_data = text_objects.reduce(
    (p, c) => ({
      [c]: {
        data: {
          body: text,
          font: font,
        },
        material_slots,
      },
      ...p,
    }),
    {}
  );

  return text_objects_data;
}
