let dimension = 3;
let width = 100;
let cube = [];

let possibleMoves = ["r", "l", "u", "d", "b", "f"];
let sequence = "";
let counter = 0;

let animating = false;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  setupCubies();

  for (let i = 0; i < 500; i++) {
    sequence += random() > 0.5 ? random(possibleMoves) : random(possibleMoves).toUpperCase();
  }
}

function draw() {
  background(200);
  orbitControl(5, 5, 0);
  rotateX(-QUARTER_PI / 2);
  rotateY(-QUARTER_PI / 2);

  for (let x = 0; x < dimension; x++) {
    for (let y = 0; y < dimension; y++) {
      for (let z = 0; z < dimension; z++) {
        cube[x][y][z].show();
      }
    }
  }

  // applyMove(sequence[counter]);
  counter++;
}

function move(type, row, direction = 1) {
  if (!animating) {
    animating = true;
    for (let i = 0; i < dimension; i++) {
      for (let j = 0; j < dimension; j++) {
        if (type === "x") {
          cube[row][i][j].moveX(direction, 90);
        } else if (type === "y") {
          cube[i][row][j].moveY(direction, 90);
        } else if (type === "z") {
          cube[i][j][row].moveZ(direction, 90);
        }
      }
    }
    animating = false;
  }
}

function keyTyped() {
  applyMove(key);
}

function applyMove(key) {
  if (key === "r") {
    move("x", dimension - 1);
  }
  if (key === "l") {
    move("x", 0);
  }
  if (key === "u") {
    move("y", 0);
  }
  if (key === "d") {
    move("y", dimension - 1);
  }
  if (key === "b") {
    move("z", 0);
  }
  if (key === "f") {
    move("z", dimension - 1);
  }
  if (key === "R") {
    move("x", dimension - 1, -1);
  }
  if (key === "L") {
    move("x", 0, -1);
  }
  if (key === "U") {
    move("y", 0, -1);
  }
  if (key === "D") {
    move("y", dimension - 1, -1);
  }
  if (key === "B") {
    move("z", 0, -1);
  }
  if (key === "F") {
    move("z", dimension - 1, -1);
  }
}

function setupCubies() {
  let min = -Math.floor(dimension / 2);
  let max = Math.round(dimension / 2);

  for (let x = min; x < max; x++) {
    let tmp = [];

    for (let y = min; y < max; y++) {
      let tmp2 = [];

      for (let z = min; z < max; z++) {
        tmp2.push(new Part(x, y, z));
      }

      tmp.push(tmp2);
    }

    cube.push(tmp);
  }
}

class Part {
  x = 0;
  y = 0;
  z = 0;
  faces = [];

  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;

    //white
    this.faces.push(new Face(color(255, 255, 255), createVector(0, 1, 0)));
    //yellow
    this.faces.push(new Face(color(255, 213, 0), createVector(0, -1, 0)));

    //orange
    this.faces.push(new Face(color(255, 88, 0), createVector(0, 0, -1)));
    //red
    this.faces.push(new Face(color(183, 18, 52), createVector(0, 0, 1)));

    //green
    this.faces.push(new Face(color(0, 155, 72), createVector(-1, 0, 0)));
    //blue
    this.faces.push(new Face(color(0, 70, 173), createVector(1, 0, 0)));
  }

  show() {
    push();

    translate(this.x * width - width / 2, this.y * width - width / 2, this.z * width - width / 2);

    this.faces.forEach((face) => {
      face.show();
    });

    pop();
  }

  moveX(direction, angle) {
    this.faces.forEach((face) => {
      let y = Math.round(face.facing.y * Math.cos(angle * direction) - face.facing.z * Math.sin(angle * direction));
      let z = Math.round(face.facing.y * Math.sin(angle * direction) + face.facing.z * Math.cos(angle * direction));
      face.facing.y = y;
      face.facing.z = z;
    });
  }

  moveY(direction, angle) {
    this.faces.forEach((face) => {
      let x = Math.round(face.facing.x * Math.cos(angle * direction) - face.facing.z * Math.sin(angle * direction));
      let z = Math.round(face.facing.x * Math.sin(angle * direction) + face.facing.z * Math.cos(angle * direction));
      face.facing.x = x;
      face.facing.z = z;
    });
  }

  moveZ(direction, angle) {
    this.faces.forEach((face) => {
      let y = Math.round(face.facing.y * Math.cos(angle * direction) - face.facing.x * Math.sin(angle * direction));
      let x = Math.round(face.facing.y * Math.sin(angle * direction) + face.facing.x * Math.cos(angle * direction));
      face.facing.y = y;
      face.facing.x = x;
    });
  }
}

class Face {
  color = color(0, 0, 0);
  facing = createVector(0, 0, 0);

  constructor(color, facing) {
    this.color = color;
    this.facing = facing;
  }

  show() {
    push();
    fill(this.color);
    beginShape();

    if (this.facing.y != 0) {
      rotateX(HALF_PI);
      let tmp = Math.min(width * this.facing.y, 0);

      vertex(0, 0, tmp);
      vertex(0, width, tmp);
      vertex(width, width, tmp);
      vertex(width, 0, tmp);
    }
    if (this.facing.x != 0) {
      rotateY(HALF_PI);
      let tmp = this.facing.x < 0 ? 0 : width;

      vertex(0, 0, tmp);
      vertex(0, width, tmp);
      vertex(-width, width, tmp);
      vertex(-width, 0, tmp);
    }
    if (this.facing.z != 0) {
      let tmp = this.facing.z < 0 ? 0 : width;

      vertex(0, 0, tmp);
      vertex(0, width, tmp);
      vertex(width, width, tmp);
      vertex(width, 0, tmp);
    }

    endShape(CLOSE);
    pop();
  }
}
