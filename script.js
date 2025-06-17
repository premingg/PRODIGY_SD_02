let randomNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
let seconds = 0;
let timerInterval = setInterval(updateTimer, 1000);
let previousGuesses = [];
let gameOver = false;

// High score storage keys
const HIGH_SCORE_ATTEMPTS_KEY = "numberGuessingHighScoreAttempts";
const HIGH_SCORE_TIME_KEY = "numberGuessingHighScoreTime";

function getHighScores() {
  return {
    attempts: parseInt(localStorage.getItem(HIGH_SCORE_ATTEMPTS_KEY)) || null,
    time: parseInt(localStorage.getItem(HIGH_SCORE_TIME_KEY)) || null,
  };
}

function setHighScores(newAttempts, newTime) {
  localStorage.setItem(HIGH_SCORE_ATTEMPTS_KEY, newAttempts);
  localStorage.setItem(HIGH_SCORE_TIME_KEY, newTime);
}

function updateHighScoreDisplay() {
  const highScore = getHighScores();
  document.getElementById("highScoreAttempts").textContent =
    "🏆 Best Attempts: " + (highScore.attempts !== null ? highScore.attempts : "--");
  document.getElementById("highScoreTime").textContent =
    "⏱️ Fastest Time: " + (highScore.time !== null ? highScore.time + "s" : "--");
}

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
    checkAndUpdateHighScore();
  }

  attemptsDisplay.textContent = `Attempts: ${attempts}`;
  guessInput.value = "";
  guessInput.focus();
}

function checkAndUpdateHighScore() {
  const highScore = getHighScores();
  let newHighScore = false;

  // If no high score yet, or beat existing in attempts or (if tied) time
  if (
    highScore.attempts === null ||
    attempts < highScore.attempts ||
    (attempts === highScore.attempts && (highScore.time === null || seconds < highScore.time))
  ) {
    setHighScores(attempts, seconds);
    newHighScore = true;
  }

  updateHighScoreDisplay();

  if (newHighScore) {
    document.getElementById("feedback").textContent += " 🎉 New High Score!";
  }
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
  updateHighScoreDisplay();
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

// Initialize previous guesses display, high score display, and focus input at start
updatePreviousGuesses();
updateHighScoreDisplay();
document.getElementById("guessInput").focus();
