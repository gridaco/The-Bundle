import p5 from "p5";

const inter = { black: "/fonts/Inter-Black.ttf" };

export const sketch = (p: p5) => {
  // Seed variables
  let textContent = "Your Text";
  let rotateSpeed = 0.01;
  let twistSpeed = 0.02;

  // Variables for rotation and twisting
  let rotateAngle = 0;
  let twistAngle = 0;

  let boxDimension: number;
  let textWidth: number;
  let interFont: p5.Font;
  let boxColor: p5.Color;
  let textColor: p5.Color;

  p.preload = () => {
    // Use Google Font API to load the Inter font
    interFont = p.loadFont(inter.black);
  };

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    p.textFont(interFont);
    p.textSize(40);
    p.textAlign(p.CENTER, p.CENTER);

    // Initialize boxColor to match the background color
    boxColor = p.color(220); // Modify as needed
    textColor = p.color(0); // Set text color to black (or any color that contrasts with boxColor)

    // Calculate text width and box dimensions
    textWidth = p.textWidth(textContent);
    boxDimension = textWidth * 1.5; // Modify multiplier as needed
  };

  p.draw = () => {
    p.background(boxColor);
    p.push();

    // Apply transformations
    p.rotateX(rotateAngle);
    p.rotateY(twistAngle);

    // Draw the texts
    p.fill(textColor); // Fill text with contrast color
    for (let i = 0; i < 4; i++) {
      p.push();
      if (i < 2) {
        p.rotateY(i * p.PI); // Rotate for front and back
        p.translate(0, 0, boxDimension / 2);
      } else {
        p.rotateX((i - 1) * p.PI); // Rotate for top and bottom
        p.translate(0, 0, boxDimension / 2);
      }
      p.text(textContent, 0, 0);
      p.pop();
    }

    p.pop();

    // Increment the angles
    rotateAngle += rotateSpeed;
    twistAngle += twistSpeed;

    // Reset angles for looping
    if (rotateAngle >= p.TWO_PI) rotateAngle = 0;
    if (twistAngle >= p.TWO_PI) twistAngle = 0;
  };
};
