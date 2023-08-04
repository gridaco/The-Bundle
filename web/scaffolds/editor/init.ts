import { DEFAULT_PRESET, EditorState } from "@/core/states";
import * as templates from "k/templates";

export function initstate(): EditorState {
  const template = templates.templatesMap[templates.defaultTemplateKey];
  return {
    template: {
      preset: DEFAULT_PRESET,
      ...template,
    },
    user: {
      plan: "anon",
      ratelimit: {
        limit: 0,
        remaining: 0,
        reset: 999,
      },
    },
    data: {},
    mode: "still",
    result: {
      id: "initial",
      samples: 256,
      src: template.preview,
      srcset: {},
      template: templates.defaultTemplateKey,
    },
    camera: {
      phi: 0,
      theta: 0,
      psi: 0,
      r: 100,
    },
    scene: {},
    canvas: {
      type: "still",
    },
    renderer: {
      idle: false,
      image_settings: {
        file_format: "PNG",
        quality: 90,
      },
    },
    message: null,
  };
}
