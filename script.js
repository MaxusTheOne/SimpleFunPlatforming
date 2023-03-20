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
let onPlatform = false;
let moveKey = [false, false, false, false, false, false]; //w,a,d && ArrowUp, ArrowLeft, ArrowRight
let canJump = true;
let refreshRate = 20;
let gravity = 0;
let gravityMode = false;
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

  if (moveKey[1] === true) {
    playerX[0] -= 0.5; // Move the player left
  } else if (moveKey[2] === true) {
    playerX[0] += 0.5; // Move the player right
  }
  if (moveKey[0] === true && canJump === true) {
    //Jumping
    gravity = 5;
    gravityMode = true;
    canJump = false;
    onPlatform = false;
  }

  playerGravity(0);

  playerObj[0].style.left = playerX[0] + "%";
}
function playerGravity(playerId) {
  for (let i = 0; i <= platformX.length; i++) {
    platformCollision(platformY[i], platformHeight, platformX[i], platformWidth);
    if (onPlatform) {
      fallOffPlatform(platformX[i], platformWidth, platformY[i], platformHeight);
    }
  }

  platformCollision(-10, 11, -500, 10000);
  if (gravityMode == true) {
    gravity -= 0.3;
    playerY[playerId] += gravity;
  }
  playerObj[playerId].style.bottom = playerY[playerId] + "%";
}

function platformCollision(localPlatformY, localPlatformHeight, localplatformX, localPlatformwidth) {
  if (playerX[0] + playerWidth > localplatformX && playerX[0] < localplatformX + localPlatformwidth) {
    if (playerY[0] < localPlatformY + localPlatformHeight && playerY[0] > localPlatformY && gravity < 0) {
      playerY[0] = localPlatformY + localPlatformHeight;
      // console.log("collided");
      gravity = 0;
      gravityMode = false;
      canJump = true;
      onPlatform = true;
    } else if (playerY[0] + gravity <= localPlatformY + localPlatformHeight && playerY[0] > localPlatformY && gravity < 0) {
      gravity = localPlatformY + localPlatformHeight - playerY[0];
      console.log(`gravity adjusted to: ${gravity}, platY: ${localPlatformY}, playerY: ${playerY[0]}`);
    }
  }
}
function fallOffPlatform(localplatformX, localPlatformwidth, localPlatformY, localPlatformHeight) {
  if (playerX[0] + playerWidth < localplatformX || playerX[0] > localplatformX + localPlatformwidth) {
    if (playerY[0] <= localPlatformY + localPlatformHeight && playerY[0] >= localPlatformY + localPlatformHeight) {
      console.log("fall off platform");
      gravityMode = true;
      onPlatform = false;
      canJump = false;
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
