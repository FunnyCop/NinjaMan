let xOld = 0;

let world = [[]];

let worldDict = {
    0: "wall",
    1: "blank",
    2: "sushi",
    3: "onigiri"
};

let ninja = {
    x: 1,
    y: 1
};

let ghost = {
    x: 10,
    y: 10,
};

let lives = 3;

let score = 0;

const createWorld = () => {
    let xNew = Math.floor(Math.random() * 4);
    if (xNew == xOld) {
        xNew = 1;
    }
    xOld = xNew;
    return xNew;
};

for (let row = 0; row < 20; row++) {
    world[row] = [];
    for (let column = 0; column < 20; column++) {
        if ((row == 0 || row == 19) || (column == 0 || column == 19)) {
            world[row][column] = 0;
        }
        else {
            world[row][column] = createWorld();
        }
    }
}

let worldGraph = JSON.parse(JSON.stringify(world));

for (let i = 0; i < worldGraph.length; i++) {
    for (let a = 0; a < worldGraph[i].length; a++) {
        if (worldGraph[i][a] >= 2) {
            worldGraph[i][a] = 1;
        }
    }
}

let graph = new Graph(worldGraph);

let start;

const setStart = () => {
    start = graph.grid[ghost.y][ghost.x];
};

setStart();

let end;

const setEnd = () => {
    end = graph.grid[ninja.y][ninja.x];
};

setEnd();

let result;

const getResult = () => {
    result = astar.search(graph, start, end);
    if (result.length == 0) {
        location.reload();
    }
};

getResult();

const drawWorld = () => {
    let output = "";
    for (let row = 0; row < world.length; row++) {
        output += "<div class = 'row'>";
        for (let column = 0; column < world[row].length; column++) {
            output += "<div class = '" + worldDict[world[row][column]] + "'></div>";
        }
        output += "</div>";
    }
    document.getElementById('world').innerHTML = output;
};

drawWorld();

const drawNinja = () => {
    document.getElementById('ninja').style.left = ninja.x * 40 + 'px';
    document.getElementById('ninja').style.top = ninja.y * 40 + 'px';
};

drawNinja();

const drawGhost = () => {
    document.getElementById('ghost').style.left = ghost.x * 40 + 'px';
    document.getElementById('ghost').style.top = ghost.y * 40 + 'px';
};

drawGhost();

const keepScore = () => {
    if (world[ninja.y][ninja.x] == 2) {score += 10;}
    if (world[ninja.y][ninja.x] == 3) {score += 5;}
    document.getElementById('score').innerHTML = "Score: " + score;
};

const keepLives = () => {
    document.getElementById('lives').innerHTML = "Lives: " + lives;
    ninja.x = 1;
    ninja.y = 1;
    ghost.x = 10;
    ghost.y = 10;
};

document.onkeydown = function(e) {
    if (e.keyCode == 37) {if (world[ninja.y][ninja.x - 1] != 0) {
        ninja.x--;}
    }
    if (e.keyCode == 38) {if (world[ninja.y - 1][ninja.x] != 0) {
        ninja.y--;}
    }
    if (e.keyCode == 39) {if (world[ninja.y][ninja.x + 1] != 0) {
        ninja.x++;}
    }
    if (e.keyCode == 40) {if (world[ninja.y + 1][ninja.x] != 0) {
        ninja.y++;}
    }

    ghost.x = result[0].y;
    ghost.y = result[0].x;

    if (world[ninja.y][ninja.x] != 1) {
        keepScore();
        world[ninja.y][ninja.x] = 1;
        drawWorld();
    }

    if (ninja.x == ghost.x && ninja.y == ghost.y) {
        lives--;
        keepLives();
        if (lives == 0) {
            location.reload();
        }
    }

    drawNinja();
    drawGhost();

    setStart();
    setEnd();
    getResult();
}