export const presetsMap = {
  "003": [],
  "004": ["/lsd/pro/hero-columns/01.png", "/lsd/pro/hero-columns/05.png"],
  "005": ["/lsd/pro/hero-columns/05.png", "/lsd/pro/hero-columns/06.png"],
  "006": ["/lsd/pro/hero-columns/03.png", "/lsd/pro/hero-columns/06.png"],
} as const;

interface Template {
  key: string;
  name: string;
  thumbnail: string;
  icon: string;
  preview: string;
  presets: string[];
}

const template_003: Template = {
  key: "003",
  name: "Glass 1",
  thumbnail: "/lsd/preview/baked-004.1/lsd.jpeg",
  icon: "",
  preview: "/lsd/preview/baked-004.1/lsd.jpeg",
  presets: ["scene.collections.001"],
};

const template_004: Template = {
  key: "004",
  name: "Glass 2",
  thumbnail: "/lsd/preview/baked-001/0001.png",
  icon: "/lsd/preview/baked-004.1/icon.png",
  preview: "/lsd/preview/baked-001/0001.png",
  presets: ["scene.collections.001"],
};

const template_005: Template = {
  key: "005",
  name: "Iron",
  thumbnail: "/lsd/preview/baked-005/icon.png",
  icon: "/lsd/preview/baked-005/icon.png",
  preview: "/lsd/preview/baked-005/icon.png",
  presets: ["scene.collections.001"],
};

const template_006: Template = {
  key: "006",
  name: "PVC",
  thumbnail: "/lsd/preview/baked-006/icon.png",
  icon: "/lsd/preview/baked-006/icon.png",
  preview: "/lsd/preview/baked-006/icon.png",
  presets: ["scene.collections.001"],
};

export const defaultTemplateKey = "004";

export const templatesMap = {
  "003": template_003,
  "004": template_004,
  "005": template_005,
  "006": template_006,
} as const;

export const templates = Object.values(templatesMap);
