"use strict";

const Gameboard = (() => {
  const board = [...Array(9)].fill('');
  const editBoard = (index, marker) => {
    board[index] = marker;
  }
  const getBoard = () => board;
  return {getBoard, editBoard};
})();

const Player = (name, marker) => {
  return {name, marker}
}

const GameController = (() => {
  let players = [];
  let currentPlayer;
  let gameOver = false;

  const start = () => {
    players = [
      Player(document.querySelector("#player1-input").value, "X"),
      Player(document.querySelector("#player2-input").value, "O"),
    ];
    currentPlayer = players[0];
    ScreenController.renderBoard();
  }

  const handleClick = (e) => {
    const playerChoice = e.target.dataset.index;
    playTurn(playerChoice);
  }

  const playTurn = (playerChoice) => {
    Gameboard.editBoard(playerChoice, currentPlayer.marker);
    if (checkForWinner()) {
      alert(`${currentPlayer.name} won!`);
      gameOver = true;
      ScreenController.renderBoard();
    } else if (checkForDraw()) {
      gameOver = true;
      alert("It's a draw!")
      ScreenController.renderBoard();
    } else {
      ScreenController.renderBoard();
      currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }
  }

  const checkForDraw = () => {
    let board = Gameboard.getBoard();
    for (let i = 0; i < board.length ; i++) {
      if (!board[i]){
        return false;
      }
    }
    return true;
  }

  const checkForWinner = () => {
    let board = Gameboard.getBoard();
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
        return true;
      }
    }
    return false;
  }

  const getGameOver = () => gameOver;
  const getPlayers = () => players;

  return {start, handleClick, getGameOver, getPlayers}
})();

const ScreenController = (() => {
  const gameboardGrid = document.querySelector(".gameboard");
  const board = Gameboard.getBoard();

  const renderBoard = () => {
    gameboardGrid.innerHTML = ``;
    for (let index = 0; index < board.length ; index++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = `${index}`;
      cell.textContent = board[index];
      gameboardGrid.appendChild(cell);
      // Add events only if cell is empty and game is not over
      if (!cell.textContent && !GameController.getGameOver()) {
        cell.addEventListener("click", GameController.handleClick);
      }
    }
  }
  return {renderBoard}
})();

// On windows load
document.addEventListener("DOMContentLoaded", function() {
  const startButton = document.querySelector("#start-button");
  startButton.addEventListener("click", () => {
    GameController.start();
  })
});