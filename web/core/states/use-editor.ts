import { useCallback, useMemo } from "react";
import { useEditorState } from "./use-editor-state";

export function useEditor() {
  const [state, dispatch] = useEditorState();

  const { template, result } = state;

  const switchTemplate = useCallback(
    (template: string) => dispatch({ type: "switch-template", key: template }),
    [dispatch]
  );

  return useMemo(
    () => ({
      template,
      result,
      switchTemplate,
    }),
    [switchTemplate, template, result]
  );
}
