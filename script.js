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
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    87: 24,
    93: 73,
    95: 75,
    98: 78
};

const ladders = {
    3: 22,
    8: 30,
    15: 44,
    21: 42,
    28: 76,
    36: 57,
    51: 67,
    71: 92,
    78: 99
};

const instructionsList = {
    1: { text: "Start your journey!", img: "https://via.placeholder.com/50/0000FF/808080?text=Start" },
    2: { text: "Clap your hands 10 times.", img: "https://via.placeholder.com/50/0000FF/808080?text=Clap" },
    3: { text: "Jump 3 times.", img: "https://via.placeholder.com/50/0000FF/808080?text=Jump" },
    4: { text: "Do a little dance.", img: "https://via.placeholder.com/50/0000FF/808080?text=Dance" },
    5: { text: "Spin around once.", img: "https://via.placeholder.com/50/0000FF/808080?text=Spin" },
    6: { text: "Say 'Hello!' to everyone.", img: "https://via.placeholder.com/50/0000FF/808080?text=Hello" },
    7: { text: "Take a deep breath.", img: "https://via.placeholder.com/50/0000FF/808080?text=Breath" },
    8: { text: "Touch your toes.", img: "https://via.placeholder.com/50/0000FF/808080?text=Toes" },
    9: { text: "Hop like a bunny.", img: "https://via.placeholder.com/50/0000FF/808080?text=Hop" },
    10: { text: "Run in place for 10 seconds.", img: "https://via.placeholder.com/50/0000FF/808080?text=Run" },
    // Add more squares with unique instructions
};

let playerPosition = 1;
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
            board.appendChild(square);

            if (currentNumber === 1) {
                square.appendChild(player);
            }

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
    const finalPosition = isSnake || isLadder || nextPosition;

    animatePlayer(playerPosition, nextPosition, () => {
        playerPosition = nextPosition;

        if (isSnake || isLadder) {
            const message = isSnake
                ? `Oops! You landed on a snake. Sliding down to ${finalPosition}.`
                : `Great! You found a ladder. Climbing up to ${finalPosition}.`;

            instructions.textContent = message;

            // Add the "Continue" button
            document.body.appendChild(continueButton);
            continueButton.style.display = "block";

            // Wait for user to press the Continue button
            continueButton.onclick = () => {
                continueButton.style.display = "none";
                instructions.textContent = `You landed on ${finalPosition}.`;

                animatePlayer(nextPosition, finalPosition, () => {
                    playerPosition = finalPosition;
                    displayInstruction(finalPosition);
                    rollDiceButton.disabled = false;
                }, true);
            };
        } else {
            instructions.textContent = `You landed on ${finalPosition}.`;

            displayInstruction(finalPosition);

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

rollDiceButton.addEventListener('click', rollDice);

createBoard();
// Display instruction for square 1 when the page loads
displayInstruction(1);
