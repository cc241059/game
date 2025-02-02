import { global } from "./global.js";
import { Character } from "../gameObjects/character.js";
import { HealthPotionManager } from "../gameObjects/baseGameObject.js";

// Načítanie sprite sheetov pre animácie
// Načítanie sprite sheetov pre Player 1
const player1SpriteSheet = {
  idle: new Image(),
  run: new Image(),
  jump: new Image(),
  attack: new Image(),
};
player1SpriteSheet.idle.src = "../images/Sprites/Idle1.png";
player1SpriteSheet.run.src = "../images/Sprites/Run1.png";
player1SpriteSheet.jump.src = "../images/Sprites/Jump1.png";
player1SpriteSheet.attack.src = "../images/Sprites/Attack1.png";

// Načítanie sprite sheetov pre Player 2
const player2SpriteSheet = {
  idle: new Image(),
  run: new Image(),
  jump: new Image(),
  attack: new Image(),
};
player2SpriteSheet.idle.src = "../images/Sprites/Idle2.png";
player2SpriteSheet.run.src = "../images/Sprites/Run2.png";
player2SpriteSheet.jump.src = "../images/Sprites/Jump2.png";
player2SpriteSheet.attack.src = "../images/Sprites/Attack2.png";

// Inicializácia hráčov s rôznymi sprite sheetmi
const player1 = new Character(
  "Player 1",
  global.canvas.width * 0.1,
  global.canvas.height - 150,
  0,
  330,
  380,
  "red",
  player1SpriteSheet
);

const player2 = new Character(
  "Player 2",
  global.canvas.width - global.canvas.width * 0.3,
  global.canvas.height - 150,
  0,
  330,
  380,
  "blue",
  player2SpriteSheet
);
player2.lastDirection = "left"; // Otočenie smerom doľava


// Key controls
const keys = {
  a: false,
  d: false,
  w: false,
  s: false,
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
  ArrowDown: false,
};

// Inicializácia manažéra health potionov
const healthPotionManager = new HealthPotionManager(
  global.canvas.width,
  global.canvas.height
);

// Draw health bars and timer
function drawHealthBars() {
  global.drawHealthBars(player1, player2); // Použitie globálnej metódy
}

function drawTimer() {
  global.drawTimer(); // Použitie globálnej metódy
}

// Game loop
function gameLoop() {
  global.drawBackground();

  drawHealthBars();
  drawTimer();

  const currentTime = performance.now();

  // Aktualizácia a vykreslenie health potionov
  healthPotionManager.updatePotions(global.ctx, [player1, player2], currentTime);

  player1.handleInput(keys, 'w', 'a', 'd', global.gravity, global.canvas.height);
  player2.handleInput(keys, 'ArrowUp', 'ArrowLeft', 'ArrowRight', global.gravity, global.canvas.height);

  // Aktualizácia a vykreslenie hráčov
  player1.updatePosition(global.gravity, global.canvas.height, global.canvas.width);
  player2.updatePosition(global.gravity, global.canvas.height, global.canvas.width);
  player1.draw(global.ctx);
  player2.draw(global.ctx);

  // Spracovanie útokov
  player1.checkAttack(player2);
  player2.checkAttack(player1);

  // Kontrola konca hry
  if (player1.health <= 0 || player2.health <= 0) {
    clearInterval(global.gameInterval); // Ukončenie intervalu
    alert(player1.health <= 0 ? "Player 2 Wins!" : "Player 1 Wins!");
    return;
  }

  requestAnimationFrame(gameLoop);
}

// Timer countdown
function startTimer() {
  global.startTimer(); // Použitie globálnej metódy
}

// Start game
function startGame() {
  const mainMenu = document.getElementById("main-menu");
  mainMenu.style.display = "none";
  global.canvas.style.display = "block";
  global.switchToGameBackground();

  startTimer();
  gameLoop();
}

// Settings and quit game
function openSettings() {
  alert("Settings menu will be implemented later!");
}

function quitGame() {
  alert("Thanks for playing!");
}

// Event listeners
window.addEventListener("keydown", (e) => {
  if (e.key in keys) keys[e.key] = true;

  // Aktivácia útoku pre player1 a player2 pri stlačení príslušných kláves
  if (e.key === "s" && !player1.attack && player1.canAttack) { 
    player1.attack = true; 
    player1.canAttack = false; // Zablokovanie opakovaného útoku
  }

  if (e.key === "ArrowDown" && !player2.attack && player2.canAttack) { 
    player2.attack = true;
    player2.canAttack = false; // Zablokovanie opakovaného útoku
  }
});

window.addEventListener("keyup", (e) => {
  if (e.key in keys) keys[e.key] = false;

  // Uvoľnenie klávesy po jej stlačení, aby sa umožnil nový útok
  if (e.key === "s") {
    player1.attack = false;
    player1.canAttack = true; // Povolenie útoku po uvoľnení
  }

  if (e.key === "ArrowDown") {
    player2.attack = false;
    player2.canAttack = true; // Povolenie útoku po uvoľnení
  }
});

// Expose functions
window.startGame = startGame;
window.openSettings = openSettings;
window.quitGame = quitGame;
