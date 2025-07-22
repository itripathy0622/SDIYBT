// Select elements
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const menu = document.getElementById('menu');
const gameCanvas = document.getElementById('gameCanvas');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScore = document.getElementById('finalScore');
const highScoreBtn = document.getElementById('highScoreBtn');
const leaderboardDiv = document.getElementById('leaderboard');




const ctx = gameCanvas.getContext('2d');

let mouseX = 0;
let mouseY = 0;
let isClicking = false;

let gameRunning = false;
let score = 0;
let lives = 3;

// Game objects array
let butts = [];

// Game obstacles
let obstacles = [];

// Shakes
let shakeDuration = 0;
let shakeIntensity = 5;

gameCanvas.addEventListener('mousemove', (e) => {
  const rect = gameCanvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

gameCanvas.addEventListener('mousedown', () => {
  isClicking = true;
});

gameCanvas.addEventListener('mouseup', () => {
  isClicking = false;
});

// Load butt image
const buttImg = new Image();
buttImg.src = 'assets/butt.png'; 
const goldenButtImg = new Image();
goldenButtImg.src = 'assets/goldenbutt.png';

// Load heart image
const heartImg = new Image();
heartImg.src = 'assets/health_rose.png';

// Load hand images
const handOpenImg = new Image();
handOpenImg.src = 'assets/handOpen.png';
const handCurvedImg = new Image();
handCurvedImg.src = 'assets/handCurved.png';

// Load obstacles
const obstacleImgs = [];
const obstacleFilenames = ['poop.png'];

// Load background
const bgImg = new Image();
bgImg.src = 'assets/background.png';

obstacleFilenames.forEach(name => {
  const img = new Image();
  img.src = 'assets/' + name;
  obstacleImgs.push(img);
});

// Butt class
class Butt {
  constructor(x, y, speed, isGolden = false) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.isGolden = isGolden;

    this.width = 80;
    this.height = 50;

    this.health = isGolden ? 1 : Math.floor(Math.random() * 3) + 1;

    if (this.isGolden) {
      this.sparkles = [];
    }
  }

  update() {
    this.y += this.speed;

    if (this.isGolden) {
      // Add new sparkles randomly
      if (Math.random() < 0.3) {
        this.sparkles.push(new Sparkle(this.x + this.width / 2, this.y + this.height / 2));
      }

      // Update sparkles and remove dead ones
      this.sparkles = this.sparkles.filter(s => {
        s.update();
        return !s.isDead();
      });
    }
  }

  draw() {
    if (this.isGolden) {
      // Glow effect
      ctx.shadowColor = 'gold';
      ctx.shadowBlur = 20;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }

    const img = this.isGolden ? goldenButtImg : buttImg;
    ctx.drawImage(img, this.x, this.y, this.width, this.height);

    // Reset shadow after drawing
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;

    // Draw sparkles on golden butt
    if (this.isGolden) {
      this.sparkles.forEach(s => s.draw());
    }

    // Draw health overlay number for normal butts only
    if (!this.isGolden) {
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(this.health, this.x + this.width / 2, this.y + this.height / 2 + 7);
    }
  }
}

  class Obstacle {
    constructor(x, y, speed, img) {
      this.x = x;
      this.y = y;
      this.speed = speed;
      this.width = 50;
      this.height = 50;
      this.img = img;
    }
  
    draw() {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
  
    update() {
      this.y += this.speed;
    }
  }

  class Sparkle {
    constructor(x, y) {
      this.x = x + (Math.random() * 40 - 20); // jitter around butt
      this.y = y + (Math.random() * 40 - 20);
      this.radius = Math.random() * 2 + 1;
      this.opacity = 1;
      this.fadeRate = 0.03 + Math.random() * 0.02;
    }
  
    update() {
      this.opacity -= this.fadeRate;
    }
  
    draw() {
      if (this.opacity <= 0) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = `rgba(255, 255, 224, ${this.opacity})`; // pale yellow
      ctx.fill();
    }
  
    isDead() {
      return this.opacity <= 0;
    }
  }
  
// Start game
startBtn.addEventListener('click', () => {
  menu.style.display = 'none';
  gameCanvas.style.display = 'block';
  startGame();
});

// Restart game
restartBtn.addEventListener('click', () => {
  gameOverScreen.style.display = 'none';
  startGame();
});

// Start game function
function startGame() {
  butts = [];
  score = 0;
  lives = 3;
  gameRunning = true;
  spawnButt();
  spawnObstacle();
  gameLoop();
}

// Spawn new butt every 1.5s
function spawnButt() {
  if (!gameRunning) return;

  const x = Math.random() * (gameCanvas.width - 80);
  const isGolden = Math.random() < 0.05; // 5% chance

  const speed = isGolden ? 4 : 2; // golden butt falls twice as fast

  const newButt = new Butt(x, 0, speed, isGolden);

  // Golden butts only need 1 click
  if (isGolden) newButt.health = 1;

  butts.push(newButt);
  setTimeout(spawnButt, 1000);
}


// Game loop
function gameLoop() {
    if (!gameRunning) return;
  
    // Clear canvas
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // Apply shake if active
    if (shakeDuration > 0) {
      const dx = (Math.random() - 0.5) * shakeIntensity * 2;
      const dy = (Math.random() - 0.5) * shakeIntensity * 2;
      ctx.translate(dx, dy);
      shakeDuration--;
    }

    // Draw background image
    ctx.drawImage(bgImg, 0, 0, gameCanvas.width, gameCanvas.height);

  
    // Draw and update butts
    for (let i = 0; i < butts.length; i++) {
      const b = butts[i];
      b.update();
      b.draw();
  
      // Check if butt reached ground
      if (b.y + b.height >= gameCanvas.height) {
        // If not golden, lose a life
        if (!b.isGolden) {
          lives -= 1;
          triggerShake(); 
        }
        
        butts.splice(i, 1); 
        i--; 
      
        if (lives <= 0) {
          endGame();
          return;
        }
      }
      

        // Reset transform if shaken
        if (shakeDuration <= 0) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
      }
    
  
    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 50, 30);
  
    // Draw lives as hearts
    for (let i = 0; i < lives; i++) {
      ctx.drawImage(heartImg, 10 + i * 40, 50, 30, 30);
    }

    // Draw and update obstacles
for (let i = 0; i < obstacles.length; i++) {
  const o = obstacles[i];
  o.update();
  o.draw();

  // Remove if reaches bottom (optional: no penalty)
  if (o.y + o.height >= gameCanvas.height) {
    obstacles.splice(i, 1);
    i--;
  }
}
  
    // === Draw cursor on top, based on click state ===
    if (isClicking) {
      ctx.drawImage(handCurvedImg, mouseX - 16, mouseY - 16, 32, 32);
    } else {
      ctx.drawImage(handOpenImg, mouseX - 16, mouseY - 16, 32, 32);
    }
  
    // Loop again
    requestAnimationFrame(gameLoop);
  }

  function spawnObstacle() {
    if (!gameRunning) return;
    const x = Math.random() * (gameCanvas.width - 50);
    const img = obstacleImgs[Math.floor(Math.random() * obstacleImgs.length)];
    obstacles.push(new Obstacle(x, 0, 3, img));
    setTimeout(spawnObstacle, 3000);
  }

  function triggerShake(duration = 20, intensity = 5) {
    shakeDuration = duration;
    shakeIntensity = intensity;
  }   

  // Scoreboard 
  function saveScore(score) {
    // Get leaderboard array from localStorage or empty if none
    let leaderboard = JSON.parse(localStorage.getItem('personalLeaderboard')) || [];
  
    // Add new score
    leaderboard.push(score);
  
    // Sort scores descending
    leaderboard.sort((a, b) => b - a);
  
    // Keep top 10 only
    leaderboard = leaderboard.slice(0, 10);
  
    // Save back to localStorage
    localStorage.setItem('personalLeaderboard', JSON.stringify(leaderboard));
  }
  

//Handle clicks
gameCanvas.addEventListener('click', (e) => {
  const rect = gameCanvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  // First check obstacles
  for (let i = 0; i < obstacles.length; i++) {
    const o = obstacles[i];
    if (
      mouseX >= o.x &&
      mouseX <= o.x + o.width &&
      mouseY >= o.y &&
      mouseY <= o.y + o.height
    ) {
      obstacles.splice(i, 1);
      lives -= 1;
      triggerShake(15, 5); // call screen shake
      return; // exit immediately to prevent butt click on same click
    }
  }

  // Then check butts
  for (let i = 0; i < butts.length; i++) {
    const b = butts[i];
    if (
      mouseX >= b.x &&
      mouseX <= b.x + b.width &&
      mouseY >= b.y &&
      mouseY <= b.y + b.height
    ) {
      b.health -= 1;
  
      if (b.health <= 0) {
        // If golden, add a life
        if (b.isGolden) {
          lives += 1;
        }
  
        butts.splice(i, 1);
        score += 10;
      }
      break;
    }
  }  
});

function displayLeaderboard() {
  let leaderboard = JSON.parse(localStorage.getItem('personalLeaderboard')) || [];

  const leaderboardDiv = document.getElementById('leaderboard');
  leaderboardDiv.innerHTML = '<h3>Personal Leaderboard</h3>';

  if (leaderboard.length === 0) {
    leaderboardDiv.innerHTML += '<p>No scores yet!</p>';
    return;
  }

  const list = document.createElement('ol');
  leaderboard.forEach(score => {
    const item = document.createElement('li');
    item.textContent = score;
    list.appendChild(item);
  });

  leaderboardDiv.appendChild(list);
}

highScoreBtn.addEventListener('click', () => {
  // Toggle leaderboard visibility
  if (leaderboardDiv.style.display === 'none') {
    displayLeaderboard();
    leaderboardDiv.style.display = 'block';
  } else {
    leaderboardDiv.style.display = 'none';
  }
});

// End game
function endGame() {
  gameRunning = false;
  gameCanvas.style.display = 'none';
  gameOverScreen.style.display = 'block';
  finalScore.textContent = `Final Score: ${score}`;

  saveScore(score);  // <-- Save the score here
}


  
