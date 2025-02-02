export const global = {
  canvas: document.getElementById('gameCanvas'),
  ctx: document.getElementById('gameCanvas').getContext('2d'),
  gravity: 1,
  deltaTime: 0,
  allGameObjects: [],
  playerObject: {},

  // Health and timer variables
  gameTimer: 60,
  gameInterval: null,

  // Backgrounds
  menuBackground: new Image(),
  gameBackground: new Image(),
  currentBackground: null,

  // Initialize canvas with fixed height and dynamic width
  initializeCanvas() {
    this.canvas.height = 720; // Fixed canvas height
    this.canvas.width = window.innerWidth; // Full width of the viewport
  },

  // Draw current background
  drawBackground() {
    if (this.currentBackground) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this.currentBackground, 0, 0, this.canvas.width, this.canvas.height);
    }
  },

  // Set current background
  setCurrentBackground(background) {
    if (this.currentBackground !== background) {
      this.currentBackground = background;
      this.drawBackground();
    }
  },

  // Load background images
  loadBackgrounds() {
    this.menuBackground.src = '../images/backgroundtest.png';
    this.gameBackground.src = '../images/gameBackground.png';

    // Set default background to menu
    this.menuBackground.onload = () => {
      if (!this.currentBackground) {
        this.setCurrentBackground(this.menuBackground);
      }
    };
  },

  // Switch to menu background
  switchToMenuBackground() {
    this.setCurrentBackground(this.menuBackground);
  },

  // Switch to game background
  switchToGameBackground() {
    this.setCurrentBackground(this.gameBackground);
  },

  // Draw health bars for players
  drawHealthBars(player1, player2) {
    // Draw Player 1 health bar
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(75, 30, player1.health * 4, 30);
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(75, 30, 400, 30);

    // Draw Player 2 health bar
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(this.canvas.width - 475, 30, player2.health * 4, 30);
    this.ctx.strokeStyle = 'black';
    this.ctx.strokeRect(this.canvas.width - 475, 30, 400, 30);
  },

  // Draw timer
  drawTimer() {
    this.ctx.fillStyle = 'white';
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`Time: ${this.gameTimer}s`, this.canvas.width / 2, 60);
  },

  // Timer countdown
  startTimer() {
    this.gameInterval = setInterval(() => {
      this.gameTimer -= 1;
      if (this.gameTimer <= 0) {
        clearInterval(this.gameInterval);
        alert('Time is up! It\'s a draw!');
      }
    }, 1000);
  }
};



// Initialize canvas and load backgrounds when global is initialized
global.initializeCanvas();
global.loadBackgrounds();

// Update canvas dimensions when window is resized
window.addEventListener('resize', () => {
  global.initializeCanvas();
});
