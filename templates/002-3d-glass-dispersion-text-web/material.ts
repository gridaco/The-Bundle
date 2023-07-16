import { Scene, ShaderMaterial } from "@babylonjs/core";

export function createShaderMaterial(scene: Scene) {
  const shaderMaterial = new ShaderMaterial(
    "glass",
    scene,
    {
      vertexSource: `
    precision highp float;

    // Attributes
    attribute vec3 position;
    attribute vec3 normal;
    attribute vec2 uv;

    // Uniforms
    uniform mat4 worldViewProjection;

    // Varying
    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUV;

    void main(void) {
        vec4 outPosition = worldViewProjection * vec4(position, 1.0);
        gl_Position = outPosition;
        vPosition = position;
        vNormal = normal;
        vUV = uv;
    }`,
      fragmentSource: `
    precision highp float;

    varying vec3 vPosition;
    varying vec3 vNormal;
    varying vec2 vUV;

    uniform vec3 cameraPosition;

    void main(void) {
        vec3 viewDirection = normalize(vPosition - cameraPosition);
        vec3 refractedDirection = refract(viewDirection, vNormal, 1.0 / 1.33); // Change 1.33 to the index of refraction you want
        vec4 color = vec4(1.0, 1.0, 1.0, 1.0);  // This is a solid white color
        gl_FragColor = color;
    }`,
    },
    {
      attributes: ["position", "normal", "uv"],
      uniforms: [
        "world",
        "worldView",
        "worldViewProjection",
        "view",
        "projection",
        "cameraPosition",
      ],
    }
  );

  return shaderMaterial;
}
