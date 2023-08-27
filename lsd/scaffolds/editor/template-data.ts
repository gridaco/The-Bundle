export const default_data_transformer = (data) => ({
  ["text"]: {
    data: {
      body: data["text"],
      font: data["font"]
        ? {
            "font-family": data["font"]["font-family"],
            "font-weight": data["font"]["font-weight"],
          }
        : undefined,
    },
    material_slots: data["colors"]?.length
      ? {
          ["0"]: {
            node_tree: {
              nodes: {
                ["data"]: {
                  node_tree: {
                    nodes: {
                      ["color.0"]: data["colors"][0],
                    },
                  },
                },
              },
            },
          },
        }
      : undefined,
  },
});
