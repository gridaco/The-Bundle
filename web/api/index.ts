import Axios from "axios";

const axios = Axios.create({
  baseURL: "https://lsd.ngrok.dev/",
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

export class Client {
  constructor() {}

  async renderStill(id: string, request: DMTRequest) {
    const { data } = await axios.post(`/templates/${id}/render-still`, request);
    return data;
  }
}