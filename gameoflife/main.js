playing = false;
speed = 500;

function togglePlay(x) {
  playing = !playing;
  x.classList.toggle("active");
  play = document.getElementById("play");
  play.classList.toggle("fa-play-circle");
}

function toggleStep(x) {
  if (speed == 500) return;
  speed = 500;

  x.classList.toggle("active");
  play = document.getElementById("fast");
  play.classList.toggle("active");
}

function toggleFast(x) {
  if (speed == 100) return;
  speed = 100;

  x.classList.toggle("active");
  play = document.getElementById("step");
  play.classList.toggle("active");
}

window.onload = function () {
  var canvas = document.getElementById("canvas"),
    overlay = document.getElementById("overlay"),
    context = canvas.getContext("2d"),
    width = (canvas.width = window.innerWidth),
    height = (canvas.height = window.innerHeight),
    gridDiameter = 20,
    columns = Math.round(width / gridDiameter),
    rows = Math.round(height / gridDiameter),
    grid = [],
    updateGrid = [],
    draw = false;

  overlay.style.height = gridDiameter * 2 + "px";

  fillGrid();
  update();

  document.addEventListener("mousedown", function (event) {
    draw = true;
    var x = Math.round(event.clientX / gridDiameter),
      y = Math.round(event.clientY / gridDiameter);

    grid[y][x].setAlive(true);
  });

  document.addEventListener("mouseup", function (event) {
    draw = false;
  });

  document.addEventListener("mousemove", function (event) {
    if (draw) {
      var x = Math.round(event.clientX / gridDiameter),
        y = Math.round(event.clientY / gridDiameter);

      grid[y][x].setAlive(true);
    }
  });

  function update() {
    context.clearRect(0, 0, width, height);

    drawGrid();
    drawCells();

    if (playing) {
      updateCells();
    }

    if (playing) {
      setTimeout(function () {
        requestAnimationFrame(update);
      }, speed);
    } else {
      requestAnimationFrame(update);
    }
  }

  function updateCells() {
    updateGrid = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        if (!grid[i][j].isAlive()) {
          updateGrid.push({ row: i, col: j, revive: shouldReviveCell(i, j) });
        } else if (grid[i][j].isAlive()) {
          updateGrid.push({ row: i, col: j, survive: shouldSurvive(i, j) });
        }
      }
    }

    for (let i = 0; i < updateGrid.length; i++) {
      let y = updateGrid[i].row,
        x = updateGrid[i].col;

      if (updateGrid[i].revive) {
        grid[y][x].setAlive(true);
      } else if (!updateGrid[i].survive) {
        grid[y][x].setAlive(false);
      }
    }
  }

  function countNeighbours(row, col) {
    var count = 0;

    for (var i = -1; i <= 1; i++) {
      for (var j = -1; j <= 1; j++) {
        y = row + i;
        x = col + j;
        if (x < 0 || x > columns - 1 || (i == 0 && j == 0)) continue;
        if (y < 0 || y > rows - 1) continue;
        if (grid[y][x].isAlive()) count++;
      }
    }

    return count;
  }

  function shouldSurvive(row, col) {
    var count = countNeighbours(row, col);

    return count == 2 || count == 3;
  }

  function shouldReviveCell(row, col) {
    var count = countNeighbours(row, col);

    return count == 3;
  }

  function drawCells() {
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        if (grid[i][j].alive) {
          context.beginPath();

          var normI = norm(i, 0, rows);
          var normJ = norm(j, 0, columns);

          context.fillStyle =
            "rgba(" +
            255 +
            "," +
            lerp(normJ, 0, 255) +
            "," +
            lerp(normI, 0, 255) +
            ",1)";

          context.rect(
            j * gridDiameter,
            i * gridDiameter,
            gridDiameter,
            gridDiameter
          );

          context.fill();
        }
      }
    }
  }

  function drawGrid() {
    for (var i = 0; i < columns; i++) {
      for (var j = 0; j < rows; j++) {
        context.beginPath();
        context.moveTo(i * gridDiameter, j * gridDiameter);
        context.lineTo(i * gridDiameter + gridDiameter, j * gridDiameter);
        context.moveTo(i * gridDiameter, j * gridDiameter);
        context.lineTo(i * gridDiameter, j * gridDiameter + gridDiameter);
        context.moveTo(
          i * gridDiameter + gridDiameter,
          j * gridDiameter + gridDiameter
        );
        context.lineTo(i * gridDiameter, j * gridDiameter + gridDiameter);
        context.moveTo(
          i * gridDiameter + gridDiameter,
          j * gridDiameter + gridDiameter
        );
        context.lineTo(i * gridDiameter + gridDiameter, j * gridDiameter);

        context.stroke();
      }
    }
  }

  function fillGrid() {
    for (var i = 0; i < rows; i++) {
      var row = [];
      for (var j = 0; j < columns; j++) {
        row.push(cell.create(i, j));
      }
      grid.push(row);
    }
  }
};

function norm(value, min, max) {
  return (value - min) / (max - min);
}

function lerp(norm, min, max) {
  return (max - min) * norm + min;
}

var cell = {
  alive: false,
  dead: false,
  x: 0,
  y: 0,

  create: function (x, y) {
    var obj = Object.create(this);
    obj.x = x;
    obj.y = y;
    obj.alive = false;
    return obj;
  },

  setAlive: function (alive) {
    this.alive = alive;
  },

  isAlive: function () {
    return this.alive;
  },
};
