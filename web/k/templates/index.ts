import _005, { options as _005_options } from "./005";
import _006, { options as _006_options } from "./006";
import _008, { options as _008_options } from "./008";

export const previews = {
  // "003": [],
  "004": [
    "/lsd/preview/baked-004/motion-preview-0001.gif",
    "/lsd/preview/baked-004/thumbnail.jpeg",
    "/lsd/pro/hero-columns/05.png",
  ],
  "005": [
    "/lsd/preview/baked-005/showcase-0001.png",
    "/lsd/preview/baked-005/showcase-0002.png",
  ],
  "006": [
    "/lsd/preview/baked-006/showcase-0001.png",
    "/lsd/preview/baked-006/showcase-0002.png",
  ],
  "007": [
    "/lsd/preview/baked-007/showcase-0001.png",
    "/lsd/preview/baked-007/showcase-0002.png",
  ],
  "008": [
    "/lsd/preview/baked-008/showcase-0001.png",
    "/lsd/preview/baked-008/showcase-0002.png",
  ],
  "009": [
    "/lsd/preview/baked-009/showcase-0001.png",
    "/lsd/preview/baked-009/showcase-0002.png",
    "/lsd/preview/baked-009/showcase-0003.png",
    "/lsd/preview/baked-009/showcase-0004.png",
  ],
} as const;

export interface Template {
  key: string;
  name: string;
  thumbnail: string;
  icon: string;
  preview: string;
  presets: string[];
  custom_data_transformer?: (...d: any) => any;
  plan: "free" | "pro";
  visibility: "visible" | "comming_soon";
  options: {
    colors: ReadonlyArray<ReadonlyArray<string>>;
    fonts: ReadonlyArray<{
      "font-family": string;
      "font-weight": number;
    }>;
  };
}

// const template_003: Template = {
//   key: "003",
//   name: "Glass 1",
//   thumbnail: "/lsd/preview/baked-004/lsd.jpeg",
//   icon: "",
//   preview: "/lsd/preview/baked-004/lsd.jpeg",
//   presets: ["scene.collections.001"],
// };

const template_004: Template = {
  key: "004",
  name: "Glass",
  thumbnail: "/lsd/preview/baked-001/0001.png",
  icon: "/lsd/preview/baked-004/icon.png",
  preview: "/lsd/preview/baked-004/thumbnail.jpeg",
  presets: ["scene.collections.001"],
  plan: "pro",
  visibility: "visible",
  options: {
    colors: [],
    fonts: [],
  },
};

const template_005: Template = {
  key: "005",
  name: "Iron",
  thumbnail: "/lsd/preview/baked-005/showcase-0001.png",
  icon: "/lsd/preview/baked-005/icon.png",
  preview: "/lsd/preview/baked-005/thumbnail.png",
  presets: ["scene.collections.001"],
  plan: "pro",
  visibility: "visible",
  custom_data_transformer: _005,
  options: _005_options,
};

const template_006: Template = {
  key: "006",
  name: "Plastic",
  thumbnail: "/lsd/preview/baked-006/showcase-0001.png",
  icon: "/lsd/preview/baked-006/icon.png",
  preview: "/lsd/preview/baked-006/thumbnail.png",
  presets: ["scene.collections.001"],
  plan: "pro",
  visibility: "visible",
  custom_data_transformer: _006,
  options: _006_options,
};

const template_007: Template = {
  key: "007",
  name: "Fluffy",
  thumbnail: "/lsd/preview/baked-007/icon.png",
  icon: "/lsd/preview/baked-007/icon.png",
  preview: "/lsd/preview/baked-007/thumbnail.png",
  presets: ["scene.collections.001"],
  plan: "pro",
  visibility: "comming_soon",
  options: {
    colors: [],
    fonts: [],
  },
};

const template_008: Template = {
  key: "008",
  name: "Y2K",
  thumbnail: "/lsd/preview/baked-008/icon.png",
  icon: "/lsd/preview/baked-008/icon.png",
  preview: "/lsd/preview/baked-008/thumbnail.png",
  presets: ["scene.collections.001"],
  custom_data_transformer: _008,
  plan: "pro",
  visibility: "visible",
  options: _008_options,
};

const template_009: Template = {
  key: "009",
  name: "Balloon",
  thumbnail: "/lsd/preview/baked-009/icon.png",
  icon: "/lsd/preview/baked-009/icon.png",
  preview: "/lsd/preview/baked-009/thumbnail.png",
  presets: ["scene.collections.001"],
  plan: "pro",
  visibility: "comming_soon",
  options: {
    colors: [],
    fonts: [],
  },
};

export const defaultTemplateKey = "004";

export const templatesMap = {
  // "003": template_003,
  "004": template_004,
  "005": template_005,
  "006": template_006,
  "007": template_007,
  "008": template_008,
  "009": template_009,
} as const;

export const templates = Object.values(templatesMap);
