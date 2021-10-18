let sponge;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  sponge = [new Cube(0, 0, 0, 400)];
}

function mousePressed() {
  let newSponge = [];

  sponge.forEach((item) => (newSponge = [...newSponge, ...item.spongeItUp()]));

  sponge = newSponge;
}

function draw() {
  background("#6ba292");

  let col = abs(lerp(0, 255, sin(frameCount * 0.01)));

  pointLight(256 - col, col, 256 - col, 0, 0, 0);
  ambientLight(60, 60, 60);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  rotateZ(frameCount * 0.01);
  sponge.forEach((item) => item.draw());
}

class Cube {
  x = 0;
  y = 0;
  z = 0;
  size = 0;

  constructor(x, y, z, size) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = size;
  }

  spongeItUp = () => {
    let result = [];

    let offset = this.size / 3;

    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        for (let z = -1; z < 2; z++) {
          if (x == 0 && y == 0) continue;
          if (y == 0 && z == 0) continue;
          if (x == 0 && z == 0) continue;
          result.push(new Cube(this.x + offset * x, this.y + offset * y, this.z + offset * z, this.size / 3));
        }
      }
    }

    return result;
  };

  draw() {
    push();
    translate(this.x, this.y, this.z);
    noStroke();
    box(this.size);

    pop();
  }
}
