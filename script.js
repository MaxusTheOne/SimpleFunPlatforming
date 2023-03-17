"use strict";
let playerObj = document.querySelector("#player");
let platformObj = [document.querySelector("#platform"), document.querySelector("#platform1")];
let playerX = 10;
let playerY = 1;
let playerWidth = 5;
let platformX = [30, 60];
let platformY = [10, 30];
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
  if (event.key === "w") {
    // console.log(canJump);
    moveKey[0] = true;
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
  platformObj[0].style.left = platformX[0] + "%";
  platformObj[0].style.bottom = platformY[0] + "%";
  platformObj[1].style.left = platformX[1] + "%";
  platformObj[1].style.bottom = platformY[1] + "%";
}

function playerMovement() {
  //   console.log("gravity: " + gravity);
  //   console.log("playerY: " + playerY);
  if (moveKey[1] === true) {
    playerX -= 1; // Move the player left
  } else if (moveKey[3] === true) {
    playerX += 1; // Move the player right
  }
  if (moveKey[0] === true && canJump === true) {
    //Jumping
    gravity = 8;
    gravityMode = true;
    canJump = false;
    onPlatform = false;
  }

  playerGravity();

  playerObj.style.left = playerX + "%";
}
function playerGravity() {
  for (let i = 0; i <= 1; i++) {
    platformCollision(platformY[i], platformHeight, platformX[i], platformWidth);
    if (onPlatform) {
      fallOffPlatform(platformX[i], platformWidth, platformY[i], platformHeight);
    }
  }

  platformCollision(-10, 11, -500, 10000);
  if (gravityMode == true) {
    gravity -= 0.5;
    playerY += gravity;
  }
  playerObj.style.bottom = playerY + "%";
}

function platformCollision(localPlatformY, localPlatformHeight, localplatformX, localPlatformwidth) {
  if (playerY < localPlatformY + localPlatformHeight && playerY > localPlatformY && gravity < 0) {
    if (playerX + playerWidth > localplatformX && playerX < localplatformX + localPlatformwidth) {
      playerY = localPlatformY + localPlatformHeight;
      console.log("collided");
      gravity = 0;
      gravityMode = false;
      canJump = true;
      onPlatform = true;
    }
  }
}
function fallOffPlatform(localplatformX, localPlatformwidth, localPlatformY, localPlatformHeight) {
  if (playerX + playerWidth < localplatformX || playerX > localplatformX + localPlatformwidth) {
    if (playerY <= localPlatformY + localPlatformHeight && playerY >= localPlatformY + localPlatformHeight) {
      gravityMode = true;
      onPlatform = false;
    }
  }
}
