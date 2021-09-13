//draw sun and planet with gravity
//trace orbit by line

window.onload = function () {
  var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    width = (canvas.width = window.innerWidth),
    height = (canvas.height = window.innerHeight),
    sun = particle.create(width / 2, height / 2, 0, 0),
    planets = [],
    numPlanets = 4;

  for (let i = 0; i < numPlanets; i++) {
    let p = particle.create(
      utils.randomRange(width / 1.5, width),
      height / 2,
      3,
      Math.PI / 2
    );

    p.radius = utils.randomRange(10, 30);
    planets.push(p);
  }

  sun.mass = 15000;
  sun.radius = 20;

  update();

  function update() {
    context.clearRect(0, 0, width, height);

    context.beginPath();
    context.fillStyle = "#e9c46a";
    context.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2, false);
    context.fill();

    for (let i = 0; i < planets.length; i++) {
      let planet = planets[i];

      planet.gravitateTo(sun);
      planet.update();

      context.beginPath();
      context.fillStyle = "#264653";
      context.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2, false);
      context.fill();

      context.beginPath();
      context.moveTo(planet.x, planet.y);
      context.lineTo(planet.x + planet.vx * 10, planet.y + planet.vy * 10);

      context.stroke();

      var path = planet.path;

      if (path.length > 1500) {
        path.splice(0, 1);
      }
      path.push({ x: planet.x, y: planet.y });
    }

    planets.forEach((planet) => {
      planet.path.forEach((point) => {
        context.beginPath();
        context.fillStyle = "#264653";
        context.arc(point.x, point.y, 1, 0, Math.PI * 2, false);
        context.fill();
      });
    });

    requestAnimationFrame(update);
  }
};
