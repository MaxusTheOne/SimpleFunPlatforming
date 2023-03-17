"use strict";
let playerObj = document.querySelector("#player");
let playerX = 100;
let playerY = 0;
let moveKey = [false, false, false, false]; //w,a,s,d
let canJump = true;
let refreshRate = 20;
let gravity = 0;
let gravityMode = false;
setInterval(playerMovement, refreshRate);
// Move the player left or right when an arrow key is pressed
playerObj.addEventListener("animationend", resetJump);
document.addEventListener("keydown", function (event) {
  console.log(event.key);
  if (event.key === "a") {
    moveKey[1] = true;
  }
  if (event.key === "d") {
    moveKey[3] = true;
  }
  if (event.key === "w" && canJump == true) {
    console.log(canJump);
    gravity = 8;
    gravityMode = true;
    canJump = false;
  }
});
document.addEventListener("keyup", function (event) {
  console.log(event.key);
  if (event.key === "a") {
    moveKey[1] = false;
  }
  if (event.key === "d") {
    moveKey[3] = false;
  }
});

function playerMovement() {
  //   console.log("gravity: " + gravity);
  //   console.log("playerY: " + playerY);
  if (moveKey[1] === true) {
    playerX -= 5; // Move the player left
  } else if (moveKey[3] === true) {
    playerX += 5; // Move the player right
  }
  playerGravity();
  playerObj.style.left = playerX + "px";
  playerObj.style.bottom = playerY + "%";
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
}
function resetJump() {
  playerObj.classList.remove("jump");
}
