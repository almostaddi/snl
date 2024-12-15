const board = document.getElementById("board");
const rollDiceBtn = document.getElementById("roll-dice");
const diceResult = document.getElementById("dice-result");
const playerPositionDisplay = document.getElementById("player-position");
const instructionsDisplay = document.getElementById("instructions");
const message = document.getElementById("message");

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

const instructions = [
    "Clap your hands 10 times",
    "Spin in a circle",
    "Touch your toes",
    "Say your favorite color",
    "Jump 5 times",
    "Do 3 push-ups",
    "Sing a song",
    "Snap your fingers 5 times",
    "Wave to the nearest person"
];

let playerPosition = 0;
let gameOver = false;

// Initialize Board
function initBoard() {
    for (let i = 100; i >= 1; i--) {
        const square = document.createElement("div");
        square.classList.add("square");
        square.id = `square-${i}`;
        square.innerHTML = `<div>${i}</div>`;
        board.appendChild(square);
    }

    drawSnakesAndLadders();
}

// Draw Snakes and Ladders
function drawSnakesAndLadders() {
    for (const [start, end] of Object.entries(snakes)) {
        drawLine(start, end, "snake-line");
    }
    for (const [start, end] of Object.entries(ladders)) {
        drawLine(start, end, "ladder-line");
    }
}

function drawLine(start, end, className) {
    const startSquare = document.getElementById(`square-${start}`);
    const endSquare = document.getElementById(`square-${end}`);
    const startRect = startSquare.getBoundingClientRect();
    const endRect = endSquare.getBoundingClientRect();
    const line = document.createElement("div");

    line.classList.add(className);
    line.style.left = `${startRect.left - board.offsetLeft + 30}px`;
    line.style.top = `${startRect.top - board.offsetTop + 30}px`;
    line.style.height = `${Math.abs(startRect.top - endRect.top)}px`;
    line.style.transform = `rotate(${Math.atan2(endRect.top - startRect.top, endRect.left - startRect.left) * (180 / Math.PI)}deg)`;

    board.appendChild(line);
}

// Move Player Gradually
async function movePlayer(newPosition) {
    const steps = Math.abs(newPosition - playerPosition);
    const stepDirection = newPosition > playerPosition ? 1 : -1;

    for (let i = 1; i <= steps; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        playerPosition += stepDirection;
        updatePlayerPosition();
    }
}

function updatePlayerPosition() {
    const oldSquare = document.querySelector(".player");
    if (oldSquare) oldSquare.remove();

    const square = document.getElementById(`square-${playerPosition}`);
    if (square) {
        const player = document.createElement("div");
        player.classList.add("player");
        square.appendChild(player);
    }

    playerPositionDisplay.textContent = `Position: ${playerPosition}`;
}

// Roll Dice
function rollDice() {
    if (gameOver) return;

    const dice = Math.floor(Math.random() * 6) + 1;
    diceResult.textContent = `Dice: ${dice}`;

    let newPosition = playerPosition + dice;
    if (newPosition > 100) newPosition = 100;

    if (snakes[newPosition]) {
        message.textContent = `Oh no! Snake down to ${snakes[newPosition]}`;
        newPosition = snakes[newPosition];
    } else if (ladders[newPosition]) {
        message.textContent = `Great! Ladder up to ${ladders[newPosition]}`;
        newPosition = ladders[newPosition];
    } else {
        message.textContent = "";
    }

    movePlayer(newPosition).then(() => {
        if (newPosition === 100) {
            message.textContent = "Congratulations! You win!";
            gameOver = true;
            rollDiceBtn.disabled = true;
        } else {
            instructionsDisplay.textContent = getInstruction();
        }
    });
}

function getInstruction() {
    return instructions[Math.floor(Math.random() * instructions.length)];
}

// Initialize Game
function startGame() {
    initBoard();
    updatePlayerPosition();
}

rollDiceBtn.addEventListener("click", rollDice);
window.onload = startGame;
