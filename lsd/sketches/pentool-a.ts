import p5 from "p5";

const inter = { black: "/fonts/Inter-Black.ttf" };

export const sketch = (p) => {
  let rotation = { x: 0, y: 0, z: 0 };
  let plane = [];
  let numRows = 10;
  let waveVariables = { amplitude: 100, frequency: 0.01, speed: 0 };
  let colors = { background: p.color(0), text: p.color(255) };
  let font = null;

  const chars = ["A", "C", "T", "G"];
  p.preload = () => {
    // Use Google Font API to load the Inter font
    font = p.loadFont(inter.black);
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.textFont(font);
    p.textSize(20);

    for (let i = 0; i < numRows; i++) {
      // @ts-ignore
      plane[i] = { y: (i - numRows / 2) * 30, offset: p.random(1000) };
    }
  };

  p.draw = function () {
    p.background(colors.background);

    p.rotateX(rotation.x);
    p.rotateY(rotation.y);
    p.rotateZ(rotation.z);

    p.fill(colors.text);
    p.noStroke();

    for (let i = 0; i < numRows; i++) {
      let row = plane[i];
      for (let x = -p.width / 2; x < p.width / 2; x += 50) {
        let y =
          // @ts-ignore
          row.y +
          waveVariables.amplitude *
            p.sin(
              waveVariables.frequency *
                (x +
                  p.frameCount * waveVariables.speed +
                  // @ts-ignore
                  row.offset)
            );
        p.push();
        p.translate(x, y);
        const randchar = chars[Math.floor(Math.random() * chars.length)];
        p.text(randchar, 0, 0);
        p.pop();
      }
    }

    rotation.x += 0.001;
    rotation.y += 0.002;
  };
};
