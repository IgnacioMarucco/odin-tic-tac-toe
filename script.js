"use strict";

const Gameboard = (() => {
  const board = [...Array(9)].fill('');

  const editBoard = (index, marker) => {
    board[index] = marker;
  }

  const resetBoard = () => {
    for (let index = 0; index < board.length ; index++) {
      board[index] = '';
    }
  }

  const getBoard = () => board;

  return {getBoard, editBoard, resetBoard};
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

  const restart = () => {
    players = [];
    gameOver = false;
    Gameboard.resetBoard();
    ScreenController.clearGrid();
    ScreenController.renderResult();
  }

  const handleClick = (e) => {
    const playerChoice = e.target.dataset.index;
    playTurn(playerChoice);
  }

  const playTurn = (playerChoice) => {
    Gameboard.editBoard(playerChoice, currentPlayer.marker);
    if (checkForWinner()) {
      gameOver = true;
      ScreenController.renderBoard();
      ScreenController.renderResult(1);
    } else if (checkForDraw()) {
      gameOver = true;
      ScreenController.renderBoard();
      ScreenController.renderResult(2);
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
  const getCurrentPlayer = () => currentPlayer;

  return {start, restart, handleClick, getGameOver, getCurrentPlayer}
})();

const ScreenController = (() => {
  const gameboardGrid = document.querySelector(".gameboard");
  const resultDisplay = document.querySelector("#result-display");
  const board = Gameboard.getBoard();

  const clearGrid = () => {
    gameboardGrid.innerHTML = ``;
  }
  const renderBoard = () => {
    clearGrid();
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

  const renderResult = (result) => {
    if (!result) {
      resultDisplay.textContent = "";
    } else if (result === 1) {
      resultDisplay.textContent = `The winner is ${GameController.getCurrentPlayer().name}!`;
    } else {
      resultDisplay.textContent = `It's a Draw!`;
    }
  }

  return {renderBoard, renderResult, clearGrid}
})();

// On windows load
document.addEventListener("DOMContentLoaded", function() {
  const startButton = document.querySelector("#start-button");
  const restartButton = document.querySelector("#restart-button");

  startButton.addEventListener("click", () => {
    GameController.start();
  });

  restartButton.addEventListener("click", () => {
    GameController.restart();
  })
});