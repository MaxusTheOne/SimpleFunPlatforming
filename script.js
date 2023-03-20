"use strict";
let playerObj = [document.querySelector("#player1"), document.querySelector("#player2")];
let playerX = [10, 20];
let playerY = [1, 1];
let playerWidth = 2;
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
}

function playerMovement() {
  //   console.log("gravity: " + gravity);
  //   console.log("playerY: " + playerY);
  for (let i = 0; i < playerObj.length; i++) {
    if (moveKey[1] === true) {
      playerX[i] -= 0.5; // Move the player left
    } else if (moveKey[2] === true) {
      playerX[i] += 0.5; // Move the player right
    }
    if (moveKey[0] === true && canJump[i] === true) {
      //Jumping
      gravity[i] = 5;
      gravityMode[i] = true;
      canJump[i] = false;
      onPlatform[i] = false;
    }

    playerGravity(i);

    playerObj[i].style.left = playerX[i] + "%";
  }
}
function playerGravity(playerId) {
  for (let i = 0; i <= platformX.length; i++) {
    platformCollision(platformY[i], platformHeight, platformX[i], platformWidth, playerId);
    if (onPlatform[playerId]) {
      fallOffPlatform(platformX[i], platformWidth, platformY[i], platformHeight, playerId);
    }
  }

  platformCollision(-10, 11, -500, 10000, playerId);
  if (gravityMode[playerId] == true) {
    gravity[playerId] -= 0.3;
    playerY[playerId] += gravity[playerId];
  }
  playerObj[playerId].style.bottom = playerY[playerId] + "%";
}

function platformCollision(localPlatformY, localPlatformHeight, localplatformX, localPlatformwidth, playerId) {
  if (playerX[playerId] + playerWidth > localplatformX && playerX[playerId] < localplatformX + localPlatformwidth) {
    if (playerY[playerId] < localPlatformY + localPlatformHeight && playerY[playerId] > localPlatformY && gravity[playerId] < 0) {
      playerY[playerId] = localPlatformY + localPlatformHeight;
      // console.log("collided");
      gravity[playerId] = 0;
      gravityMode[playerId] = false;
      canJump[playerId] = true;
      onPlatform[playerId] = true;
    } else if (playerY[playerId] + gravity[playerId] <= localPlatformY + localPlatformHeight && playerY[playerId] > localPlatformY && gravity[playerId] < 0) {
      gravity[playerId] = localPlatformY + localPlatformHeight - playerY[playerId];
      console.log(`gravity adjusted to: ${gravity[playerId]}, platY: ${localPlatformY}, playerY: ${playerY[playerId]}`);
    }
  }
}
function fallOffPlatform(localplatformX, localPlatformwidth, localPlatformY, localPlatformHeight, playerId) {
  if (playerX[playerId] + playerWidth < localplatformX || playerX[playerId] > localplatformX + localPlatformwidth) {
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
