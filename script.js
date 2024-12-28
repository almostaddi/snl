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
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    98: 78,
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

function loadInstructions(selectedSets) {
    const instructionPromises = selectedSets.map(set => {
        return fetch(`${set}.json`) // Load the JSON for each selected set
            .then(response => response.json())
            .catch(error => {
                console.error(`Error loading ${set}:`, error);
                return {};  // Return an empty object if there's an error
            });
    });

    // Wait for all instruction sets to be loaded
    Promise.all(instructionPromises).then(instructionData => {
        // Flatten the instructions from all sets into a single array
        const allInstructions = instructionData.reduce((acc, data) => {
            return acc.concat(Object.values(data));  // Flatten the instructions into one array
        }, []);

// After loading, display a random instruction
displayRandomInstruction(allInstructions);  // Pass all instructions to display a random one
    });
}


function getSelectedInstructionSets() {
    // Get the IDs of the selected checkboxes (checkbox IDs should correspond to the JSON filenames)
    return Array.from(document.querySelectorAll('.dropdown-content input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.id);  // Get the id of each checked checkbox (e.g., 'instructionSet1', 'instructionSet2', etc.)
}


// Display a random instruction from the loaded instruction sets
function displayRandomInstruction(instructionsList) {
    if (instructionsList.length === 0) {
        instructions.innerHTML = '<div><strong>No instructions available!</strong></div>';
        return;
    }

    // Pick a random instruction from the merged list
    const randomInstruction = instructionsList[Math.floor(Math.random() * instructionsList.length)];

    // Display the random instruction text and image
    instructions.innerHTML = `<div>${randomInstruction.text}</div>`;
    instructions.innerHTML += `<img src="${randomInstruction.img}" alt="Instruction Image" />`;
}



function rollDice() {
    rollDiceButton.disabled = true;  // Disable the button immediately
    document.querySelector('.dropdown-btn').style.display = 'none';  // Hide the button

    const diceRoll = Math.floor(Math.random() * 6) + 1;  // Roll a 6-sided die
    diceResult.textContent = `Dice: ${diceRoll}`;  // Display the dice result

    let nextPosition = playerPosition + diceRoll;
    if (nextPosition > totalSquares) nextPosition = totalSquares;  // Prevent going beyond the last square

    let finalPosition = nextPosition;
    let showContinueButton = false;

    const isSnake = snakes[nextPosition];
    const isLadder = ladders[nextPosition];

    if (isSnake || isLadder) {
        finalPosition = isSnake ? snakes[nextPosition] : ladders[nextPosition];
        showContinueButton = true;  // Show the Continue button if there's a snake/ladder
    }

    // Animate player move to the new square
    animatePlayer(playerPosition, nextPosition, () => {
        playerPosition = nextPosition;

        // Load instructions based on the new position
        const selectedSets = getSelectedInstructionSets();
        if (selectedSets.length > 0) {
            loadInstructions(selectedSets);
        } else {
            instructions.innerHTML = '<div><strong>No instruction sets selected!</strong></div>';
        }

        // Handle "Continue" Button visibility and action
        if (showContinueButton) {
            document.body.appendChild(continueButton);
            continueButton.style.display = "block";  // Show the Continue button

            continueButton.onclick = () => {
                continueButton.style.display = "none";  // Hide after click

                // Animate player to the final position after "Continue" click
                animatePlayer(nextPosition, finalPosition, () => {
                    playerPosition = finalPosition;
                    // Re-enable the dice button
                    rollDiceButton.disabled = false;    

                    // Display the instruction for the final square
                    instructions.innerHTML = `<div><strong>You landed on ${finalPosition}.</strong></div>`;
                    displayRandomInstruction(finalPosition);  // Show instruction for final square
                }, true);  // Animate final position
            };
        } else {
            // Re-enable the dice button if no snake/ladder
            rollDiceButton.disabled = false;
        }
    });
}




// Dropdown logic
document.querySelector('.dropdown-btn').addEventListener('click', function(event) {
    const dropdownContent = document.querySelector('.dropdown-content');
    
    // Toggle the display property of the dropdown content
    dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
    
    // Prevent the click event from propagating to the document
    event.stopPropagation();
});

document.addEventListener('click', function(event) {
    const dropdownContent = document.querySelector('.dropdown-content');
    const dropdownButton = document.querySelector('.dropdown-btn');
    
    // If the click was outside the dropdown and the button, close the dropdown
    if (!dropdownContent.contains(event.target) && !dropdownButton.contains(event.target)) {
        dropdownContent.style.display = 'none';
    }
});

// Get the modal
var modal = document.getElementById("patchNotesModal");

// Get the button that opens the modal
var btn = document.getElementById("patchNotesBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close-btn")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


rollDiceButton.addEventListener('click', rollDice);

createBoard();
