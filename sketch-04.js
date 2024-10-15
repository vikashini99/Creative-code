const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const dat = require('dat.gui');  // Import dat.gui

const settings = {
  dimensions: [1080, 1080],
  animate: true
};

const params = {
  cols: 10,
  rows: 10,
  scaleMin: 1,
  scaleMax: 30,
  freq: 0.001,
  amp: 0.2,
  frame: 0,
  animate: true,
  lineCap: 'butt'
};

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const cols = params.cols;
    const rows = params.rows;
    const numCells = cols * rows;

    const gridw = width * 0.8;
    const gridh = height * 0.8;
    const cellw = gridw / cols;
    const cellh = gridh / rows;
    const margx = (width - gridw) * 0.5;
    const margy = (height - gridh) * 0.5;

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellw;
      const y = row * cellh;
      const w = cellw * 0.8;
      const h = cellh * 0.8;

      const f = params.animate ? frame : params.frame;

      const n = random.noise3D(x, y, f * 10, params.freq);
      const angle = n * Math.PI * params.amp;
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);

      context.save();
      context.translate(x, y);
      context.translate(margx, margy);
      context.translate(cellw * 0.5, cellh * 0.5);
      context.rotate(angle);

      context.lineWidth = scale;
      context.lineCap = params.lineCap;

      context.beginPath();
      context.moveTo(w * -0.5, 0);
      context.lineTo(w * 0.5, 0);
      context.stroke();

      context.restore();
    }
  };
};

const createGUI = () => {
  const gui = new dat.GUI();
  let folder;

  folder = gui.addFolder('Grid');
  folder.add(params, 'lineCap', ['butt', 'round', 'square']);
  folder.add(params, 'cols', 2, 50, 1);
  folder.add(params, 'rows', 2, 50, 1);
  folder.add(params, 'scaleMin', 1, 100);
  folder.add(params, 'scaleMax', 1, 100);

  folder = gui.addFolder('Noise');
  folder.add(params, 'freq', -0.01, 0.01);
  folder.add(params, 'amp', 0, 1);
  folder.add(params, 'animate');
  folder.add(params, 'frame', 0, 999);
};

createGUI();
canvasSketch(sketch, settings);
