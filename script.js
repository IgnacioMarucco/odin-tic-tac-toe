"use strict";
const Gameboard = (() => {
  // const board = ["X", "X", "", "O", "O", "", "", "", ""]
  const board = [...Array(9)];
  const editBoard = (index, marker) => {
    board[index] = marker;
  }

  return {board, editBoard};
})();

const Player = (name, marker) => {
  return {name, marker}
}

const Game = (() => {
  let players = [];
  let currentPlayer;
  // let gameOver = false;
  const start = () => {
    ScreenController.renderBoard();

    players = [
      Player(document.querySelector("#player1-input").value, "X"),
      Player(document.querySelector("#player2-input").value, "O"),
    ];

    currentPlayer = players[0];
  }

  const handleClick = (e) => {
    const playerChoice = e.target.dataset.index;
    playTurn(playerChoice);

  }

  const playTurn = (playerChoice) => {
    Gameboard.editBoard(playerChoice, currentPlayer.marker);
    ScreenController.renderBoard();

    if (checkForWinner()) {
      alert(`${currentPlayer.name} won!`);
      // gameOver = true;
    }

    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  }

  const checkForWinner = () => {
    let board = Gameboard.board;
    const winningCombinations = [
      [0,1,2],
      [3,4,5],
      [6,7,8],
      [0,3,6],
      [1,4,7],
      [2,5,8],
      [0,4,8],
      [2,4,6],
    ];
    for (let i = 0; i < winningCombinations.length; i++) {
      let [a, b, c] = winningCombinations[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        console.log('GANO ALGUIEN')
        return true;
      }
    }
    console.log('NO GANO NADIE')
    return false;
  }
  return {start, handleClick}
})();


const ScreenController = (() => {
  const gameboardGrid = document.querySelector(".gameboard");
  const board = Gameboard.board;

  const renderBoard = () => {
    gameboardGrid.innerHTML = ``;
    for (let index = 0; index < board.length ; index++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = `${index}`;
      cell.textContent = board[index];
      gameboardGrid.appendChild(cell);

      // Add Event Listener to each cell
      cell.addEventListener("click", Game.handleClick);
      // Remove event listener if cell is already played
      if(cell.textContent) {
        cell.removeEventListener("click", Game.handleClick);
      }
    }
  }

  // renderBoard();
  return {renderBoard}
})();


const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
  Game.start();
})