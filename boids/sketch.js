let grey = "#A6A198";
let boidColor = "#F28C0F";
let numBoids = 1000;
let boids = [];
let r = 5;
let maxSpeed = 4;
let maxForce = 0.1;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  colorMode(HSB, 50);
  for (let i = 0; i < numBoids; i++) {
    boids.push(
      new Boid(
        Math.random() * windowWidth,
        Math.random() * windowHeight,
        Math.random() * Math.PI * 2,
        20,
        color(Math.random() * 255, Math.random() * 255, Math.random() * 255)
      )
    );
  }
}

function draw() {
  background(grey);

  boids.forEach((boid) => {
    boid.update();
    boid.flock();
    // boid.seek(createVector(mouseX, mouseY));
    drawBoid(boid);
  });
}

function drawBoid(boid) {
  let theta = boid.heading() + PI / 2;
  let x = lerp(0, 100, norm(boid.location.x, 0, windowWidth * 2));
  let y = 100;

  fill(x, y, 50);
  stroke(0);
  push();
  translate(boid.location.x, boid.location.y);
  rotate(theta);
  beginShape();
  vertex(0, -r * 2);
  vertex(-r, r * 2);
  vertex(r, r * 2);
  endShape(CLOSE);
  pop();
}

class Boid {
  location;
  velocity;
  acceleration;
  visionRange;
  color;

  constructor(x, y, direction, visionRange, color) {
    //x,y
    this.location = createVector(x, y);
    //speed
    let vX = Math.sin(direction) * 5;
    let vY = Math.sqrt(25 - vX * vX);
    this.velocity = createVector(vX, vY);
    this.acceleration = createVector(0, 0);
    this.visionRange = visionRange;
    this.color = color;
  }

  update = () => {
    this.velocity.add(this.acceleration);
    this.velocity.limit(maxSpeed);
    this.location.add(this.velocity);
    this.acceleration.mult(0);

    if (this.location.x < 0) {
      this.location.x = windowWidth;
    } else if (this.location.x > windowWidth) {
      this.location.x = 0;
    }

    if (this.location.y < 0) {
      this.location.y = windowHeight;
    } else if (this.location.y > windowHeight) {
      this.location.y = 0;
    }
  };

  applyForce = (force) => {
    this.acceleration.add(force);
  };

  heading = () => {
    return this.velocity.heading();
  };

  seek = (target) => {
    let desired = p5.Vector.sub(target, this.location);
    desired.normalize();
    desired.mult(maxSpeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(maxForce);

    return steer;
  };

  seperate = () => {
    let sum = createVector(0, 0);
    let count = 0;

    boids.forEach((other) => {
      //distance to other boid
      let distance = p5.Vector.dist(this.location, other.location);

      //if too close
      if (distance > 0 && distance < this.visionRange) {
        //vector away from other boid
        let diff = p5.Vector.sub(this.location, other.location);
        diff.normalize();

        //add to flee force
        sum.add(diff);
        count++;
      }
    });
    if (count > 0) {
      //average force
      sum.div(count);
      sum.normalize();
      sum.mult(maxSpeed);

      //just like seek
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(maxForce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  };

  align = () => {
    let neighbordist = 50;
    let sum = createVector(0, 0);
    let count = 0;
    boids.forEach((other) => {
      let d = p5.Vector.dist(this.location, other.location);
      if (d > 0 && d < neighbordist) {
        sum.add(other.velocity);
        count++;
      }
    });

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(maxSpeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(maxForce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  };

  cohesion = () => {
    let neighbordist = 50;
    let sum = createVector(0, 0);
    let count = 0;

    boids.forEach((other) => {
      let d = p5.Vector.dist(this.location, other.location);
      if (d > 0 && d < neighbordist) {
        sum.add(other.location);
        count++;
      }
    });

    if (count > 0) {
      sum.div(count);
      return this.seek(sum);
    } else {
      return createVector(0, 0);
    }
  };

  flock = () => {
    let seperation = this.seperate();
    let align = this.align();
    let cohesion = this.cohesion();

    seperation.mult(1.5);
    align.mult(1.0);
    cohesion.mult(1);

    this.applyForce(seperation);
    this.applyForce(align);
    this.applyForce(cohesion);
  };
}
