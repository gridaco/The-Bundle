import { useMemo, useContext } from "react";
import { useDispatch, FlatDispatcher } from "../dispatch";
import { EditorState } from "./editor-state";
import { StateContext } from "./editor-context";

const useEditorContext = (): EditorState => {
  const value = useContext(StateContext);

  if (!value) {
    throw new Error(`No StateProvider: this is a logical error.`);
  }

  return value;
};

export const useEditorState = (): [EditorState, FlatDispatcher] => {
  const state = useEditorContext();
  const dispatch = useDispatch();
  return useMemo(() => [state, dispatch], [state, dispatch]);
};
