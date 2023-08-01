import { createContext } from "react";
import { EditorState } from "./editor-state";

export const StateContext = createContext<EditorState | undefined>(undefined);
