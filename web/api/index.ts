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

export interface DMTResponse {
  still: string;
  still_2x: string;
}

export class Client {
  constructor() {}

  async renderStill(id: string, request: DMTRequest) {
    const { data } = await axios.post<DMTResponse>(
      `/templates/${id}/render-still`,
      request
    );
    return data;
  }
}
