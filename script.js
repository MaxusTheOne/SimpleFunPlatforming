"use strict";
let playerObj = [document.querySelector("#player1"), document.querySelector("#player2")];
let playerX = [10, 20];
let playerY = [1, 1];
let playerWidth = [2, 2];
let playerHeight = [5, 5];
let playerScore = [0, 0];
let isBig = [false, false];
let berryX;
let berryY;
let platformX = [];
let platformY = [];
let platformHeight = 2;
let platformWidth = 10;
let platformAmount = 30;
let onPlatform = [false, false];
let moveKey = [false, false, false, false, false, false]; //w,a,d && ArrowUp, ArrowLeft, ArrowRight
let canJump = [true, true];
let refreshRate = 20;
let gravity = [0, 0];
let gravityMode = [false, false];
let game_state = "loading";
setInterval(playerMovement, refreshRate);
window.addEventListener("load", initGame);
// Move the player left or right when an arrow key is pressed
document.addEventListener("keydown", function (event) {
  // console.log(event.key);
  if (event.key === "w") {
    // console.log(canJump);
    moveKey[0] = true;
  }
  if (event.key === "a") {
    moveKey[1] = true;
  }
  if (event.key === "d") {
    moveKey[2] = true;
  }
  if (event.key === "ArrowUp") {
    // console.log(canJump);
    moveKey[3] = true;
  }
  if (event.key === "ArrowLeft") {
    moveKey[4] = true;
  }
  if (event.key === "ArrowRight") {
    moveKey[5] = true;
  }
});
document.addEventListener("keyup", function (event) {
  //   console.log(event.key);
  if (event.key === "w") {
    moveKey[0] = false;
  }
  if (event.key === "a") {
    moveKey[1] = false;
  }
  if (event.key === "d") {
    moveKey[2] = false;
  }
  if (event.key === "ArrowUp") {
    moveKey[3] = false;
  }
  if (event.key === "ArrowLeft") {
    moveKey[4] = false;
  }
  if (event.key === "ArrowRight") {
    moveKey[5] = false;
  }
});
function initGame() {
  for (let i = 1; i <= platformAmount; i++) {
    createPlatform(Math.floor(Math.random() * (100 - platformWidth)), i * (90 / platformAmount), i);
  }
  for (let i = 0; i < playerObj.length; i++) {
    // playerX[i] = Math.random() * 100;
    resetPlayer(i);
  }
  spawnBerry();
  document.querySelector("#game_over_screen").classList.add("hidden");
  game_state = "started";
}

function playerMovement() {
  //   console.log("gravity: " + gravity);
  //   console.log("playerY: " + playerY);
  for (let i = 0; i < playerObj.length; i++) {
    if ((i == 1 && moveKey[1] === true) || (i == 0 && moveKey[4] === true)) {
      if (isBig[i]) {
        playerX[i] -= 0.8;
      } else playerX[i] -= 0.5; // Move the player left
    } else if ((i == 1 && moveKey[2] === true) || (i == 0 && moveKey[5] === true)) {
      if (isBig[i]) {
        playerX[i] += 0.8;
      } else playerX[i] += 0.5; // Move the player right
    }
    if ((i == 1 && moveKey[0] === true && canJump[i] === true) || (i == 0 && moveKey[3] === true && canJump[i] === true)) {
      //Jumping
      if (isBig[i]) {
        gravity[i] = 5;
      } else gravity[i] = 4;
      gravityMode[i] = true;
      canJump[i] = false;
      onPlatform[i] = false;
    }

    playerGravity(i);
    offSide(i);
    bonk(i);
    if (isBig[i]) detectPlayerCollision(i);
    else detectBerryCollision(i);
    playerObj[i].style.left = playerX[i] + "%";
  }
}
function playerGravity(playerId) {
  for (let i = 0; i <= platformX.length; i++) {
    platformCollision(platformY[i], platformHeight, platformX[i], platformWidth, playerId);
  }

  if (onPlatform[playerId]) {
    for (let i = 0; i <= platformX.length; i++) {
      fallOffPlatform(platformX[i], platformWidth, platformY[i], platformHeight, playerId);
    }
  }

  platformCollision(-10, 11, -500, 10000, playerId);
  if (gravityMode[playerId] == true) {
    gravity[playerId] -= 0.2;
    playerY[playerId] += gravity[playerId];
  }
  playerObj[playerId].style.bottom = playerY[playerId] + "%";
}

function platformCollision(localPlatformY, localPlatformHeight, localplatformX, localPlatformwidth, playerId) {
  if (playerX[playerId] + playerWidth[playerId] > localplatformX && playerX[playerId] < localplatformX + localPlatformwidth) {
    if (playerY[playerId] < localPlatformY + localPlatformHeight && playerY[playerId] > localPlatformY && gravity[playerId] < 0) {
      playerY[playerId] = localPlatformY + localPlatformHeight;
      // console.log("collided");
      gravity[playerId] = 0;
      gravityMode[playerId] = false;
      canJump[playerId] = true;
      onPlatform[playerId] = true;
    } else if (playerY[playerId] + gravity[playerId] <= localPlatformY + localPlatformHeight && playerY[playerId] > localPlatformY && gravity[playerId] < 0) {
      gravity[playerId] = localPlatformY + localPlatformHeight - playerY[playerId];
      // console.log(`gravity adjusted to: ${gravity[playerId]}, platY: ${localPlatformY}, playerY: ${playerY[playerId]}`);
    }
  }
}
function fallOffPlatform(localplatformX, localPlatformwidth, localPlatformY, localPlatformHeight, playerId) {
  if (playerX[playerId] + playerWidth[playerId] < localplatformX || playerX[playerId] > localplatformX + localPlatformwidth) {
    if (playerY[playerId] <= localPlatformY + localPlatformHeight && playerY[playerId] >= localPlatformY + localPlatformHeight) {
      console.log("fall off platform");
      gravityMode[playerId] = true;
      onPlatform[playerId] = false;
      canJump[playerId] = false;
    }
  }
}

function createPlatform(x, y, id) {
  const parent = document.querySelector("#game_elements");
  const platform = document.createElement("div");
  platform.id = "platform" + id;
  platform.classList.add("platform");
  // platform.classList.add("wrapper");
  // platform.style.animationDelay = "-" + Math.floor(Math.random() * 10) + "s";
  platformX.push(x);
  platformY.push(y);
  platform.style.left = x + "%";
  platform.style.bottom = y + "%";
  parent.appendChild(platform);
}
function offSide(playerId) {
  if (playerX[playerId] <= -0.1 - playerWidth[playerId]) {
    playerX[playerId] = 100;
  } else if (playerX[playerId] >= 100.1) {
    playerX[playerId] = 0 - playerWidth[playerId];
  }
}
function bonk(playerId) {
  if (playerY[playerId] >= 100 - playerHeight[playerId]) {
    gravity[playerId] = -1;
  }
}

function mushroomEffect(playerId) {
  playerObj[playerId].classList.add("superSize");
  playerObj[playerId].querySelector("div").classList.add("wrapper");
  playerHeight[playerId] = 10;
  playerWidth[playerId] = 4;
  isBig[playerId] = true;
  setTimeout(endMushroom, 10000);
}
function endMushroom() {
  for (let i = 0; i < playerObj.length; i++) {
    playerObj[i].classList.remove("superSize");
    playerObj[i].querySelector("div").classList.remove("wrapper");
    playerHeight[i] = 5;
    playerWidth[i] = 2;
    isBig[i] = false;
  }
  setTimeout(spawnBerry, 1000);
}

function detectPlayerCollision(bigPlayerId) {
  if (playerX[0] + playerWidth[0] >= playerX[1] && playerX[0] <= playerX[1] + playerWidth[1]) {
    // console.log("playerX collision");
    if (playerY[0] + playerHeight[0] >= playerY[1] && playerY[0] <= playerY[1] + playerHeight[1]) {
      console.log("player collision");
      if (bigPlayerId == 1) resetPlayer(0);
      else {
        resetPlayer(1);
      }
      updateScore(bigPlayerId);
    }
  }
}
function resetPlayer(hitPlayer) {
  playerY[hitPlayer] = 1 + Math.random() * 80;
  playerX[hitPlayer] = Math.random() * 100;
  gravityMode[hitPlayer] = true;
  onPlatform[hitPlayer] = false;
}

function updateScore(playerId) {
  if (game_state == "started") {
    playerScore[playerId]++;
    document.querySelector("#player" + playerId + "_score").textContent = playerScore[playerId];
    if (playerScore[playerId] >= 10) {
      winGame(playerId);
    }
  }
}

function spawnBerry() {
  let berry = document.querySelector("#berry");
  berryX = 5 + Math.floor(Math.random() * 90);
  berryY = 5 + Math.floor(Math.random() * 80);
  berry.style.left = berryX + "%";
  berry.style.bottom = berryY + "%";
}

function eatBerry(playerId) {
  let berry = document.querySelector("#berry");
  berry.style.bottom = "-20%";
  berryY = -20;
  mushroomEffect(playerId);
}

function detectBerryCollision(playerId) {
  // console.log("trying to detect berry");
  // console.log(`playerId: ${playerId} playerX: ${playerX} berryX: ${berryX}`);
  if (playerX[playerId] + playerWidth[playerId] >= berryX && playerX[playerId] <= berryX + 3) {
    if (playerY[playerId] + playerHeight[playerId] >= berryY && playerY[playerId] <= berryY + 3) {
      console.log("berry collision");
      eatBerry(playerId);
    }
  }
}
function winGame(playerId) {
  let gameOverScreen = document.querySelector("#game_over_screen");
  game_state = "game_over";
  if (playerId == 0) {
    gameOverScreen.textContent = "Blue Wins!";
    gameOverScreen.classList.remove("hidden");
    gameOverScreen.classList.add("blueWin");
  } else {
    gameOverScreen.textContent = "Red Wins!";
    gameOverScreen.classList.remove("hidden");
    gameOverScreen.classList.add("redWin");
  }
}

function resetGame() {}
