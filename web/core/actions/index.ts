export type Action = EditorAction;
export type EditorAction = SwitchTemplateAction | SetRenderResultAction;

export type SwitchTemplateAction = {
  type: "switch-template";
  key: string;
};

export type SetRenderResultAction = {
  type: "set-render-result";
  src: string;
};
