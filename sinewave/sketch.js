let angle = 0;
let countSides = 25;
let boxSize = 25;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  ortho();
  createLoop({
    gif: {
      options: { quality: 5 },
      fileName: "noiseLoop.gif",
      startLoop: 1,
      endLoop: 3,
      download: true,
    },
  });
}

function draw() {
  background(125);
  normalMaterial();
  for (let y = -countSides / 2; y < countSides / 2; y++) {
    for (let x = -countSides / 2; x < countSides / 2; x++) {
      push();
      rotateX(PI / 4);
      rotateZ(PI / 4);
      translate(boxSize * x, boxSize * y);

      let d = dist(0, 0, x * 0.4, y * 0.4);

      let h = Math.sin(angle + d);

      box(boxSize, boxSize, map(h, -1, 1, 50, 450));
      pop();
    }
  }
  angle -= 0.04;
}
