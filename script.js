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
    80: 
