export type Action = EditorAction;
export type EditorAction =
  | SwitchTemplateAction
  | SetRenderResultAction
  | SetUserTemplateDataAction;

export type SwitchTemplateAction = {
  type: "switch-template";
  key: string;
};

export type SetRenderResultAction = {
  type: "set-render-result";
  src: string;
};

export type SetUserTemplateDataAction<T = any> = {
  type: "set-user-template-data";
  data: T;
};
