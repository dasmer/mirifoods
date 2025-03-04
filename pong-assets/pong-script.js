/*************************************************************
 * MIRI PONG - SINGLE PLAYER PONG GAME
 * Author: OpenAI (ChatGPT)
 * All in one file (HTML, CSS, JS)
 *************************************************************/

// ========= CANVAS & CONTEXT =========
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// We'll dynamically set the canvas dimensions in code for responsive scaling
let GAME_WIDTH = 600;   // Internal logic width
let GAME_HEIGHT = 400;  // Internal logic height

/*************************************************************
 * RESPONSIVE RESIZING
 * We'll maintain an internal game logic size (GAME_WIDTH x GAME_HEIGHT)
 * and scale it to the canvas actual size for rendering.
 *************************************************************/
function resizeGame() {
  // Maintain aspect ratio
  // This sets the canvas's actual pixels
  // while we keep an internal coordinate system
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
}

// Call resize on load
resizeGame();

// ======== GAME STATE VARIABLES ========
let paddleWidth = 10;
let paddleHeight = 70;

let leftPaddleX = 10;
let leftPaddleY = GAME_HEIGHT / 2 - paddleHeight / 2;

let rightPaddleX = GAME_WIDTH - paddleWidth - 10;
let rightPaddleY = GAME_HEIGHT / 2 - paddleHeight / 2;

// "Paneer block" (the ball) dimensions
let ballWidth = 30;
let ballHeight = 20;

// Positions and velocity
let ballX = GAME_WIDTH / 2 - ballWidth / 2;
let ballY = GAME_HEIGHT / 2 - ballHeight / 2;
let ballSpeedX = 5;
let ballSpeedY = 3;

// Scores
let playerScore = 0;
let computerScore = 0;
const winningScore = 5;
let gameOver = false;

// Pause control
let paused = true; // Start in paused state until "Start New Game" is clicked

// Track user input
let moveUpActive = false;
let moveDownActive = false;

// DOM Elements
const overlay = document.getElementById("overlay");
const finalScoreEl = document.getElementById("finalScore");
const startButton = document.getElementById("startButton");
const moveUpBtn = document.getElementById("moveUp");
const moveDownBtn = document.getElementById("moveDown");

// ======== LOGO IMAGE =========
const logo = new Image();
logo.src = 'pong-assets/logo.webp';
let logoLoaded = false;

logo.onload = () => {
  logoLoaded = true;
};

/*************************************************************
 * MAIN GAME LOOP
 *************************************************************/
function gameLoop() {
  if (!paused && !gameOver) {
    updatePositions();
    checkCollisions();
  }
  drawEverything();
  requestAnimationFrame(gameLoop);
}

function updatePositions() {
  // Move player paddle
  const paddleSpeed = 6;
  if (moveUpActive) {
    leftPaddleY -= paddleSpeed;
  } 
  if (moveDownActive) {
    leftPaddleY += paddleSpeed;
  }

  // Clamp paddle
  if (leftPaddleY < 0) leftPaddleY = 0;
  if (leftPaddleY + paddleHeight > GAME_HEIGHT) {
    leftPaddleY = GAME_HEIGHT - paddleHeight;
  }

  // Move the "paneer block"
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Simple AI for right paddle (computer)
  // Reduced speed for easier gameplay
  let paddleCenter = rightPaddleY + paddleHeight / 2;
  if (paddleCenter < ballY) {
    rightPaddleY += 2.0; // Reduced from 3.5 to 2.0
  } else if (paddleCenter > ballY) {
    rightPaddleY -= 2.0; // Reduced from 3.5 to 2.0
  }
  // Clamp the computer's paddle
  if (rightPaddleY < 0) rightPaddleY = 0;
  if (rightPaddleY + paddleHeight > GAME_HEIGHT) {
    rightPaddleY = GAME_HEIGHT - paddleHeight;
  }
}

function checkCollisions() {
  // Bounce the paneer block off top/bottom
  if (ballY <= 0) {
    ballSpeedY = -ballSpeedY;
    ballY = 0;
  } else if (ballY + ballHeight >= GAME_HEIGHT) {
    ballSpeedY = -ballSpeedY;
    ballY = GAME_HEIGHT - ballHeight;
  }

  // Check left paddle collision
  if (
    ballX <= leftPaddleX + paddleWidth &&
    ballX + ballWidth >= leftPaddleX &&
    ballY + ballHeight >= leftPaddleY &&
    ballY <= leftPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    ballX = leftPaddleX + paddleWidth; // reposition to avoid stuck
  }

  // Check right paddle collision
  if (
    ballX + ballWidth >= rightPaddleX &&
    ballX <= rightPaddleX + paddleWidth &&
    ballY + ballHeight >= rightPaddleY &&
    ballY <= rightPaddleY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    ballX = rightPaddleX - ballWidth; // reposition to avoid stuck
  }

  // Check if ball out of left side
  if (ballX < 0) {
    computerScore++;
    resetBall();
  }

  // Check if ball out of right side
  if (ballX + ballWidth > GAME_WIDTH) {
    playerScore++;
    resetBall();
  }

  // Check winning condition
  if (playerScore >= winningScore || computerScore >= winningScore) {
    endGame();
  }
}

/*************************************************************
 * DRAW ALL GAME OBJECTS
 *************************************************************/
function drawEverything() {
  // Clear screen
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Draw Logo in the center if loaded (behind paneer)
  if (logoLoaded) {
    const logoWidth = 100; // Adjust the width as needed
    const logoHeight = 100; // Adjust the height as needed
    const logoX = (GAME_WIDTH - logoWidth) / 2;
    const logoY = (GAME_HEIGHT - logoHeight) / 2;
    ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);

    // Draw "MIRI PONG" below the logo
    ctx.font = "900 24px 'Rubik', sans-serif"; // Use Rubik font with weight 900
    ctx.fillStyle = "#ff6f00"; // Match the theme color
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("MIRI PONG", GAME_WIDTH / 2, logoY + logoHeight + 10); // Position below the logo
  }

  // Draw left paddle
  ctx.fillStyle = "#ff6f00"; // Changed from "white" to "#ff6f00"
  ctx.fillRect(leftPaddleX, leftPaddleY, paddleWidth, paddleHeight);

  // Draw right paddle
  ctx.fillStyle = "#ff6f00"; // Changed from "white" to "#ff6f00"
  ctx.fillRect(rightPaddleX, rightPaddleY, paddleWidth, paddleHeight);

  // Draw the "paneer block" labeled "MIRI"
  ctx.fillStyle = "#ff6f00"; // Changed from "white" to "#ff6f00"
  ctx.fillRect(ballX, ballY, ballWidth, ballHeight);

  // Draw text "MIRI" on the rectangle with updated color
  ctx.fillStyle = "#4a3f35"; // Updated text color to #4a3f35
  ctx.font = "bold 12px sans-serif"; // Adjusted font size for better fit
  ctx.textAlign = "center"; // Center horizontally
  ctx.textBaseline = "middle"; // Center vertically
  const text = "MIRI";
  ctx.fillText(text, ballX + ballWidth / 2, ballY + ballHeight / 2);

  // Display scores with labels
  ctx.fillStyle = "#ff6f00"; // Changed score text color to match paddles and ball
  ctx.font = "16px 'Rubik', sans-serif"; // Updated to use Rubik font
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(`You: ${playerScore}`, 20, 20);

  ctx.textAlign = "right";
  ctx.fillText(`Computer: ${computerScore}`, GAME_WIDTH - 20, 20);

  // Optionally display "PAUSED" if paused
  if (paused && !gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    ctx.fillStyle = "#ff6f00"; // Changed paused text color to match theme
    ctx.font = "24px 'Rubik', sans-serif"; // Use Rubik font for consistency
    ctx.textAlign = "center"; // Ensure center alignment
    ctx.textBaseline = "middle"; // Ensure middle alignment
    ctx.fillText("PAUSED", GAME_WIDTH / 2, GAME_HEIGHT / 2);
  }
}

/*************************************************************
 * HELPER FUNCTIONS
 *************************************************************/
function resetBall() {
  // Reverse the horizontal direction
  ballSpeedX = -ballSpeedX;
  // Randomize the vertical speed direction
  ballSpeedY = (Math.random() > 0.5 ? 1 : -1) * 3;

  // Set the ball's starting X position based on its direction
  if (ballSpeedX > 0) {
    // If moving right, start from the left side
    ballX = leftPaddleX + paddleWidth;
  } else {
    // If moving left, start from the right side
    ballX = rightPaddleX - ballWidth;
  }

  // Center the ball vertically
  ballY = GAME_HEIGHT / 2 - ballHeight / 2;
}

function resetPaddlesAndScore() {
  leftPaddleY = GAME_HEIGHT / 2 - paddleHeight / 2;
  rightPaddleY = GAME_HEIGHT / 2 - paddleHeight / 2;
  playerScore = 0;
  computerScore = 0;
  gameOver = false;
}

function endGame() {
  gameOver = true;
  paused = true;
  finalScoreEl.innerText = `Final Score: You ${playerScore} - Computer ${computerScore}`;
  overlay.style.display = "flex";
}

/*************************************************************
 * EVENT HANDLERS
 *************************************************************/
// Handle "Start New Game" button
startButton.addEventListener("click", () => {
  resetPaddlesAndScore();
  resetBall();
  overlay.style.display = "none";
  finalScoreEl.innerText = "";
  paused = false;
});

// Keyboard Controls
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      moveUpActive = true;
      break;
    case "ArrowDown":
    case "s":
    case "S":
      moveDownActive = true;
      break;
    case " ": // Space bar - pause/unpause
      togglePause();
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      moveUpActive = false;
      break;
    case "ArrowDown":
    case "s":
    case "S":
      moveDownActive = false;
      break;
  }
});

// Touch/mouse controls - tap game area to pause
canvas.addEventListener("click", togglePause);
canvas.addEventListener("touchstart", (e) => {
  // If user taps the canvas, pause/unpause
  e.preventDefault();
  togglePause();
});

// Mobile/Accessibility Buttons
moveUpBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveUpActive = true;
});
moveUpBtn.addEventListener("touchend", (e) => {
  e.preventDefault();
  moveUpActive = false;
});
moveUpBtn.addEventListener("mousedown", () => {
  moveUpActive = true;
});
moveUpBtn.addEventListener("mouseup", () => {
  moveUpActive = false;
});
// Similarly for Down
moveDownBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveDownActive = true;
});
moveDownBtn.addEventListener("touchend", (e) => {
  e.preventDefault();
  moveDownActive = false;
});
moveDownBtn.addEventListener("mousedown", () => {
  moveDownActive = true;
});
moveDownBtn.addEventListener("mouseup", () => {
  moveDownActive = false;
});

// Pause function
function togglePause() {
  if (gameOver) return; // can't toggle pause if game is over
  paused = !paused;
}

// Start the rendering loop
requestAnimationFrame(gameLoop);
