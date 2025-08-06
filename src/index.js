import Gameboard from "./gameboard.js";
import Player from "./player.js";
import Ship from "./ship.js";
import { renderBoard } from "./DOMController.js";

function newGame() {
  const player1 = new Player("User");
  const player2 = new Player("Computer", true);

  player1.gameboard.placeShip(new Ship(3), 0, 0, "horizontal");
  player2.gameboard.placeShip(new Ship(3), 1, 1, "vertical");

  const player1Grid = document.getElementById("player1-grid");
  const player2Grid = document.getElementById("player2-grid");

  renderBoard(player1.gameboard.gameboard, player1Grid, true); // show player's ships
  renderBoard(player2.gameboard.gameboard, player2Grid, false); // hide computer ships
}

newGame();
