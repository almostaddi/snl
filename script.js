const board = document.getElementById('board');
const rollDiceBtn = document.getElementById('roll-dice');
const diceResult = document.getElementById('dice-result');
const playerTurn = document.getElementById('player-turn');
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

let players = [
    { name: 'Player 1', position: 0, class: 'player1' },
    { name: 'Player 2', position: 0, class: 'player2' }
];

let currentPlayer = 0;
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
}

// Update Player Position
function updatePlayerPosition(player, newPos) {
    // Remove player from old position
    const oldSquare = document.getElementById(`square-${player.position}`);
    if (oldSquare) {
        const existingPlayer = oldSquare.querySelector(`.${player.class}`);
        if (existingPlayer) {
            existingPlayer.remove();
        }
    }

    player.position = newPos;

    // Add player to new position
    const newSquare = document.getElementById(`square-${player.position}`);
    if (newSquare) {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player', player.class);
        newSquare.appendChild(playerDiv);
    }
}

// Roll Dice
function rollDice() {
    if (gameOver) return;

    const dice = Math.floor(Math.random() * 6) + 1;
    diceResult.innerText = `Dice: ${dice}`;

    let newPos = players[currentPlayer].position + dice;
    if (newPos > 100) newPos = 100;

    // Check for snakes or ladders
    if (snakes[newPos]) {
        message.innerText = `${players[currentPlayer].name} got bitten by a snake! Moving down to ${snakes[newPos]}`;
        newPos = snakes[newPos];
    } else if (ladders[newPos]) {
        message.innerText = `${players[currentPlayer].name} climbed a ladder! Moving up to ${ladders[newPos]}`;
        newPos = ladders[newPos];
    } else {
        message.innerText = '';
    }

    updatePlayerPosition(players[currentPlayer], newPos);

    if (newPos === 100) {
        message.innerText = `${players[currentPlayer].name} wins!`;
        gameOver = true;
        rollDiceBtn.disabled = true;
        return;
    }

    // Switch to next player
    currentPlayer = (currentPlayer + 1) % players.length;
    playerTurn.innerText = `${players[currentPlayer].name}'s Turn`;
}

// Start Game
function startGame() {
    initBoard();
    players.forEach(player => updatePlayerPosition(player, 0));
    playerTurn.innerText = `${players[currentPlayer].name}'s Turn`;
}

rollDiceBtn.addEventListener('click', rollDice);

// Initialize the game on page load
window.onload = startGame;
