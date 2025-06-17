let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
let seconds = 0;
let timerInterval = setInterval(updateTimer, 1000);
let previousGuesses = [];
let gameOver = false;

function updateTimer() {
  if (gameOver) return;
  seconds++;
  document.getElementById("timer").textContent = `Time: ${seconds}s`;
}

function updatePreviousGuesses() {
  const prevDiv = document.getElementById("previousGuesses");
  if (previousGuesses.length === 0) {
    prevDiv.textContent = "Previous guesses: None";
  } else {
    prevDiv.textContent = "Previous guesses: " + previousGuesses.join(", ");
  }
}

function checkGuess() {
  if (gameOver) return;
  const guessInput = document.getElementById("guessInput");
  const guess = parseInt(guessInput.value);
  const feedback = document.getElementById("feedback");
  const attemptsDisplay = document.getElementById("attempts");

  if (isNaN(guess) || guess < 1 || guess > 100) {
    feedback.textContent = "Please enter a number between 1 and 100.";
    return;
  }

  attempts++;
  previousGuesses.push(guess);
  updatePreviousGuesses();

  if (guess < randomNumber) {
    feedback.textContent = "Too low. Try again.";
  } else if (guess > randomNumber) {
    feedback.textContent = "Too high. Try again.";
  } else {
    feedback.textContent = `Correct! You guessed it in ${attempts} attempts and ${seconds} seconds.`;
    clearInterval(timerInterval);
    gameOver = true;
    toggleInput(false);
  }

  attemptsDisplay.textContent = `Attempts: ${attempts}`;
  guessInput.value = "";
  guessInput.focus();
}

function resetGame() {
  randomNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 0;
  seconds = 0;
  previousGuesses = [];
  gameOver = false;
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
  document.getElementById("feedback").textContent = "";
  document.getElementById("attempts").textContent = "Attempts: 0";
  document.getElementById("timer").textContent = "Time: 0s";
  document.getElementById("guessInput").value = "";
  updatePreviousGuesses();
  toggleInput(true);
  document.getElementById("guessInput").focus();
}

function giveUp() {
  if (gameOver) return;
  const feedback = document.getElementById("feedback");
  feedback.textContent = `You gave up! The number was ${randomNumber}.`;
  clearInterval(timerInterval);
  gameOver = true;
  toggleInput(false);
}

function toggleInput(enable) {
  document.getElementById("guessInput").disabled = !enable;
  document.getElementById("submitBtn").disabled = !enable;
  document.getElementById("giveUpBtn").disabled = !enable;
}

// Submit button click
document.getElementById("submitBtn").addEventListener("click", checkGuess);
// Give Up button click
document.getElementById("giveUpBtn").addEventListener("click", giveUp);
// Keyboard usability: Enter key submits guess
document.getElementById("guessInput").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    checkGuess();
  }
});

// Initialize previous guesses display and focus input at start
updatePreviousGuesses();
document.getElementById("guessInput").focus();