import { useCallback, useMemo } from "react";
import { useEditorState } from "./use-editor-state";

export function useEditor() {
  const [state, dispatch] = useEditorState();

  const { template, result, data } = state;

  const switchTemplate = useCallback(
    (template: string) => dispatch({ type: "switch-template", key: template }),
    [dispatch]
  );

  const setUserData = useCallback(
    (data: any) => dispatch({ type: "set-user-template-data", data }),
    [dispatch]
  );

  return useMemo(
    () => ({
      template,
      result,
      data,
      switchTemplate,
      setUserData,
    }),
    [switchTemplate, setUserData, template, result, data]
  );
}
