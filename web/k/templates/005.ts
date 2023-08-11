export default function data({
  text,
  font,
  ...data
}: {
  text: string;
  "color.0": string;
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

  const light_objects = [
    // "light.0", - base light - do not change
    "light.1",
    "light.2",
  ];

  const colors = [data["color.0"]];

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
