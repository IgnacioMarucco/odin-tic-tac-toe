"use strict";
const Gameboard = (() => {
  // const board = ["X","O","X","O", ,"X",, "X", "O"]
  const board = [...Array(9)];
  const editBoard = (index, marker) => {
    board[index] = marker;
  }
  return {board, editBoard};
})();

const Player = (name, marker) => {
  return {name, marker}
}

const GameController = (() => {
  let players = [];
  let currentPlayer;
  let gameOver = false;

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
    // ScreenController.renderBoard();
    if (checkForWinner()) {
      alert(`${currentPlayer.name} won!`);
      gameOver = true;
    } else if (checkForDraw()) {
      gameOver = true;
      alert("It's a draw!")
    }
    ScreenController.renderBoard();
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    console.log("game over inside GameController > playTurn?", gameOver)
  }

  const checkForDraw = () => {
    let board = Gameboard.board;
    for (let i = 0; i < board.length ; i++) {
      if (!board[i]){
        return false;
      }
    }
    return true;
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
        return true;
      }
    }
    return false;
  }

  return {start, handleClick, gameOver, players}
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
      console.log("game over inside ScreenController > renderBoard?", GameController.gameOver);
      console.log("players", GameController.players)
      // New event add
      if (!cell.textContent && !GameController.gameOver) {
        cell.addEventListener("click", GameController.handleClick);
      }
    }
  }

  // renderBoard();
  return {renderBoard}
})();

// On windows load
document.addEventListener("DOMContentLoaded", function() {
  const startButton = document.querySelector("#start-button");
  startButton.addEventListener("click", () => {
    GameController.start();
  })
});