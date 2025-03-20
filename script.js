const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game Variables
let birdY = canvas.height / 2;
let birdVelocity = 0;
let gravity = 0.5;
let birdLift = -10;
let birdRadius = 20;
let gameSpeed = 2;
let isGameOver = false;

// Pipe Variables
let pipeWidth = 60;
let pipeGap = 200;
let pipes = [];

const bird = new Image();
bird.src = 'https://example.com/bird.png';  // Put your own bird image here or use a simple shape

// Bird Flap Function
document.addEventListener('click', () => {
  if (isGameOver) {
    resetGame();  // Reset the game if it's over
  } else {
    birdVelocity = birdLift;  // Flap the bird if the game is ongoing
  }
});

// Game Reset Function
function resetGame() {
  birdY = canvas.height / 2;
  birdVelocity = 0;
  pipes = [];
  isGameOver = false;
  gameLoop();  // Restart the game loop after resetting
}

// Pipe Generation
function generatePipes() {
  if (pipes.length === 0 || pipes[pipes.length - 1].x <= canvas.width - 250) {
    const pipeHeight = Math.random() * (canvas.height - pipeGap);
    pipes.push({
      x: canvas.width,
      topHeight: pipeHeight,
      bottomHeight: canvas.height - pipeHeight - pipeGap,
    });
  }
}

// Move Pipes and Check Collision
function movePipes() {
  for (let i = 0; i < pipes.length; i++) {
    pipes[i].x -= gameSpeed;
    
    // Check for collision
    if (pipes[i].x <= birdRadius && pipes[i].x + pipeWidth >= birdRadius && 
      (birdY - birdRadius <= pipes[i].topHeight || birdY + birdRadius >= canvas.height - pipes[i].bottomHeight)) {
      isGameOver = true;
    }

    if (pipes[i].x + pipeWidth <= 0) {
      pipes.splice(i, 1);
    }
  }
}

// Update Bird Position
function updateBirdPosition() {
  birdVelocity += gravity;
  birdY += birdVelocity;

  // Game Over Conditions (if bird hits the ground or goes above canvas)
  if (birdY + birdRadius >= canvas.height || birdY - birdRadius <= 0) {
    isGameOver = true;
  }
}

// Draw the Game Elements
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw Pipes
  for (let i = 0; i < pipes.length; i++) {
    // Create a gradient for the pipe color
    let pipeTop = ctx.createLinearGradient(0, 0, 0, pipes[i].topHeight);
    pipeTop.addColorStop(0, "#00b300");  // Light green
    pipeTop.addColorStop(1, "#008000");  // Dark green

    let pipeBottom = ctx.createLinearGradient(0, canvas.height - pipes[i].bottomHeight, 0, canvas.height);
    pipeBottom.addColorStop(0, "#00b300");  // Light green
    pipeBottom.addColorStop(1, "#008000");  // Dark green

    // Top Pipe (using rounded corners)
    ctx.fillStyle = pipeTop;
    ctx.beginPath();
    ctx.moveTo(pipes[i].x + 10, 0); // Start 10px in to make the corners round
    ctx.lineTo(pipes[i].x + pipeWidth - 10, 0); // End 10px in to make the corners round
    ctx.arcTo(pipes[i].x + pipeWidth, 0, pipes[i].x + pipeWidth, pipes[i].topHeight, 10); // Right corner
    ctx.lineTo(pipes[i].x + pipeWidth, pipes[i].topHeight);
    ctx.lineTo(pipes[i].x, pipes[i].topHeight);
    ctx.arcTo(pipes[i].x, 0, pipes[i].x + 10, 0, 10); // Left corner
    ctx.fill();
    
    // Bottom Pipe (using rounded corners)
    ctx.fillStyle = pipeBottom;
    ctx.beginPath();
    ctx.moveTo(pipes[i].x + 10, canvas.height); // Start 10px in to make the corners round
    ctx.lineTo(pipes[i].x + pipeWidth - 10, canvas.height); // End 10px in to make the corners round
    ctx.arcTo(pipes[i].x + pipeWidth, canvas.height, pipes[i].x + pipeWidth, canvas.height - pipes[i].bottomHeight, 10); // Right corner
    ctx.lineTo(pipes[i].x + pipeWidth, canvas.height - pipes[i].bottomHeight);
    ctx.lineTo(pipes[i].x, canvas.height - pipes[i].bottomHeight);
    ctx.arcTo(pipes[i].x, canvas.height, pipes[i].x + 10, canvas.height, 10); // Left corner
    ctx.fill();
  }
  
  // Draw Bird
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(birdRadius, birdY, birdRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Game Over Text
  if (isGameOver) {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over! Click to Restart", 50, canvas.height / 2);
  }
}

// Main Game Loop
function gameLoop() {
  if (isGameOver) return; // Stop the game loop when game over

  generatePipes();
  movePipes();
  updateBirdPosition();
  drawGame();

  requestAnimationFrame(gameLoop);
}

// Start the Game
gameLoop();
