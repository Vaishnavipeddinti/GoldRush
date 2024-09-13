// Set up the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const background = new Image();
background.src = '/static/images/background.png';

const menuBackground = new Image();
menuBackground.src = '/static/images/menu_background.png';

const playerRabbit = new Image();
playerRabbit.src = '/static/images/player_rabbit.png';

const redObstacle = new Image();
redObstacle.src = '/static/images/red_rabbit.png';

const blueObstacle = new Image();
blueObstacle.src = '/static/images/blue_rabbit.png';

const finishLine = new Image();
finishLine.src = '/static/images/finish_line.png';

const ground = new Image();
ground.src = '/static/images/ground.png';

// Game variables
let playerName = '';
let playerX = 50;
let playerY = 200;
let playerSpeed = 5;
let speedBoostTime = 0;
let level = 1;
const maxLevels = 5;

const finishLineWidth = 20;
let isGameOver = false;
let timeElapsed = 0;
let gameState = 'start'; // Can be 'start', 'menu', 'playing', 'gameOver', 'won', or 'nextLevel'

// Generate obstacles for the current level
function generateObstacles(level) {
    const obstacles = [];
    const obstacleCount = 5 + level; // Increase obstacles with each level
    for (let i = 0; i < obstacleCount; i++) {
        let x = Math.random() * (canvas.width - 100) + 50;
        let y = Math.random() * (canvas.height - 150) + 50;
        let speed = (Math.random() * 0.4 + 0.6) * (Math.random() < 0.5 ? 1 : -1) * (1 + level * 0.1); // Increase speed with each level
        let type = (Math.random() < 0.5 ? 'red' : 'blue');
        let image = type === 'red' ? redObstacle : blueObstacle;
        obstacles.push({ x, y, speed, type, image });
    }
    return obstacles;
}

let obstacles = generateObstacles(level);

// Move the player based on key input
function movePlayer(e) {
    if (isGameOver) return;

    let moveDistance = playerSpeed;

    if (e.key === 'ArrowUp' && playerY > 0) {
        playerY -= moveDistance;
    } else if (e.key === 'ArrowDown' && playerY < canvas.height - 50) {
        playerY += moveDistance;
    } else if (e.key === 'ArrowLeft' && playerX > 0) {
        playerX -= moveDistance;
    } else if (e.key === 'ArrowRight' && playerX < canvas.width - 50) {
        playerX += moveDistance;
    }
}

// Move obstacles
function moveObstacles() {
    obstacles.forEach(obstacle => {
        obstacle.y += obstacle.speed;
        if (obstacle.y <= 0 || obstacle.y >= canvas.height - 50) {
            obstacle.speed = -obstacle.speed;
        }
    });
}

// Check for collisions
function checkCollisions() {
    obstacles.forEach(obstacle => {
        if (playerX < obstacle.x + 40 &&
            playerX + 40 > obstacle.x &&
            playerY < obstacle.y + 40 &&
            playerY + 40 > obstacle.y) {
            if (obstacle.type === 'red') {
                gameState = 'gameOver';
            } else if (obstacle.type === 'blue') {
                playerSpeed = 10;
                speedBoostTime = 3;
                obstacle.x = canvas.width;
            }
        }
    });
}

// Update speed boost time
function updateSpeedBoost() {
    if (speedBoostTime > 0) {
        speedBoostTime -= 1/60;
        if (speedBoostTime <= 0) {
            playerSpeed = 5;
        }
    }
}

// Check if the player has reached the finish line
function checkWinCondition() {
    if (playerX >= canvas.width - finishLineWidth - 30) {
        console.log(`Win condition met. Current level: ${level}, Max levels: ${maxLevels}`);
        if (level < maxLevels) {
            console.log('Moving to next level');
            gameState = 'nextLevel';
        } else {
            console.log('Game won');
            gameState = 'won';
        }
    }
}

// Draw the starting menu
function drawStartMenu() {
    ctx.drawImage(menuBackground, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Welcome to Rabbit Race!', canvas.width / 2, canvas.height / 3);

    ctx.font = '24px Arial';
    ctx.fillText('Enter your bunny name:', canvas.width / 2, canvas.height / 2 - 30);

    // Draw input box
    ctx.fillStyle = 'white';
    ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2, 300, 40);

    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.fillText(playerName, canvas.width / 2 - 145, canvas.height / 2 + 30);

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Press ENTER when done', canvas.width / 2, canvas.height / 2 + 80);
}

// Draw the menu screen
function drawMenu() {
    ctx.drawImage(menuBackground, 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Welcome, ${playerName}!`, canvas.width / 2, canvas.height / 2 - 80);
    ctx.fillText('Rabbit Race Game', canvas.width / 2, canvas.height / 2 - 40);

    ctx.font = '24px Arial';
    ctx.fillText('Press SPACE to Start', canvas.width / 2, canvas.height / 2 + 40);

    ctx.font = '18px Arial';
    ctx.fillText('Use arrow keys to move', canvas.width / 2, canvas.height / 2 + 80);
    ctx.fillText('Avoid bombs, catch carrots for speed boost', canvas.width / 2, canvas.height / 2 + 110);
}

// Draw the game over screen
function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 40);

    ctx.font = '24px Arial';
    ctx.fillText(`Your Time: ${timeElapsed.toFixed(2)}s`, canvas.width / 2, canvas.height / 2);
    ctx.fillText(`You reached level ${level}`, canvas.width / 2, canvas.height / 2 + 40);
    ctx.fillText('Press SPACE to Retry', canvas.width / 2, canvas.height / 2 + 80);
}

// Draw the win screen
function drawWin() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Congratulations! You Won!', canvas.width / 2, canvas.height / 2 - 60);

    ctx.font = '24px Arial';
    ctx.fillText(`${playerName}, you're the fastest rabbit!`, canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText(`Your Time: ${timeElapsed.toFixed(2)}s`, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('Press SPACE to Play Again', canvas.width / 2, canvas.height / 2 + 60);
}

// Draw the next level screen
function drawNextLevel() {
    console.log(`Drawing next level screen. Current level: ${level}`);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`Level ${level} Completed!`, canvas.width / 2, canvas.height / 2 - 60);

    ctx.font = '24px Arial';
    ctx.fillText(`Great job, ${playerName}!`, canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText(`Time so far: ${timeElapsed.toFixed(2)}s`, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText('Press SPACE to Continue', canvas.width / 2, canvas.height / 2 + 60);
}

// Reset the game
function resetGame() {
    playerX = 50;
    playerY = 200;
    playerSpeed = 5;
    speedBoostTime = 0;
    isGameOver = false;
    timeElapsed = 0;
    level = 1;
    obstacles = generateObstacles(level);
}
// Start next level
function startNextLevel() {
    if (level < maxLevels) {
        level++;
        console.log(`Starting level ${level}`);
        playerX = 50;
        playerY = 200;
        obstacles = generateObstacles(level);
        gameState = 'playing';
    } else {
        console.log('All levels completed. Game won!');
        gameState = 'won';
    }
}


// Draw the game
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameState === 'start') {
        drawStartMenu();
    } else if (gameState === 'menu') {
        drawMenu();
    } else if (gameState === 'playing') {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(ground, 0, canvas.height - 50, canvas.width, 50);
        ctx.drawImage(finishLine, canvas.width - finishLineWidth, 0, finishLineWidth, canvas.height);
        ctx.drawImage(playerRabbit, playerX, playerY, 50, 50);

        obstacles.forEach(obstacle => {
            ctx.drawImage(obstacle.image, obstacle.x, obstacle.y, 50, 50);
        });

        if (speedBoostTime > 0) {
            ctx.fillStyle = 'yellow';
            ctx.font = 'bold 20px Arial';
            ctx.fillText('SPEED BOOST!', playerX, playerY - 10);
        }

        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Time: ${timeElapsed.toFixed(2)}s`, 10, 30);
        ctx.fillText(`Level: ${level}/${maxLevels}`, 10, 60);
        ctx.fillText(`Player: ${playerName}`, 10, 90);
        timeElapsed += 1/60;
        moveObstacles();
        checkCollisions();
        updateSpeedBoost();
        checkWinCondition();
    } 
    else if (gameState === 'gameOver') {
        drawGameOver();
    } else if (gameState === 'won') {
        drawWin();
    } else if (gameState === 'nextLevel') {
        drawNextLevel();
    }

    requestAnimationFrame(drawGame);
}

// Event listener for keyboard input
document.addEventListener('keydown', (e) => {
    if (gameState === 'start') {
        if (e.key === 'Enter') {
            if (playerName.trim() !== '') {
                gameState = 'menu';
            }
        } else if (e.key === 'Backspace') {
            playerName = playerName.slice(0, -1);
        } else if (e.key.length === 1) {
            playerName += e.key;
        }
    } else if (gameState === 'playing') {
        movePlayer(e);
    } else if (gameState === 'menu' || gameState === 'gameOver' || gameState === 'won') {
        if (e.code === 'Space') {
            gameState = 'playing';
            resetGame();
        }
    } else if (gameState === 'nextLevel' && e.code === 'Space') {
        startNextLevel();
    }
});

// Initialize game
drawGame();
