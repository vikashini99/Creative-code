const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');

const settings = {
  dimensions: [1080, 1080],
  animate: true,
};

const sketch = ({ context, width, height }) => {
  const agents = [];

  // Create agents
  for (let i = 0; i < 60; i++) {
    const x = random.range(0, width);
    const y = random.range(0, height);
    agents.push(new Agent(x, y));
  }

  return ({ context, width, height, time }) => {
    // Set background gradient
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#1A1A2E');
    gradient.addColorStop(1, '#16213E');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    // Draw connections between agents
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];

      for (let j = i + 1; j < agents.length; j++) {
        const other = agents[j];
        const dist = agent.pos.getDistance(other.pos);

        if (dist > 200) continue;

        // Create a color gradient based on distance
        const colorValue = math.mapRange(dist, 0, 200, 255, 0);
        context.strokeStyle = `rgba(255, ${colorValue}, 0, 0.8)`; // Yellow to transparent

        context.lineWidth = math.mapRange(dist, 0, 200, 12, 1);
        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.stroke();
      }
    }

    // Update and draw agents
    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      agent.bounce(width, height);
    });
  };
};

canvasSketch(sketch, settings);

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));
    this.radius = random.range(6, 12); // Adjust radius range for variety
  }

  bounce(width, height) {
    if (this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1;
    if (this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
  }

  update() {
    this.pos.x += this.vel.x * 0.5; // Slow down movement
    this.pos.y += this.vel.y * 0.5; // Slow down movement
  }

  draw(context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);
    
    // Use a gradient for filling
    const fillGradient = context.createRadialGradient(0, 0, 0, 0, 0, this.radius);
    fillGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    fillGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

    context.fillStyle = fillGradient;
    context.lineWidth = 2;

    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = 'rgba(255, 255, 255, 0.7)'; // White stroke
    context.stroke();
    context.restore();
  }
}
