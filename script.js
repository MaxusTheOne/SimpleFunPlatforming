"use strict";
let playerObj = document.querySelector("#player");
let platformObj = document.querySelector("#platform");
let playerX = 10;
let playerY = 0;
let platformX = 30;
let platformY = 10;
let moveKey = [false, false, false, false]; //w,a,s,d
let canJump = true;
let refreshRate = 20;
let gravity = 0;
let gravityMode = false;
setInterval(playerMovement, refreshRate);
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
    gravity = 8;
    gravityMode = true;
    canJump = false;
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
});
function initGame() {
  platformObj.style.left = platformX;
  platformObj.style.bottom = platformY;
}

function playerMovement() {
  //   console.log("gravity: " + gravity);
  //   console.log("playerY: " + playerY);
  if (moveKey[1] === true) {
    playerX -= 1; // Move the player left
  } else if (moveKey[3] === true) {
    playerX += 1; // Move the player right
  }
  if (gravityMode == true) {
    playerGravity();
  }
  playerObj.style.left = playerX + "%";
}
function playerGravity() {
  if (playerY < 0) {
    playerY = 0;
    gravity = 0;
    gravityMode = false;
    canJump = true;
  } else if (gravityMode == true) {
    gravity -= 0.5;
    playerY += gravity;
  }
  playerObj.style.bottom = playerY + "%";
}
function resetJump() {
  playerObj.classList.remove("jump");
}
