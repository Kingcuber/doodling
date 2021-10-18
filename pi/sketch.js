let firstBlock;
let secondBlock;
let blocks;
let count = 0;
let numDigids = 5;
let numSteps = 500;
let speed = 2;
let done = false;
let particles = [];
let angle = 0;

class Block {
  mass;
  size;
  x;
  velocity;
  other;

  constructor(x, velocity, size, mass) {
    this.size = size;
    this.x = x;
    this.mass = mass;
    this.velocity = velocity;
  }

  update = () => {
    this.x += this.velocity;
    if (this.x <= 0) {
      this.velocity *= -1;
      count++;
    }
  };

  collision = () => {
    return this.x >= this.other.x && this.x <= this.other.x + this.other.size;
  };
}

function setup() {
  //x, velocity, size, mass
  firstBlock = new Block(windowWidth / 3, 0, 40, 1);
  secondBlock = new Block(
    windowWidth / 2,
    -(speed / numSteps),
    80,
    Math.pow(100, numDigids - 1)
  );
  blocks = [firstBlock, secondBlock];
  firstBlock.other = secondBlock;
  secondBlock.other = firstBlock;

  for (let i = 0; i < 1000; i++) {
    particles.push({ x: Math.random() * windowWidth, y: 0 });
  }

  createCanvas(windowWidth, windowHeight);
}

function draw() {
  if (!done) {
    for (let i = 0; i < numSteps; i++) {
      background(124);
      rect(0, windowHeight / 2, windowWidth);
      let collided = false;

      blocks.forEach((block) => {
        rect(block.x, windowHeight / 2 - block.size, block.size);
        textSize(20);

        text(
          (block.velocity * numSteps).toFixed(2),
          block.x + 10,
          windowHeight / 2 + 50
        );
        text(block.mass + "kg", block.x + 10, windowHeight / 2 + 100);
        block.update();
        collided = collided || block.collision();
      });

      let first = blocks[0];
      let second = blocks[1];
      if (collided) {
        let m1 = first.mass;
        let m2 = second.mass;
        let u1 = first.velocity;
        let u2 = second.velocity;

        let v1 = ((m1 - m2) / (m1 + m2)) * u1 + ((2 * m2) / (m1 + m2)) * u2;
        let v2 = ((2 * m1) / (m1 + m2)) * u1 + ((m2 - m1) / (m1 + m2)) * u2;

        first.velocity = v1;
        second.velocity = v2;
        count++;
      }

      textSize(50);
      text(count, 10, 50);

      if (
        first.velocity < second.velocity &&
        first.velocity >= 0 &&
        second.velocity >= 0
      ) {
        done = true;
      }
    }
  } else {
    text("DONE π", windowWidth / 2, windowHeight / 2);
  }
}
