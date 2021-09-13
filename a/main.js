playing = false;

function togglePlay(x) {
  playing = !playing;
  x.classList.toggle("active");
  play = document.getElementById("play");
  play.classList.toggle("fa-play-circle");
}

window.onload = function () {
  var canvas = document.getElementById("canvas"),
    overlay = document.getElementById("overlay"),
    context = canvas.getContext("2d"),
    width = (canvas.width = window.innerWidth),
    height = (canvas.height = window.innerHeight),
    boxSize = 10,
    columns = Math.round(width / boxSize),
    rows = Math.round(height / boxSize),
    grid = [],
    openList = [],
    closedList = new Set(),
    start = node.create(1, 1),
    goal = node.create(columns - 2, rows - 2),
    draw = false;
  overlay.style.height = boxSize * 4 + "px";

  fillGrid();
  update();

  //#region userInteraction

  document.addEventListener("mousedown", function (event) {
    draw = true;
    var x = Math.round(event.clientX / boxSize),
      y = Math.round(event.clientY / boxSize);

    grid[y][x].setObstacle(true);
  });

  document.addEventListener("mouseup", function (event) {
    draw = false;
  });

  document.addEventListener("mousemove", function (event) {
    if (draw) {
      var drawX = Math.round(event.clientX / boxSize),
        drawY = Math.round(event.clientY / boxSize);

      for (var x = -1; x <= 1; x++) {
        for (var y = -1; y <= 1; y++) {
          grid[drawY + y][drawX + x].setObstacle(true);
        }
      }
    }
  });

  //#endregion

  openList.push(start);

  function update() {
    context.clearRect(0, 0, width, height);

    drawGrid();
    drawNodes();

    if (playing) {
      updateNodes();
    }

    requestAnimationFrame(update);
  }

  function updateNodes() {
    if (openList.length > 0) {
      let current = openList[0];
      for (let i = 1; i < openList.length; i++) {
        if (
          openList[i].fCost < current.fCost ||
          (openList[i].fCost == current.fCost &&
            openList[i].hCost < current.hCost)
        ) {
          current = openList[i];
        }
      }

      openList.splice(openList.indexOf(current), 1);
      closedList.add(current);

      if (current.x == goal.x && current.y == goal.y) {
        playing = false;
      }

      var neighbours = getNeighbours(current);
      for (var n = 0; n < neighbours.length; n++) {
        var neighbour = neighbours[n];
        if (neighbour.isObstacle() || closedList.has(neighbour)) {
          continue;
        }

        var newMovementCostToNeighbour =
          current.gCost + getDistance(current, neighbour);
        if (
          newMovementCostToNeighbour < neighbour.gCost ||
          !openList.includes(neighbour)
        ) {
          neighbour.gCost = newMovementCostToNeighbour;
          neighbour.hCost = getDistance(neighbour, goal);
          neighbour.parent = current;

          if (!openList.includes(neighbour)) {
            openList.push(neighbour);
          }
        }
      }
    }
  }

  function getDistance(nodeA, nodeB) {
    var distX = Math.abs(nodeA.x - nodeB.x),
      distY = Math.abs(nodeA.y - nodeB.y);

    if (distX > distY) {
      return 14 * distY + 10 * (distX - distY);
    } else {
      return 14 * distX + 10 * (distY - distX);
    }
  }

  function getNeighbours(node) {
    var neighbours = [];
    for (var x = -1; x <= 1; x++) {
      for (var y = -1; y <= 1; y++) {
        if (x == 0 && y == 0) continue;
        var calcX = node.x + x,
          calcY = node.y + y;

        if (calcX >= 0 && calcX < columns && calcY >= 0 && calcY < rows) {
          neighbours.push(grid[calcY][calcX]);
        }
      }
    }

    return neighbours;
  }

  function drawNodes() {
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        if (grid[i][j].isObstacle()) {
          context.beginPath();

          context.fillStyle = "#000";

          context.rect(j * boxSize, i * boxSize, boxSize, boxSize);

          context.fill();
        } else if (openList.includes(grid[i][j])) {
          context.beginPath();

          context.fillStyle = "#00aa00";

          context.rect(j * boxSize, i * boxSize, boxSize, boxSize);

          context.fill();
        } else if (closedList.has(grid[i][j])) {
          context.beginPath();

          context.fillStyle = "#aa0000";

          context.rect(j * boxSize, i * boxSize, boxSize, boxSize);

          context.fill();
        }
      }
    }

    context.beginPath();

    context.fillStyle = "#0f0";

    context.rect(start.x * boxSize, start.y * boxSize, boxSize, boxSize);

    context.fill();

    context.beginPath();

    context.fillStyle = "#f00";

    context.rect(goal.x * boxSize, goal.y * boxSize, boxSize, boxSize);

    context.fill();
  }

  function drawGrid() {
    for (var i = 0; i < columns; i++) {
      for (var j = 0; j < rows; j++) {
        context.beginPath();
        context.moveTo(i * boxSize, j * boxSize);
        context.lineTo(i * boxSize + boxSize, j * boxSize);
        context.moveTo(i * boxSize, j * boxSize);
        context.lineTo(i * boxSize, j * boxSize + boxSize);
        context.moveTo(i * boxSize + boxSize, j * boxSize + boxSize);
        context.lineTo(i * boxSize, j * boxSize + boxSize);
        context.moveTo(i * boxSize + boxSize, j * boxSize + boxSize);
        context.lineTo(i * boxSize + boxSize, j * boxSize);

        context.stroke();
      }
    }
  }

  function fillGrid() {
    for (var i = 0; i < rows; i++) {
      var row = [];
      for (var j = 0; j < columns; j++) {
        row.push(node.create(j, i));
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

var node = {
  obstacle: false,
  gCost: 0,
  hCost: 0,
  parent: null,
  x: 0,
  y: 0,

  create: function (x, y) {
    var obj = Object.create(this);
    obj.x = x;
    obj.y = y;
    obj.obstacle = false;
    obj.gCost = 0;
    obj.hCost = 0;
    return obj;
  },

  fCost: function () {
    return this.gCost + this.hCost;
  },

  setObstacle: function (obstacle) {
    this.obstacle = obstacle;
  },

  isObstacle: function () {
    return this.obstacle;
  },
};
