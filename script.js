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

let playerPosition = 1;

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
        const row = Math.floor((squareNum - 1) / 10);
        const col = (squareNum - 1) % 10;
        const x = col * 60 + 30;
        const y = 540 - row * 60 + 30;
        return { x, y };
    }

    snakes.forEach(snake => drawLine(getCoords(snake.start), getCoords(snake.end), 'red'));
    ladders.forEach(ladder => drawLine(getCoords(ladder.start), getCoords(ladder.end), 'green'));
}

function drawLine(start, end, color) {
    const line = document.createElement('div');
    line.classList.add(color === 'red' ? 'snake-path' : 'ladder-line');
    line.style.left = `${start.x}px`;
    line.style.top = `${start.y}px`;
    line.style.width = `${Math.abs(end.x - start.x)}px`;
    line.style.height = `${Math.abs(end.y - start.y)}px`;
    board.appendChild(line);
}

function movePlayer(to) {
    const coords = getCoords(to);
    player.style.transform = `translate(${coords.x}px, ${coords.y}px)`;
}

function rollDice() {
    const dice = Math.floor(Math.random() * 6) + 1;
    const nextPosition = Math.min(100, playerPosition + dice);
    playerPosition = nextPosition;
    movePlayer(playerPosition);

    if (snakes.some(s => s.start === player
