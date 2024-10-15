const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [ 600, 600 ]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const rectWidth = 60;
        const rectHeight = 60;
        const spacing = 20;
        let x , y ; 

        // Draw a 5x5 grid of rectangles
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                let x = 100 + (rectWidth + spacing) * col;
                let y = 100+ (rectHeight + spacing) * row;
                context.beginPath();
                context.strokeStyle = 'rgba(0, 0, 0, 1)'; // Set stroke color to fully opaque black
                context.lineWidth = 2; // Set line width if needed
                context.strokeRect(x, y, rectWidth, rectHeight);

                if (Math.random() > 0.5 ) {

                context.beginPath();
                context.rect(x +8 , y + 8 ,rectWidth-16, rectHeight -16 );
                context.stroke();
                }
           


              }
        }
  };
};

canvasSketch(sketch, settings);
