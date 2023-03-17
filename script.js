"use strict";
let playerObj = document.querySelector("#player");
let platformObj = document.querySelector("#platform");
let playerX = 10;
let playerY = 0;
let playerWidth = 5;
let platformX = 30;
let platformY = 10;
let platformHeight = 10;
let platformWidth = 30;
let onPlatform = false;
let moveKey = [false, false, false, false]; //w,a,s,d
let canJump = true;
let refreshRate = 20;
let gravity = 0;
let gravityMode = false;
setInterval(playerMovement, refreshRate);
window.addEventListener("load", initGame);
// Move the player left or right when an arrow key is pressed
document.addEventListener("keydown", function (event) {
  //   console.log(event.key);
  if (event.key === "a") {
    moveKey[1] = true;
  }
  if (event.key === "d") {
    moveKey[3] = true;
  }
  if (event.key === "w" && canJump == true) {
    // console.log(canJump);
    moveKey[0] = true;
    gravity = 8;
    gravityMode = true;
    canJump = false;
    onPlatform = false;
  }
});
document.addEventListener("keyup", function (event) {
  //   console.log(event.key);
  if (event.key === "a") {
    moveKey[1] = false;
  }
  if (event.key === "d") {
    moveKey[3] = false;
  }
  if (event.key === "w") {
    moveKey[0] = false;
  }
});
function initGame() {
  platformObj.style.left = platformX + "%";
  platformObj.style.bottom = platformY + "%";
}

function playerMovement() {
  //   console.log("gravity: " + gravity);
  //   console.log("playerY: " + playerY);
  if (moveKey[1] === true) {
    playerX -= 1; // Move the player left
  } else if (moveKey[3] === true) {
    playerX += 1; // Move the player right
  }

  playerGravity();

  playerObj.style.left = playerX + "%";
}
function playerGravity() {
  platformCollision(platformY, platformHeight, platformX, platformWidth);
  if (onPlatform) {
    fallOffPlatform(platformX, platformWidth, platformY, platformHeight);
  }
  if (playerY < 0) {
    platformCollision(0, 0, 0, 10000);
  } else if (gravityMode == true) {
    gravity -= 0.5;
    playerY += gravity;
  }
  playerObj.style.bottom = playerY + "%";
}

function platformCollision(localPlatformY, localPlatformHeight, localPlatformX, localPlatformwidth) {
  if (playerY < localPlatformY + localPlatformHeight && gravity < 0) {
    if (playerX + playerWidth > localPlatformX && playerX < localPlatformX + localPlatformwidth) {
      playerY = localPlatformY + localPlatformHeight;
      gravity = 0;
      gravityMode = false;
      canJump = true;
      onPlatform = true;
    }
  }
}
function fallOffPlatform(localPlatformX, localPlatformwidth, localPlatformY, localPlatformHeight) {
  if (playerX + playerWidth < localPlatformX || playerX > localPlatformX + localPlatformwidth) {
    if (playerY <= localPlatformY + localPlatformHeight && playerY >= localPlatformY + localPlatformHeight) {
      gravityMode = true;
      onPlatform = false;
    }
  }
}
