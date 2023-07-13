import p5 from "p5";

export const sketch = (p: p5) => {
  const gridSize = 20; // Defines the size of the grid, adjust according to your need
  const circleSpeed = 1; // Controls the speed at which the wave expands
  let diameter = 0;

  p.setup = () => {
    const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
    p.noFill();
    p.stroke(255); // White stroke color
  };

  p.draw = () => {
    p.background(0); // Black background color

    // Calculate the maximum diameter that reaches to a corner of the canvas
    const maxDiameter = p.dist(0, 0, p.width, p.height);

    diameter += circleSpeed;

    // Reset diameter when it reaches or exceeds the maximum
    if (diameter >= maxDiameter) {
      diameter = 0;
    }

    // Calculate center of the canvas
    const centerX = p.width / 2;
    const centerY = p.height / 2;

    // Draw the cells
    for (let x = 0; x < p.width; x += gridSize) {
      for (let y = 0; y < p.height; y += gridSize) {
        // Calculate distance from center of the canvas
        const distFromCenter = p.dist(x, y, centerX, centerY);

        // Calculate relative distance from the wave
        const distFromWave = diameter - distFromCenter;

        if (distFromWave > 0 && distFromWave < gridSize) {
          const scale = p.map(distFromWave, 0, gridSize, 0, 1);
          p.ellipse(x, y, gridSize * scale);
        } else if (distFromWave >= gridSize) {
          p.ellipse(x, y, gridSize);
        }
      }
    }
  };
};
