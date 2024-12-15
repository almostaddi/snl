const board = document.getElementById('board');
const player = document.createElement('div');
player.classList.add('player');
board.appendChild(player);

const snakes = [
    { start: 17, end: 7 },
    { start: 54, end: 34 },
    { start: 62, end: 19 },
    { start: 98, end: 79 },
];

const ladders = [
    { start: 3, end: 22 },
    { start: 6, end: 25 },
    { start: 20, end: 59 },
    { start: 36, end: 55 },
    { start: 63, end: 95 },
    { start: 68, end: 91 },
];

const instructions = {
    1: "Clap your hands 10 times!",
    7: "Do 5 jumping jacks!",
    22: "Say 'Hello!' to everyone.",
    34: "Hop on one foot 3 times!",
    79: "Spin around twice!",
};

let playerPosition = 1; // Player starts at square 1

function drawBoard() {
    for (let i = 100; i > 0; i--) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.innerText = i;
        if (instructions[i]) {
            square.innerText += `\n(${instructions[i]})`;
        }
        board.appendChild(square);
    }
}

function drawSnakesAndLadders() {
    const boardBounds = board.getBoundingClientRect();

    function getCoords(squareNum) {
        // Calculate the row and column based on the square number
        const row = Math.floor((squareNum - 1) / 10);
        const col = (squareNum - 1) % 10;
        const x = (row % 2 === 0 ? col : 9 - col) * 60 + 30; // Alternating row direction
        const y = 540 - row * 60 + 30;
        return { x, y };
    }

    // Draw snakes
    snakes.forEach(snake => drawCurvyLine(getCoords(snake.start), getCoords(snake.end), 'red'));

    // Draw ladders
    ladders.forEach(ladder => drawStraightLine(getCoords(ladder.start), getCoords(ladder.end), 'green'));
}

function drawStraightLine(start, end, color) {
    const line = document.createElement('div');
    line.style.position = 'absolute';
    line.style.backgroundColor = color;
    line.style.zIndex = 1;
    line.style.left = `${Math.min(start.x, end.x)}px`;
    line.style.top = `${Math.min(start.y, end.y)}px`;
    line.style.width = `${Math.abs(end.x - start.x)}px`;
    line.style.height = `${Math.abs(end.y - start.y)}px`;
    line.style.transform = `rotate(${Math.atan2(end.y - start.y, end.x - start.x)}rad)`;
    board.appendChild(line);
}

function drawCurvyLine(start, end, color) {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    const path = document.createElementNS(svgNS, "path");

    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2 + 50; // Offset for curvature

    path.setAttribute("d", `M${start.x},${start.y} Q${midX},${midY} ${end.x},${end.y}`);
    path.setAttribute("stroke", color);
    path.setAttribute("stroke-width", "4");
    path.setAttribute("fill", "none");

    svg.style.position = "absolute";
    svg.style.left = "0";
    svg.style.top = "0";
    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.appendChild(path);

    board.appendChild(svg);
}

function movePlayer(to) {
    const coords = getCoords(to);
    player.style.transform = `translate(${coords.x - 10}px, ${coords.y - 10}px)`; // Adjust for dot size
}

function rollDice() {
    const dice = Math.floor(Math.random() * 6) + 1;
    const nextPosition = Math.min(100, playerPosition + dice);
    const previousPosition = playerPosition;
    playerPosition = nextPosition;

    animatePlayer(previousPosition, playerPosition);

    setTimeout(() => {
        checkSpecialSquares();
    }, 1000);
}

function checkSpecialSquares() {
    const snake = snakes.find(s => s.start === playerPosition);
    const ladder = ladders.find(l => l.start === playerPosition);

    if (snake) {
        animatePlayer(playerPosition, snake.end);
        playerPosition = snake.end;
    } else if (ladder) {
        animatePlayer(playerPosition, ladder.end);
        playerPosition = ladder.end;
    }
}

function animatePlayer(from, to) {
    const interval = 200;
    let current = from;

    function step() {
        if (current === to) return;

        current += (to > from ? 1 : -1);
        movePlayer(current);

        setTimeout(step, interval);
    }

    step();
}

drawBoard();
drawSnakesAndLadders();
movePlayer(1);
