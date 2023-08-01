import { EditorState } from "@/core/states";
import { produce } from "immer";
import { EditorAction, SwitchTemplateAction } from "core/actions";

export function reducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case "switch-template": {
      const { templateId } = action as SwitchTemplateAction;
      return produce(state, (draft) => {
        draft.templateId = templateId;
      });
    }
    default: {
      throw new Error(`Unhandled action type: ${(action as any).type}`);
    }
  }
}
