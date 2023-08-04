import type { ImageType } from "../types";

type Plan = "anon" | "free" | "pro" | "team";

export const DEFAULT_PRESET = Symbol("default-preset");

export interface EditorState {
  template: {
    /**
     * template id (key)
     */
    key: string;
    /**
     * user friendly, marketable template name
     */
    name: string;
    /**
     * current preset
     */
    preset: string | typeof DEFAULT_PRESET;
    /**
     * icon src
     */
    icon: string;
    /**
     * preview src to this <template-preset>
     */
    preview: string;
    /**
     * list of available presets to this template
     */
    presets: string[];
  };
  data: UserTemplateData;
  user: {
    plan: Plan;
    ratelimit: {
      limit: number;
      remaining: number;
      reset?: number | null;
    };
  };
  mode: "still" | "animation";
  result: RenderResult;
  camera: CameraSphere;
  scene: {};
  canvas: CanvasState;
  renderer: RendererState;
  message?: string | null;
}

type UserTemplateData = UserTextTemplateData | UserUnknownTemplateData;

type UserUnknownTemplateData<T = unknown> = {} & T;

type UserTextTemplateData = {};

type CanvasState = {
  type: "still";
};

interface RendererState {
  /**
   * Whether the render is currently running
   */
  idle: boolean;
  image_settings: {
    /**
     * File format to save the rendered images as
     * @default "PNG"
     */
    file_format: ImageType;
    /**
     * Quality for image formats that support lossy compression
     * 0 - 100
     * @default 90
     */
    quality: number;
  };
}

interface RenderResult {
  id: string;
  samples: number;
  template: string;
  src: string;
  srcset?: {
    [key: string]: string;
  };
}

// Spherical coordinates
interface CameraSphere {
  /**
   * radius is the distance from the origin
   */
  r: number;

  /**
   * (θ) theta is the angle from the x axis
   */
  theta: number;

  /**
   * (φ) phi is the angle from the y axis
   */
  phi: number;

  /**
   * (ψ) psi is the roll of the camera
   * (rotation around the z axis)
   */
  psi: number;
}
