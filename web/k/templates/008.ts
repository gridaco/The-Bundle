export default function data({
  text,
  font,
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

  return text_objects_data;
}
