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

let start;

let end;

let result;

const createWorld = () => {
    let xNew = Math.floor(Math.random() * 4);   //Returns a random number between 0 and 4
    if (xNew == xOld) { //Decreases randomness by not allowing two values that are the same (either 0, 2, or 3) to be returned one after the other
        xNew = 1;
    }
    xOld = xNew;
    return xNew;
};

for (let row = 0; row < 20; row++) {    //Sets the world array based on the values returned by createWorld() in a 20x20 grid
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

let worldGraph = JSON.parse(JSON.stringify(world)); //Copies the world array by converting it into a JSON string then parsing it back into an array to avoid copying the reference to the original array

for (let i = 0; i < worldGraph.length; i++) {   //Replaces all values in the worldGraph array that are not 1 or 0 with 1
    for (let a = 0; a < worldGraph[i].length; a++) {
        if (worldGraph[i][a] >= 2) {
            worldGraph[i][a] = 1;
        }
    }
}

let graph = new Graph(worldGraph);  //Creates an astar.js graph from the worldGraph array

const setStart = () => {    //Sets the starting position for astar.js
    start = graph.grid[ghost.y][ghost.x];
};

setStart();

const setEnd = () => {  //Sets the ending position for astar.js
    end = graph.grid[ninja.y][ninja.x];
};

setEnd();

const getResult = () => {   //Gets the full valid path from astar.js
    result = astar.search(graph, start, end);
    if (result.length == 0) {
        location.reload();
    }
};

getResult();

const drawWorld = () => {   //Creates the HTML for the game world from the original world array
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

const drawNinja = () => {   //Sets CSS style based on the player's position
    document.getElementById('ninja').style.left = ninja.x * 40 + 'px';
    document.getElementById('ninja').style.top = ninja.y * 40 + 'px';
};

drawNinja();

const drawGhost = () => {   //Sets SCC style based on the ghost's position
    document.getElementById('ghost').style.left = ghost.x * 40 + 'px';
    document.getElementById('ghost').style.top = ghost.y * 40 + 'px';
};

drawGhost();

const keepScore = () => {   //Sets the score based on the player's position
    if (world[ninja.y][ninja.x] == 2) {score += 10;}
    if (world[ninja.y][ninja.x] == 3) {score += 5;}
    document.getElementById('score').innerHTML = "Score: " + score;
};

const keepLives = () => {   //Resets the positions of the ghost and player and sets the "lives" HTML when invoked
    document.getElementById('lives').innerHTML = "Lives: " + lives;
    ninja.x = 1;
    ninja.y = 1;
    ghost.x = 10;
    ghost.y = 10;
};

const moveNinja = (e) => {  //Moves the player based on which key is pressed
    if (e.code == "ArrowLeft") {if (world[ninja.y][ninja.x - 1] != 0) {
        ninja.x--;}
    }
    if (e.code == "ArrowUp") {if (world[ninja.y - 1][ninja.x] != 0) {
        ninja.y--;}
    }
    if (e.code == "ArrowRight") {if (world[ninja.y][ninja.x + 1] != 0) {
        ninja.x++;}
    }
    if (e.code == "ArrowDown") {if (world[ninja.y + 1][ninja.x] != 0) {
        ninja.y++;}
    }

    if (world[ninja.y][ninja.x] != 1) { //Invokes keepScore and drawWorld if the player is on a 2 or 3 tile
        keepScore();
        world[ninja.y][ninja.x] = 1;
        drawWorld();
    }
};

const moveGhost = () => {   //Moves the ghost to the first coordinates supplied by the result array
    ghost.x = result[0].y;
    ghost.y = result[0].x;

    if (ninja.x == ghost.x && ninja.y == ghost.y) { //Invokes keepLives if the player's positon is equal to the ghost's position
        lives--;
        keepLives();
        if (lives == 0) {
            location.reload();
        }
    }
};

document.onkeydown = function(e) {  //Invokes the main functions when a defined key is pressed
    if (e.code == "ArrowLeft" || e.code == "ArrowUp" || e.code == "ArrowRight" || e.code == "ArrowDown") {
        moveNinja(e);
        moveGhost();

        drawNinja();
        drawGhost();

        setStart();
        setEnd();
        getResult();
    }
}