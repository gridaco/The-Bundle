import React, { useCallback, useReducer } from "react";
import { EditorState, StateProvider } from "core/states";
import { EditorAction } from "@/core/actions";
import { editorReducer } from "@/core/reducers";
import { useEditor } from "@/core/states/use-editor";

export function Editor() {
  const handleDispatch = useCallback((action: EditorAction) => {
    initialDispatcher(action);
  }, []);

  const [state, initialDispatcher] = useReducer(editorReducer, instate());

  return (
    <StateProvider state={state} dispatch={handleDispatch}>
      <div>
        <Test />
      </div>
    </StateProvider>
  );
}

function Test() {
  const { switchTemplate, templateId } = useEditor();

  return (
    <div>
      <button onClick={() => switchTemplate("001")}>001</button>
      <button onClick={() => switchTemplate("002")}>002</button>
      <p>{templateId}</p>
    </div>
  );
}

function instate(): EditorState {
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
