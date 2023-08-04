import { DEFAULT_PRESET, EditorState } from "@/core/states";
import { produce } from "immer";
import { EditorAction, SwitchTemplateAction } from "core/actions";
import * as templates from "k/templates";
import { Template } from "k/templates";

export function editorReducer(
  state: EditorState,
  action: EditorAction
): EditorState {
  switch (action.type) {
    case "switch-template": {
      const { key } = action as SwitchTemplateAction;
      return produce(state, (draft) => {
        const template = templates.templatesMap[key] as Template;

        if (!template) {
          throw new TemplateNotFoundError(key);
        }

        draft.template = {
          key,
          name: template.name,
          icon: template.icon,
          preset: DEFAULT_PRESET,
          presets: template.presets,
          preview: template.preview,
        };
      });
    }
    default: {
      throw new Error(`Unhandled action type: ${(action as any).type}`);
    }
  }
}

class TemplateNotFoundError extends Error {
  constructor(key: string) {
    super(`Template not found: ${key}`);
  }
}
