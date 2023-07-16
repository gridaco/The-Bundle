import {
  Engine,
  Scene,
  Vector3,
  FreeCamera,
  HemisphericLight,
  MeshBuilder,
  CubeTexture,
} from "@babylonjs/core";
import earcut from "earcut";
import { createShaderMaterial } from "./material";
export function createScene(canvas) {
  const engine = new Engine(canvas);
  const scene = new Scene(engine);

  const camera = new FreeCamera("camera", new Vector3(0, 5, -100), scene);
  camera.setTarget(Vector3.Zero());
  camera.attachControl(canvas, true);

  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;

  let shaderMaterial;
  const createText = async () => {
    const fontData = await (await fetch("/fonts/Inter_Bold.json")).json(); // Make sure you have the font file at this location
    const text = MeshBuilder.CreateText(
      "myText",
      "Hello World !! @ #$ % é",
      fontData,
      {
        size: 16,
        resolution: 64,
        depth: 10,
      },
      scene,
      earcut
    );

    // After initializing your scene and loading your assets
    //   const environmentTexture = new CubeTexture(
    //     "path/to/your/environment/map",
    //     scene
    //   );
    //   shaderMaterial.setTexture("textureSampler", environmentTexture);
    shaderMaterial = createShaderMaterial(scene);

    text.material = shaderMaterial;
  };

  createText();

  engine.runRenderLoop(() => {
    if (scene) {
      scene.render();
      shaderMaterial?.setVector3("cameraPosition", scene.activeCamera.position);
    }
  });

  const resize = () => {
    scene.getEngine().resize();
  };

  window.addEventListener("resize", resize);

  return () => {
    scene.getEngine().dispose();
    window.removeEventListener("resize", resize);
  };
}
