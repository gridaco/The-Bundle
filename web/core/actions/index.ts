export type Action = EditorAction;
export type EditorAction = SwitchTemplateAction;

export type SwitchTemplateAction = {
  type: "switch-template";
  key: string;
};
