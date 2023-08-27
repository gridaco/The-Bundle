import p5 from "p5";

export const sketch = (p: p5) => {
  let t = 0;
  const gridCellSize = 20;
  const speed = 0.05; // Speed of the wave pulse

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    p.noFill();
  };

  p.draw = () => {
    p.background(255);
    t += speed; // time

    for (let x = 0; x < p.width; x += gridCellSize) {
      for (let y = 0; y < p.height; y += gridCellSize) {
        p.push();
        p.translate(x + gridCellSize / 2, y + gridCellSize / 2);

        // Create a repeating wave pulse
        let wave = p.sin((x + y - t * gridCellSize) % p.TWO_PI) * 45;

        let scale = p.abs(p.sin(wave));
        let strokeWidth = p.map(scale, 0, 1, 0, gridCellSize / 2);
        p.strokeWeight(strokeWidth);

        // Create the illusion of an empty cell when the line is vertical (90 degrees or 270 degrees)
        if (wave > 80 && wave < 100) {
          p.stroke(255); // same color as the background
        } else {
          p.stroke(0); // black line
        }

        p.rotate(wave + 90); // rotate based on wave + 90 degrees to be perpendicular to the wave direction
        p.line(-gridCellSize / 2, 0, gridCellSize / 2, 0);

        p.pop();
      }
    }
  };
};
