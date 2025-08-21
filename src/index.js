import Gameboard from "./gameboard.js";
import Player from "./player.js";
import Ship from "./ship.js";
import { renderBoard } from "./DOMController.js";


export default class Game {
  constructor() {
    this.user = new Player('user');
    this.cpu = new Player('cpu');

    this.gameOver = false;
    this.isUsersTurn = true;
    this.winner = null;
    this.successfulHit = false;
  }
}

function newGame() {
  const player1 = new Player("User");
  const player2 = new Player("Computer", true);

  player1.gameboard.placeShip(new Ship(3), 0, 0, "horizontal");
  player1.gameboard.placeShip(new Ship(2), 3, 2, "horizontal");
  player1.gameboard.placeShip(new Ship(4), 4, 6, "vertical");
  player2.gameboard.placeShip(new Ship(3), 1, 1, "vertical");
  player2.gameboard.placeShip(new Ship(4), 5, 3, "vertical");
  player2.gameboard.placeShip(new Ship(4), 1, 8, "vertical");

  const player1Grid = document.getElementById("player-grid");
  const player2Grid = document.getElementById("cpu-grid");

  player1.gameboard.printBoard();
  player2.gameboard.printBoard();

  console.log(player1.gameboard.gameboard)

  player1.gameboard.receiveAttack(0, 0)
  player2.gameboard.receiveAttack(3, 0)
  // player1.gameboard.receiveAttack(0, 0)
  player2.gameboard.receiveAttack(3, 1)

  const enemyBoardContainer = document.getElementById("cpu-grid");

enemyBoardContainer.addEventListener("click", (e) => {
  if (!e.target.dataset.x || !e.target.dataset.y) return;

  const x = parseInt(e.target.dataset.x, 10);
  const y = parseInt(e.target.dataset.y, 10);

  try {
    console.log(x, y);
  } catch (err) {
    console.error(err.message);
    return;
  }

  // re-render board to show updated state
  renderBoard(player2.gameboard.gameboard, enemyBoardContainer);
});

  renderBoard(player1.gameboard.gameboard, player1Grid, true); // show player's ships
  renderBoard(player2.gameboard.gameboard, player2Grid, true); // hide computer ships
}



newGame();
