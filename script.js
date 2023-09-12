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
  let computerPlayer;

  const start = () => {
    players = [
      Player(document.querySelector("#player1-input").value, "X"),
      Player(document.querySelector("#player2-input").value, "O"),
    ];
    currentPlayer = players[0];

    computerPlayer = getComputerPlayer();
    ScreenController.renderBoard();
  }

  const getComputerPlayer = () => {
    if (players[1].name === "") {
      return players[1];
    }
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

    if (getComputerPlayer() && !gameOver) {
      computerTurn();
      currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    }
  }

  const computerTurn = () => {
    let computerChoice = getComputerChoice();
    Gameboard.editBoard(computerChoice, currentPlayer.marker);
    ScreenController.renderBoard();
  }

  const getComputerChoice = () => {
    let board = Gameboard.getBoard();

    function getAvailablePositionsIndexes(board, searchItem) {
      let i = board.indexOf(searchItem),
          indexes = [];
      while (i !== -1) {
        indexes.push(i);
        i = board.indexOf(searchItem, ++i);
      }
      return indexes;
    }
    let availablePositionIndexes = getAvailablePositionsIndexes(board, "");
    let computerChoice = availablePositionIndexes[Math.floor(Math.random()*availablePositionIndexes.length)];
    return computerChoice;
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
    let playerName = GameController.getCurrentPlayer().name;
    let playerMarker = GameController.getCurrentPlayer().marker;
    if (!result) {
      resultDisplay.textContent = "";
    } else if (result === 1) {
      if (playerName === "") {
        playerName = playerMarker;
      }
      resultDisplay.textContent = `The winner is ${playerName}!`;
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