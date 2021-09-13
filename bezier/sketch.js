class Point {
  x = 0;
  y = 0;
  d = 0;
  active = false;
  //x,y     where to draw
  //d       diameter
  constructor(x, y, d) {
    this.x = x;
    this.y = y;
    this.d = d;
  }

  mult(value) {
    this.x *= value;
    this.y *= value;
  }

  add(point) {
    this.x += point.x;
    this.y += point.y;
  }
}

var points = [];
var addButton = {};
var deleteButton = {};
var showLines = false;
var showCurve = false;
var slider;

function setup() {
  createCanvas(windowWidth, windowHeight);

  points.push(new Point(30, windowHeight / 2, 50));
  points.push(new Point(windowWidth / 2, windowHeight / 2, 50));
  points.push(new Point(windowWidth - 30, windowHeight / 2, 50));
  addButton = { x: windowWidth - 30, y: 30 };
  deleteButton = { x: windowWidth - 75, y: 30 };

  lineButton = createButton("Show lines");
  lineButton.position(windowWidth - 90, 70);
  lineButton.mousePressed(() => {
    showLines = !showLines;
  });

  curveButton = createButton("Show curve");
  curveButton.position(windowWidth - 90, 90);
  curveButton.mousePressed(() => {
    showCurve = !showCurve;
  });

  slider = createSlider(0.001, 1, 0, 0.001);
  slider.position(0, 0);
}

function draw() {
  clear();

  background("#2a9d8f");
  drawAddButton();
  drawDeleteButton();

  drawPoints();
  doBezier();
}

function doBezier() {
  //linear interpolation B(t)
  noFill();
  beginShape();
  for (let t = 0; t <= 1.0001; t += slider.value()) {
    var point = calcBezier(t, points);
    if (showCurve) {
      vertex(point.x, point.y);
    }
  }
  endShape(LINES);
}

//Here starts the magix
function calcBezier(t, ps) {
  if (ps.length == 1) {
    //Base case if just one point return that point as a new one
    return new Point(ps[0].x, ps[0].y);
  } else {
    //repeat until list is empty *
    var first = calcBezier(t, ps.slice(0, ps.length - 1));
    //repeat until list is empty *
    var second = calcBezier(t, ps.slice(1, ps.length));

    //just some fancy shit
    if (showLines) {
      line(first.x, first.y, second.x, second.y);
    }
  }

  //multiply the first point (x,y) by 1-t
  first.mult(1 - t);

  //and the second one by t
  second.mult(t);

  //add the two x,y together
  first.add(second);

  //return and go to * until list is done and return the final point
  return first;
}

function drawPoints() {
  for (let i = 0; i < points.length; i++) {
    var point = points[i];
    if (i != points.length - 1) var nextPoint = points[i + 1];

    fill("#e9c46a");
    if (point.active) {
      fill("#e76f51");
    }
    stroke("#f4a261");
    // if (nextPoint != null) {
    //   line(point.x, point.y, nextPoint.x, nextPoint.y);
    // }
    circle(point.x, point.y, point.d);
    fill("#e9c46a");
  }
}

function drawAddButton() {
  var fillColor = "#f4a261";
  var plusColor = "#264653";

  if (addButton.active) {
    fillColor = "#264653";
    plusColor = "#f4a261";
  }

  fill(fillColor);
  noStroke();
  circle(addButton.x, addButton.y, 40);
  fill(plusColor);
  textSize(30);
  textAlign(CENTER);
  text("+", addButton.x, 40);
}

function drawDeleteButton() {
  var fillColor = "#f4a261";
  var plusColor = "#264653";

  if (deleteButton.active) {
    fillColor = "#264653";
    plusColor = "#f4a261";
  }

  fill(fillColor);
  noStroke();
  circle(deleteButton.x, deleteButton.y, 40);
  fill(plusColor);
  textSize(30);
  textAlign(CENTER);
  text("-", deleteButton.x, 38);
}

function mouseClicked() {
  if (addButton.active) {
    points.push(new Point(mouseX, mouseY, 50));
    addButton.active = false;
    return;
  }

  let dX = Math.abs(deleteButton.x - mouseX),
    dY = Math.abs(deleteButton.y - mouseY);

  if (dX < 20 && dY < 20) {
    deleteButton.active = true;
    return;
  }

  (dX = Math.abs(addButton.x - mouseX)), (dY = Math.abs(addButton.y - mouseY));
  if (dX < 20 && dY < 20) {
    addButton.active = true;
    return;
  }

  points.forEach((point) => {
    let dX = Math.abs(point.x - mouseX),
      dY = Math.abs(point.y - mouseY);

    if (dX < point.d / 2 && dY < point.d / 2) {
      if (deleteButton.active) {
        points.splice(points.indexOf(point), 1);
        deleteButton.active = false;
      } else {
        point.active = !point.active;
      }
    }
  });
}

function mouseMoved() {
  points.forEach((point) => {
    if (point.active) {
      point.x = mouseX;
      point.y = mouseY;
    }
  });
}
