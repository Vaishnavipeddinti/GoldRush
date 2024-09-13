// Set up the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images for the game
const background = new Image();
background.src = '/static/images/background.png'; // Replace with your background image path

const rabbit = new Image();
rabbit.src = '/static/images/rabbit.png'; // Replace with your rabbit image path

const finishLine = new Image();
finishLine.src = '/static/images/ground.png'; // Replace with your finish line image path

// Opponent rabbits
const opponentRabbits = [
    { x: 100, y: 200, speed: 3, color: 'red' },
    { x: 200, y: 100, speed: 4, color: 'blue' },
    // Add more opponents as needed
];

// Rabbit's starting position and speed
let rabbitX = 50;
let rabbitY = 200;
const rabbitSpeed = 5;
let isGameOver = false;

// Finish line coordinates
const finishLineX = 700;
const finishLineY = 100;

// Game timer
let timeElapsed = 0;
let timerInterval;

// Listen for keyboard input
document.addEventListener('keydown', moveRabbit);

// Function to move the rabbit based on arrow keys
function moveRabbit(e) {
    if (isGameOver) return; // Prevent movement after game is over

    if (e.key === 'ArrowUp' && rabbitY > 0) {
        rabbitY -= rabbitSpeed;
    } else if (e.key === 'ArrowDown' && rabbitY < canvas.height - 50) {
        rabbitY += rabbitSpeed;
    } else if (e.key === 'ArrowLeft' && rabbitX > 0) {
        rabbitX -= rabbitSpeed;
    } else if (e.key === 'ArrowRight' && rabbitX < canvas.width - 50) {
        rabbitX += rabbitSpeed;
    }
}

// Function to move opponent rabbits
function moveOpponentRabbits() {
    opponentRabbits.forEach(rabbit => {
        rabbit.x += rabbit.speed;
        if (rabbit.x >= canvas.width) {
            rabbit.x = 0;
        }
    });
}

// Function to check for collision with the finish line
function checkFinishLineCollision() {
    if (rabbitX >= finishLineX && rabbitY >= finishLineY && rabbitY <= finishLineY + 100) {
        isGameOver = true;
        clearInterval(timerInterval);
        alert(`Congratulations! You reached the finish line in ${timeElapsed} seconds.`);
    }
}

// Function to draw the game elements on the canvas
function drawGame() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Draw the finish line
    ctx.drawImage(finishLine, finishLineX, finishLineY, 50, 100);

    // Draw the rabbit at its current position
    ctx.drawImage(rabbit, rabbitX, rabbitY, 50, 50);

    // Draw opponent rabbits
    opponentRabbits.forEach(rabbit => {
        ctx.fillStyle = rabbit.color;
        ctx.fillRect(rabbit.x, rabbit.y, 50, 50);
    });

    // Continue drawing the game as long as it's not over
    if (!isGameOver) {
        requestAnimationFrame(drawGame);
        timeElapsed += 1;
        moveOpponentRabbits();
        checkFinishLineCollision();
    }
}

// Start the game by calling the drawGame function
drawGame();