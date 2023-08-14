import Axios from "axios";

const USE_LOCAL_SERVER = process.env.USE_LOCAL_SERVER === "true";

const axios = Axios.create({
  // baseURL: "http://localhost:3001/",
  baseURL: USE_LOCAL_SERVER
    ? "http://localhost:3001/"
    : "https://lsd.ngrok.dev/",
});

export interface DMTRequest<T = any> {
  data: T;
  config?: DMTConfig;
}

export interface DMTConfig {
  resolution_x: number;
  resolution_y: number;
  samples: number;
  engine: "CYCLES" | "BLENDER_EEVEE";
}

export interface StillImageRenderUpscaledResult {
  /**
   * Original image w/o background (or with, if requested)
   */
  still: string;
  /**
   * Non-upscaled image w/background (the result may be identical to `still`)
   */
  still_w_background: string;
  /**
   * AI upscaled image w/background
   */
  still_2x: string;

  /**
   * Initial Background color / image / texture info requested by user,
   * the result image still may contain background,
   * but that would be black, a fallback value.
   */
  background?: string;
}

export class Client {
  constructor() {}

  async renderStill(id: string, request: DMTRequest) {
    const { data } = await axios.post<StillImageRenderUpscaledResult>(
      `/templates/${id}/render-still`,
      request
    );
    return data;
  }
}
