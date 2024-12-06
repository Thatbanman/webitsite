const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const playButton = document.getElementById("play-button");
const menuScreen = document.getElementById("menu-screen");

// Game settings
canvas.width = 800;
canvas.height = 600;

let isTagger = true;
let players = [
  { x: 100, y: 100, width: 30, height: 30, color: "red", dx: 0, dy: 0 },
  { x: 200, y: 100, width: 30, height: 30, color: "blue", dx: 0, dy: 0 },
];

const mapObjects = [
  // Floors
  { x: 0, y: 550, width: 800, height: 50, color: "gray" },
  { x: 300, y: 400, width: 200, height: 20, color: "gray" },
  { x: 100, y: 300, width: 150, height: 20, color: "gray" },
  // Walls
  { x: 400, y: 200, width: 20, height: 150, color: "gray" },
  // Platforms
  { x: 500, y: 150, width: 100, height: 10, color: "gray" },
];

// Game state
let keys = {};
let gravity = 0.5;

// Handle player movement
function updatePlayer(player, isTagger) {
  if (keys["ArrowLeft"]) player.dx = -5;
  if (keys["ArrowRight"]) player.dx = 5;
  if (keys["ArrowUp"] && player.dy === 0) player.dy = -10; // Jump
  if (!keys["ArrowLeft"] && !keys["ArrowRight"]) player.dx = 0;

  // Gravity
  player.dy += gravity;

  // Update position
  player.x += player.dx;
  player.y += player.dy;

  // Wrap-around mechanics
  if (player.x < 0) player.x = canvas.width;
  if (player.x > canvas.width) player.x = 0;
  if (player.y < 0) player.y = canvas.height;
  if (player.y > canvas.height) player.y = 0;

  // Collision detection
  for (let obj of mapObjects) {
    if (
      player.x < obj.x + obj.width &&
      player.x + player.width > obj.x &&
      player.y < obj.y + obj.height &&
      player.y + player.height > obj.y
    ) {
      // Stop falling if on a platform
      if (player.dy > 0 && player.y + player.height - player.dy <= obj.y) {
        player.dy = 0;
        player.y = obj.y - player.height;
      }
    }
  }
}

// Check for tagging
function checkTag() {
  const tagger = players[0];
  const runner = players[1];

  if (
    tagger.x < runner.x + runner.width &&
    tagger.x + tagger.width > runner.x &&
    tagger.y < runner.y + runner.height &&
    tagger.y + tagger.height > runner.y
  ) {
    // Swap roles
    isTagger = !isTagger;
    players[0].color = isTagger ? "red" : "blue";
    players[1].color = isTagger ? "blue" : "red";
  }
}

// Draw game elements
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw map
  for (let obj of mapObjects) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
  }

  // Draw players
  for (let player of players) {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
  }
}

// Game loop
function gameLoop() {
  updatePlayer(players[0], isTagger); // Tagger
  updatePlayer(players[1], !isTagger); // Runner
  checkTag();
  draw();
  requestAnimationFrame(gameLoop);
}

// Key events
window.addEventListener("keydown", (e) => (keys[e.key] = true));
window.addEventListener("keyup", (e) => (keys[e.key] = false));

// Start game
playButton.addEventListener("click", () => {
  menuScreen.classList.add("hidden");
  canvas.classList.remove("hidden");
  gameLoop();
});
