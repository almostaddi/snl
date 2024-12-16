const board = document.getElementById('board');
const diceResult = document.getElementById('diceResult');
const instructions = document.getElementById('instructions');
const rollDiceButton = document.getElementById('rollDice');
const continueButton = document.createElement('button');
continueButton.id = "continueButton";
continueButton.textContent = "Continue";

const boardSize = 10;
const totalSquares = boardSize * boardSize;
const player = document.createElement('div');
player.classList.add('player');

const snakes = {
    32: 10,
    36: 6,
    48: 26,
    88: 24,
    95: 56,
    97: 78
};

const ladders = {
    1: 38,
    4: 14,
    8: 30,
    21: 42,
    28: 74,
    50: 67,
    71: 92,
    80: 99
};

let instructionsList = {};  // Initially empty, will be loaded from the JSON file

let playerPosition = 0; // Start the player off the board
let isMoving = false;

function createBoard() {
    let reverse = false;
    let currentNumber = 1;

    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const actualCol = reverse ? boardSize - col - 1 : col;
            const square = document.createElement('div');
            square.classList.add('square');
            square.textContent = currentNumber;
            square.id = `square-${currentNumber}`;
            square.style.gridRow = boardSize - row;
            square.style.gridColumn = actualCol + 1;

            // Add the ladder or snake color
            if (snakes[currentNumber]) {
                square.classList.add('snake');
            } else if (ladders[currentNumber]) {
                square.classList.add('ladder');
            }

            board.appendChild(square);
            currentNumber++;
        }
        reverse = !reverse;
    }
}


function animatePlayer(start, end, callback, instant = false) {
    if (instant) {
        const targetSquare = document.getElementById(`square-${end}`);
        targetSquare.appendChild(player);
        if (callback) callback();
        return;
    }

    let current = start;
    const step = current < end ? 1 : -1;
    const interval = setInterval(() => {
        current += step;
        const currentSquare = document.getElementById(`square-${current}`);
        currentSquare.appendChild(player);

        if (current === end) {
            clearInterval(interval);
            if (callback) callback();
        }
    }, 200);
}


function rollDice() {
    rollDiceButton.disabled = true;

    const diceRoll = Math.floor(Math.random() * 6) + 1;
    diceResult.textContent = `Dice: ${diceRoll}`;

    let nextPosition = playerPosition + diceRoll;
    if (nextPosition > totalSquares) nextPosition = totalSquares;

    if (nextPosition === 100) {
        animatePlayer(playerPosition, nextPosition, () => {
            playerPosition = nextPosition;
            instructions.textContent = "Congratulations! You reached the final square!";
            rollDiceButton.disabled = true;
        });
        return;
    }

    const isSnake = snakes[nextPosition];
    const isLadder = ladders[nextPosition];
    const finalPosition = isSnake || isLadder ? (isSnake || isLadder) : nextPosition;

    // First display the instruction for the square the player is landing on
    animatePlayer(playerPosition, nextPosition, () => {
        playerPosition = nextPosition;

        // Display instruction for the square the player lands on
        instructions.textContent = `You landed on ${nextPosition}.`;
        displayInstruction(nextPosition);  // Show the instruction for the square

        let additionalMessage = '';
        let imageHtml = '';

        if (isSnake || isLadder) {
            const message = isSnake
                ? `Oops! You landed on a snake. Sliding down to ${finalPosition}.`
                : `Great! You found a ladder. Climbing up to ${finalPosition}.`;

            additionalMessage = message; // Save the snake/ladder message

            // Immediately display the snake/ladder message along with the regular instruction on a new line
            instructions.innerHTML += ` <br><strong>${additionalMessage}</strong>${imageHtml}`;

            // Add the "Continue" button
            document.body.appendChild(continueButton);
            continueButton.style.display = "block";

            // Wait for user to press the Continue button
            continueButton.onclick = () => {
                continueButton.style.display = "none";
                // Move the player to the final position after snake or ladder
                animatePlayer(nextPosition, finalPosition, () => {
                    playerPosition = finalPosition;

                    // After moving, display the instruction for the square after landing
                    instructions.innerHTML = `<div><strong>You landed on ${finalPosition}.</strong></div>`;
                    displayInstruction(finalPosition);  // Ensure the instruction for the new square is shown
                    rollDiceButton.disabled = false;
                }, true);
            };
        } else {
            if (playerPosition !== 100) {
                rollDiceButton.disabled = false;
            }
        }
    });
}


function displayInstruction(square) {
    const instruction = instructionsList[square];
    if (instruction) {
        instructions.innerHTML = `
            <div><img src="${instruction.img}" class="instruction-image" alt="Instruction"></div>
            <div class="instruction-text">${instruction.text}</div>
        `;
    }
}

function loadInstructions() {
    fetch('instructions.json')
        .then(response => response.json())
        .then(data => {
            instructionsList = data;
            displayInstruction(1); // Display instruction for square 1 after loading
        })
        .catch(error => {
            console.error('Error loading instructions:', error);
        });
}

rollDiceButton.addEventListener('click', rollDice);

createBoard();
loadInstructions();  // Load the instructions after the page loads
