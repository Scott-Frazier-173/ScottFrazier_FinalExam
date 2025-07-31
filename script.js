let board = Array(9).fill("");  // Grid: 9 cells
let gemPosition = Math.floor(Math.random() * 9) + 1;  // 1–9
let found = false;

function renderBoard() {
  const table = document.getElementById("gameBoard");
  table.innerHTML = "";

  for (let row = 0; row < 3; row++) {
    const tr = document.createElement("tr");
    for (let col = 0; col < 3; col++) {
      const index = row * 3 + col;
      const td = document.createElement("td");
      td.textContent = board[index];
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
}

function handleGuess() {
  const input = document.getElementById("guess").value;
  const guess = parseInt(input);
  const msg = document.getElementById("message");

  if (isNaN(guess) || guess < 1 || guess > 9) {
    msg.textContent = "Please enter a number between 1 and 9.";
    return;
  }

  if (found) {
    msg.textContent = "You've already found the gem! Click 'Clear' to restart.";
    return;
  }

  if (guess === gemPosition) {
    board[guess - 1] = "X";
    msg.textContent = "🎉 You found the gem!";
    found = true;
  } else {
    if (board[guess - 1] === "") {
      board[guess - 1] = "O";
    }
    msg.textContent = "Try again!!";
  }

  renderBoard();
  document.getElementById("guess").value = "";
}

function resetGame() {
  board = Array(9).fill("");
  gemPosition = Math.floor(Math.random() * 9) + 1;
  found = false;
  document.getElementById("message").textContent = "";
  document.getElementById("guess").value = "";
  renderBoard();
}

// Initialize the board on load
renderBoard();
