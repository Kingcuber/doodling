let cube;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
}

function draw() {
  cube = new Cube(0, 0, 0, 400, 4);

  background("#6ba292");
  pointLight(255, 220, 124, 0, 0, 0);
  ambientLight(60, 60, 60);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  rotateZ(frameCount * 0.01);
  cube.draw();
}

class Cube {
  children = [];
  x = 0;
  y = 0;
  z = 0;
  size = 0;

  constructor(x, y, z, size, depth) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.size = size;

    if (depth == 0) return;

    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        for (let z = -1; z < 2; z++) {
          if (x == 0 && y == 0) continue;
          if (y == 0 && z == 0) continue;
          if (x == 0 && z == 0) continue;
          this.children.push(new Cube(x, y, z, size / 3, depth - 1));
        }
      }
    }
  }

  draw() {
    push();
    translate(this.x * this.size, this.y * this.size, this.z * this.size);
    if (this.children.length == 0) {
      noStroke();
      ambientMaterial(color("#ff9b71"));
      box(this.size);
    } else {
      this.children.forEach((item) => {
        if (item.x == 0 && item.y == 0) return;
        if (item.x == 0 && item.z == 0) return;
        if (item.z == 0 && item.y == 0) return;
        item.draw();
      });
    }
    pop();
  }
}
