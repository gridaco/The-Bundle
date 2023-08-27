import { DEFAULT_PRESET, EditorState } from "@/core/states";
import { produce } from "immer";
import {
  EditorAction,
  SetRenderResultAction,
  SetUserTemplateDataAction,
  SwitchTemplateAction,
} from "core/actions";
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
        // clear the render resilt regarless to if selected the same template
        draft.result = null;

        if (key === draft.template.key) {
          return;
        }

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
          custom_data_transformer: template.custom_data_transformer,
          config: template.config,
        };

        // clear the user data on template switch
        draft.data = {};
        draft.result = null;
      });
    }
    case "set-render-result": {
      const { src, srcset } = action as SetRenderResultAction;
      return produce(state, (draft) => {
        draft.result = {
          id: Date.now().toString(),
          src,
          srcset: srcset,
          template: draft.template.key,
          // TODO:
          samples: 256,
        };
      });
    }
    case "set-user-template-data": {
      const { data } = action as SetUserTemplateDataAction;
      return produce(state, (draft) => {
        draft.data = data;
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
