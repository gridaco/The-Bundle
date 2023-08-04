type Plan = "anon" | "free" | "pro" | "team";

export interface EditorState {
  templateId: string;
  templatePreset: string;
  templatePresets: string[];
  templateData: any;
  plan: Plan;
  ratelimit: {
    limit: number;
    remaining: number;
    reset: number;
  };
  // redner state
  renderMode: "still" | "animation";
  result: RenderResult;
  //
  isRendering: boolean;
  message?: string;
}

interface RenderResult {
  id: string;
  samples: number;
  template: string;
  src: string;
  srcset: {
    [key: string]: string;
  };
}
