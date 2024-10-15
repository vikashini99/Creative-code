const canvasSketch = require('canvas-sketch');
const dat = require('dat.gui');

const settings = {
  dimensions: [window.innerWidth, window.innerHeight], // Fill the browser window
  animate: true
};

// Create a GUI for adjusting parameters
const gui = new dat.GUI();
const params = {
  rows: 5,
  cols: 5,
  spacing: 10,
  minSize: 30,
  sizeNoise: 10,
  positionNoise: 5,
  colorNoise: 10,
  sizeSpeed: 0.001,
  positionSpeed: 0.001,
  lineWidthSpeed: 0.005,
  colorSpeed: 0.5
};

gui.add(params, 'rows', 1, 10).step(1).name('Rows');
gui.add(params, 'cols', 1, 10).step(1).name('Cols');
gui.add(params, 'spacing', 0, 50).step(1).name('Spacing');
gui.add(params, 'minSize', 10, 100).step(1).name('Min Size');
gui.add(params, 'sizeNoise', 0, 50).step(1).name('Size Noise');
gui.add(params, 'positionNoise', 0, 50).step(1).name('Position Noise');
gui.add(params, 'colorNoise', 0, 50).step(1).name('Color Noise');
gui.add(params, 'sizeSpeed', 0, 0.01).step(0.0001).name('Size Speed');
gui.add(params, 'positionSpeed', 0, 0.01).step(0.0001).name('Position Speed');
gui.add(params, 'lineWidthSpeed', 0, 0.01).step(0.0001).name('Line Width Speed');
gui.add(params, 'colorSpeed', 0, 1).step(0.01).name('Color Speed');

const noise = (min, max) => Math.random() * (max - min) + min;

const drawRect = (context, centerX, centerY, width, height, lineWidth, fillColor = null, strokeColor = null) => {
  context.beginPath();
  const halfWidth = (width - lineWidth) / 2;
  const halfHeight = (height - lineWidth) / 2;

  if (fillColor) {
    context.fillStyle = fillColor;
    context.fillRect(centerX - halfWidth, centerY - halfHeight, width - lineWidth, height - lineWidth);
  }
  
  context.rect(centerX - halfWidth, centerY - halfHeight, width - lineWidth, height - lineWidth);
  context.lineWidth = lineWidth;
  if (strokeColor) {
    context.strokeStyle = strokeColor;
  } else {
    context.strokeStyle = '#000000';  // Default stroke color
  }
  context.stroke();
  context.closePath();
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    // Frame delay to slow down animation
    const frameDelay = 10;
    if (frame % frameDelay !== 0) return;

    context.fillStyle = '#000000'; // Set background to black
    context.fillRect(0, 0, width, height);

    const { rows, cols, spacing, minSize, sizeNoise, positionNoise, colorNoise, sizeSpeed, positionSpeed, lineWidthSpeed, colorSpeed } = params;

    // Animation speed control
    const baseHue = 0;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cellWidth = width / cols;
        const cellHeight = height / rows;

        // Generate random dimensions for each rectangle with noise
        const maxRectWidth = cellWidth - 2 * spacing;
        const maxRectHeight = cellHeight - 2 * spacing;

        // Animate size by using frame number with slower speed
        const rectWidth = noise(minSize, maxRectWidth + sizeNoise) + Math.sin(frame * sizeSpeed) * 5;
        const rectHeight = noise(minSize, maxRectHeight + sizeNoise) + Math.sin(frame * sizeSpeed) * 5;

        // Calculate the center position with noise and slower animation
        const centerX = col * cellWidth + cellWidth / 2 + noise(-positionNoise, positionNoise) + Math.sin(frame * positionSpeed) * 2;
        const centerY = row * cellHeight + cellHeight / 2 + noise(-positionNoise, positionNoise) + Math.cos(frame * positionSpeed) * 2;

        // Animate line width with slower speed
        const lineWidth = noise(1, 10) + Math.sin(frame * lineWidthSpeed) * 1;  

        // Animate colors with full hue range
        const hue = (baseHue + frame * colorSpeed) % 360;
        const fillColor = Math.random() > 0.5 ? `hsl(${hue}, ${70 + noise(-colorNoise, colorNoise)}%, 70%)` : null;
        const strokeColor = `hsl(${(hue + 180) % 360}, ${70 + noise(-colorNoise, colorNoise)}%, 50%)`; 

        drawRect(context, centerX, centerY, rectWidth, rectHeight, lineWidth, fillColor, strokeColor);
      }
    }
  };
};

canvasSketch(sketch, settings);
