import { global } from "./global.js";  // Import global to access player data

// A map of all the keys being pressed
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

// Function to handle key events
export function move(event) {
  if (event.type === "keydown") {
    // Set the key to true if pressed
    if (keys.hasOwnProperty(event.key)) {
      keys[event.key] = true;
    }
  } else if (event.type === "keyup") {
    // Set the key to false if released
    if (keys.hasOwnProperty(event.key)) {
      keys[event.key] = false;
    }
  }

  // Update player movement based on keys pressed
  updatePlayerMovement();
}

// Function to update player movement based on key states
export function updatePlayerMovement() {
  const player1 = global.player1;
  const player2 = global.player2;

  // Player 1 movement (WASD)
  player1.dx = 0;
  if (keys.a) player1.dx = -5;
  if (keys.d) player1.dx = 5;

  // Double jump for Player 1 (W key)
  if (keys.w && player1.jumpCount < player1.maxJumps) {
    player1.dy = -10;  // Increase jump force if needed
    player1.isJumping = true;
    player1.jumpCount++;  // Increment jump count
  }

  // Player 2 movement (Arrow keys)
  player2.dx = 0;
  if (keys.ArrowLeft) player2.dx = -5;
  if (keys.ArrowRight) player2.dx = 5;

  // Double jump for Player 2 (ArrowUp key)
  if (keys.ArrowUp && player2.jumpCount < player2.maxJumps) {
    player2.dy = -10;  // Increase jump force if needed
    player2.isJumping = true;
    player2.jumpCount++;  // Increment jump count
  }
}
