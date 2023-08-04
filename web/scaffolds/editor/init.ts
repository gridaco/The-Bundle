import { EditorState } from "@/core/states";

export function initstate(): EditorState {
  return {
    plan: "anon",
    ratelimit: {
      limit: 0,
      remaining: 0,
      reset: 999,
    },
    templateData: {},
    templateId: "004",
    templatePreset: "main",
    templatePresets: [],
  };
}
