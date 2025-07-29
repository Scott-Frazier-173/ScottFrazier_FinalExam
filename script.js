const board = document.getElementById('game-board');
const message = document.getElementById('message');
const resetBtn = document.getElementById('reset-btn');
const guessInput = document.getElementById('guess-input');
const guessBtn = document.getElementById('guess-btn');

let gemPosition = null;
let gameOver = false;
let cellValues = []; // Array to store cell states: empty, "O", or "X"

function initGame() {
  board.innerHTML = '';
  message.textContent = '';
  gameOver = false;
  guessInput.value = '';
  guessInput.disabled = false;
  guessBtn.disabled = false;

  // Initialize cell values array (all empty)
  cellValues = new Array(9).fill('');

  // Place the gem randomly using the suggested formula (1-9, but store as 0-8 internally)
  const min = 0;
  const max = 8;
  gemPosition = Math.floor(Math.random() * (max - min + 1)) + min;

  renderBoard();
}

function renderBoard() {
  board.innerHTML = '';
  
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;
    cell.textContent = cellValues[i] || (i + 1); // Show cell number or O/X
    
    // Add appropriate styling
    if (cellValues[i] === 'O') {
      cell.classList.add('guessed');
    } else if (cellValues[i] === 'X') {
      cell.classList.add('gem');
    }
    
    board.appendChild(cell);
  }
}

function handleGuess() {
  if (gameOver) return;
  
  const guessValue = parseInt(guessInput.value);
  
  // Validate input
  if (isNaN(guessValue) || guessValue < 1 || guessValue > 9) {
    message.textContent = 'Please enter a valid number between 1 and 9.';
    return;
  }
  
  const cellIndex = guessValue - 1; // Convert to 0-based index
  
  // Check if cell already guessed
  if (cellValues[cellIndex] !== '') {
    message.textContent = 'You already guessed that cell. Try another number.';
    return;
  }
  
  // Make the guess
  if (cellIndex === gemPosition) {
    // Found the gem!
    cellValues[cellIndex] = 'X';
    message.textContent = 'Congratulations! You found the hidden gem!';
    gameOver = true;
    guessInput.disabled = true;
    guessBtn.disabled = true;
  } else {
    // Wrong guess
    cellValues[cellIndex] = 'O';
    message.textContent = 'Try again!!';
  }
  
  renderBoard();
  guessInput.value = '';
}

// Event listeners
guessBtn.addEventListener('click', handleGuess);
guessInput.addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    handleGuess();
  }
});

resetBtn.addEventListener('click', initGame);

window.onload = initGame;