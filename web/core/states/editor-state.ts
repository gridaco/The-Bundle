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
}
