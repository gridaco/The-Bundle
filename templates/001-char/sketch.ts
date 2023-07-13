import p5 from "p5";

export const sketch = (p: p5) => {
  const cellSize = 20; // Defines the size of each cell
  const defaultScale = 0.6; // Defines the default scale of each cell
  const gridSize = cellSize / defaultScale; // Adjust gridSize according to cellSize and defaultScale
  const circleSpeed = 10; // Controls the speed at which the wave expands
  let diameter = 0;
  const waveWidth = 400; // Controls the width of the wave

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noFill();
    p.stroke(255); // White stroke color
  };

  p.draw = () => {
    p.background(0); // Black background color

    // Calculate the maximum diameter that reaches to a corner of the canvas
    const maxDiameter = p.dist(0, 0, p.width, p.height);

    diameter += circleSpeed;

    // Reset diameter when it reaches or exceeds the maximum
    if (diameter >= maxDiameter + waveWidth) {
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
        const distFromWaveFront = diameter - distFromCenter;
        const distFromWaveBack = diameter - waveWidth - distFromCenter;

        // Inside the wave
        if (distFromWaveFront >= 0 && distFromWaveBack < 0) {
          const scale = p.map(distFromWaveFront, 0, waveWidth, defaultScale, 0);
          p.ellipse(x, y, cellSize * scale);
        }
        // The wave is passing the cell (scaling up)
        else if (distFromWaveBack >= 0 && distFromWaveBack < gridSize) {
          const scale = p.map(distFromWaveBack, 0, gridSize, 0, defaultScale);
          p.ellipse(x, y, cellSize * scale);
        }
        // The wave has not reached the cell or the wave has passed the cell
        else {
          p.ellipse(x, y, cellSize * defaultScale);
        }
      }
    }
  };
};
