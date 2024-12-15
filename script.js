const board = document.getElementById('board');
const rollDiceBtn = document.getElementById('roll-dice');
const diceResult = document.getElementById('dice-result');
const playerPositionDisplay = document.getElementById('player-position');
const message = document.getElementById('message');

const snakes = {
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    98: 78
};

const ladders = {
    1: 38,
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100
};

let playerPosition = 0;
let gameOver = false;

// Initialize Board
function initBoard() {
    for (let i = 100; i >= 1; i--) {
        const square = document.createElement('div');
        square.classList.add('square');
        square.id = `square-${i}`;
        square.innerText = i;
        board.appendChild(square);
    }

    // Add visual representation for snakes and ladders
    for (const [start, end] of Object.entries(snakes)) {
        createPath(start, end, 'snake');
    }

    for (const [start, end] of Object.entries(ladders)) {
        createPath(start, end, 'ladder');
    }
}

// Create Snake or Ladder Path
function createPath(start, end, type) {
    const startSquare = document.getElementById(`square-${start}`);
    const endSquare = document.getElementById(`square-${end}`);

    if (startSquare && endSquare) {
        const path = document.createElement('div');
        path.classList.add(type);

        const startRect = startSquare.getBoundingClientRect();
        const endRect = endSquare.getBoundingClientRect();

        path.style.left = `${Math.min(start
