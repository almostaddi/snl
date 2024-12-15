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

        path.style.left = `${Math.min(startRect.left, endRect.left) - board.offsetLeft}px`;
        path.style.top = `${Math.min(startRect.top, endRect.top) - board.offsetTop}px`;
        path.style.width = `${Math.abs(startRect.left - endRect.left)}px`;
        path.style.height = `${Math.abs(startRect.top - endRect.top)}px`;

        board.appendChild(path);
    }
}

// Move Player
function movePlayer(newPosition) {
    const oldSquare = document.getElementById(`square-${playerPosition}`);
    if (oldSquare) {
        const oldPlayer = oldSquare.querySelector('.player');
        if (oldPlayer) oldPlayer.remove();
    }

    const newSquare = document.getElementById(`square-${newPosition}`);
    if (newSquare) {
        const player = document.createElement('div');
        player.classList.add('player');
        newSquare.appendChild(player);
    }

    playerPosition = newPosition;
    playerPositionDisplay.innerText = `Position: ${playerPosition}`;
}

// Roll Dice
function rollDice() {
    if (gameOver) return;

    const dice = Math.floor(Math.random() * 6) + 1;
    diceResult.innerText = `Dice: ${dice}`;

    let newPosition = playerPosition + dice;
    if (newPosition > 100) newPosition = 100;

    if (snakes[newPosition]) {
        message.innerText = `Oh no! You hit a snake. Sliding down to ${snakes[newPosition]}.`;
        newPosition = snakes[newPosition];
    } else if (ladders[newPosition]) {
        message.innerText = `Great! You climbed a ladder to ${ladders[newPosition]}.`;
        newPosition = ladders[newPosition];
    } else {
        message.innerText = '';
    }

    movePlayer(newPosition);

    if (newPosition === 100) {
        message.innerText = 'Congratulations! You win!';
        gameOver = true;
        rollDiceBtn.disabled = true;
    }
}

// Start Game
function startGame() {
    initBoard();
    movePlayer(0);
}

rollDiceBtn.addEventListener('click', rollDice);

window.onload = startGame;
