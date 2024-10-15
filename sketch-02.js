const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

let customTime = 0; // Custom time for the animation
const speed = 0.03; // Slow animation speed
const num = 40; // Number of shapes
const radius = 300; // Fixed radius for shapes
const w = 10; // Width of the rectangles
const h = 100; // Height of the rectangles

const sketch = () => {
  return ({ context, width, height, time }) => {
    // Clear the canvas
    context.clearRect(0, 0, width, height);

    // Set background color
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    // Set shape color
    context.fillStyle = 'black';

    // Increase customTime by speed to control how fast the animation moves
    customTime += speed;

    const cx = width * 0.5; // Center x
    const cy = height * 0.5; // Center y

    // Loop through each shape
    for (let i = 0; i < num; i++) {
      const slice = math.degToRad(360 / num);
      const angle = slice * i;

      // Calculate positions
      const x = cx + radius * Math.sin(angle);
      const y = cy + radius * Math.cos(angle);

      // Draw rotating rectangles
      context.save();
      context.translate(x, y);
      context.rotate(-angle + customTime); // Slow rotation
      context.beginPath();
      context.rect(-w * 0.5, -h * 0.5, w, h); // Draw rectangle centered at (0, 0)
      context.fill();
      context.restore();
    }
  };
};

// Start the sketch
canvasSketch(sketch, settings);
