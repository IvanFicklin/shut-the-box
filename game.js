// JavaScript code for Shut the Box game

// Constants for elements
const dice1Img = document.querySelector("#dice1");
const dice2Img = document.querySelector("#dice2");
const startButton = document.querySelector("#start");
const rollButton = document.querySelector("#roll");
const endTurnButton = document.querySelector("#endTurn");
const individualButton = document.querySelector("#individual");
const sumButton = document.querySelector("#sum");
const player1Input = document.querySelector("#player1");
const player2Input = document.querySelector("#player2");
const boxes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
const gameBoard = document.querySelector(".game-board");

// Variables for gameplay
let turn = 1;
let round = 1;
let die1Num = 0;
let die2Num = 0;
let p1Total = 0;
let p2Total = 0;
let p1Name = "";
let p2Name = "";

// Helper function: Reset board
function resetBoard() {
  boxes.fill(0);
  document.querySelectorAll(".box").forEach((box, index) => {
    box.classList.remove("shut");
    box.textContent = index;
  });
}

// Shut a box
function shut(boxNumber) {
  const boxElement = document.querySelector(`#box${boxNumber}`);
  boxElement.classList.add("shut");
  boxElement.textContent = "X";
  boxes[boxNumber] = "X";
}

// Event listener: Start button
startButton.addEventListener("click", () => {
  const p1NameInput = player1Input.value.trim();
  const p2NameInput = player2Input.value.trim();

  if (!p1NameInput || !p2NameInput) {
    alert("Both players must enter their names.");
    return;
  }

  p1Name = p1NameInput;
  p2Name = p2NameInput;

  document.querySelector("#p1name").textContent = p1Name;
  document.querySelector("#p2name").textContent = p2Name;

  gameBoard.style.display = "block";
  rollButton.disabled = false;
});

// Event listener: Roll button
rollButton.addEventListener("click", () => {
  die1Num = Math.floor(Math.random() * 6) + 1;
  die2Num = Math.floor(Math.random() * 6) + 1;

  dice1Img.src = `./images/dice-${die1Num}.png`;
  dice2Img.src = `./images/dice-${die2Num}.png`;

  const sum = die1Num + die2Num;

  individualButton.disabled =
    die1Num === die2Num || boxes[die1Num] === "X" || boxes[die2Num] === "X";
  sumButton.disabled = sum > 9 || boxes[sum] === "X";
  endTurnButton.disabled = individualButton.disabled && sumButton.disabled;

  rollButton.disabled = true;
});

// Event listener: Individual button
individualButton.addEventListener("click", () => {
  shut(die1Num);
  shut(die2Num);
  boxes[0] += die1Num + die2Num;

  individualButton.disabled = true;
  sumButton.disabled = true;
  rollButton.disabled = false;
});

// Event listener: Sum button
sumButton.addEventListener("click", () => {
  const sum = die1Num + die2Num;
  shut(sum);
  boxes[0] += sum;

  individualButton.disabled = true;
  sumButton.disabled = true;
  rollButton.disabled = false;
});

// Event listener: End turn button
endTurnButton.addEventListener("click", () => {
  const pointsThisTurn = 45 - boxes[0];

  if (turn === 1) {
    p1Total += pointsThisTurn;
    const row = buildRow(round, pointsThisTurn);
    document.querySelector(".scorecard tbody").appendChild(row);
    turn = 2;
  } else {
    p2Total += pointsThisTurn;
    document.querySelector(`#round${round} .p2Pts`).textContent = pointsThisTurn;
    turn = 1;
    round += 1;
  }

  resetBoard();
  rollButton.disabled = false;
  endTurnButton.disabled = true;

  if (round > 5) {
    gameOver();
  }
});

// Build table row
function buildRow(roundNumber, p1Points) {
  const tr = document.createElement("tr");
  tr.id = `round${roundNumber}`;

  const th = document.createElement("th");
  th.textContent = `Round ${roundNumber}`;

  const tdP1 = document.createElement("td");
  tdP1.classList.add("p1Pts");
  tdP1.textContent = p1Points;

  const tdP2 = document.createElement("td");
  tdP2.classList.add("p2Pts");

  tr.appendChild(th);
  tr.appendChild(tdP1);
  tr.appendChild(tdP2);

  return tr;
}

// End game
function gameOver() {
  gameBoard.style.display = "none";
  const winnerSection = document.querySelector(".winner");
  winnerSection.style.display = "block";

  if (p1Total < p2Total) {
    winnerSection.textContent = `${p1Name} wins with ${p1Total} points!`;
  } else if (p2Total < p1Total) {
    winnerSection.textContent = `${p2Name} wins with ${p2Total} points!`;
  } else {
    winnerSection.textContent = "It's a tie! Play one more round.";
    round = 5; // Extend game by one round
  }
}
