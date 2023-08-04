import { useCallback, useMemo } from "react";
import { useEditorState } from "./use-editor-state";

export function useEditor() {
  const [state, dispatch] = useEditorState();

  const { templateId, templateData, templatePreset, templatePresets } = state;

  const switchTemplate = useCallback(
    (template: string) =>
      dispatch({ type: "switch-template", templateId: template }),
    [dispatch]
  );

  return useMemo(
    () => ({
      templateId,
      templateData,
      templatePreset,
      templatePresets,
      switchTemplate,
    }),
    [switchTemplate, templateId, templateData, templatePreset, templatePresets]
  );
}
