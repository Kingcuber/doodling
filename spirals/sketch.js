let numPoints = 500,
  turnFraction = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(125);
}

function draw() {
  clear();

  background(125);
  for (let i = 0; i < numPoints; i++) {
    let dst = i / (numPoints - 1);
    let angle = 2 * Math.PI * turnFraction * i;

    let x = windowWidth / 2 + dst * Math.cos(angle) * 500;
    let y = windowHeight / 2 + dst * Math.sin(angle) * 500;
    noStroke();

    let nX = norm(x, 0, windowWidth);
    let nY = norm(y, 0, windowHeight);
    let nI = norm(i, 0, numPoints);

    let r = lerp(nX, 0, i);
    let g = lerp(nY, 0, i);
    let b = lerp(nI, 0, i);

    fill(color(-r, -g, -b));
    circle(x, y, 10);
  }
  turnFraction += 0.0001;
}

function norm(value, min, max) {
  return (value - min) / (max - min);
}

function lerp(norm, min, max) {
  return (max - min) * norm + min;
}
