import Player from "./player.js";
import { DOMController } from "./DOMController.js";

export default class GameController {
  constructor() {
    this.player = new Player("Player", false);
    this.computer = new Player("Computer", true);
    this.currentPlayer = this.player;
    this.gameOver = false;
    this.winner = null;
  }

  initializeGame() {
    this.computer.placeShipsRandomly();
    this.currentPlayer = this.player;
    this.gameOver = false;
    this.winner = null;
  }

  playerAttack(x, y) {
    if (this.gameOver) throw new Error("Game is over");
    if (this.currentPlayer !== this.player)
      throw new Error("Not player's turn");

    const result = this.player.attack(this.computer.getGameboard(), x, y);

    if (this.computer.getGameboard().allShipsSunk()) {
      this.gameOver = true;
      this.winner = this.player;
    }

    this.switchTurns();
    return result;
  }

  computerTurn() {
    if (this.gameOver) return null;
    if (this.currentPlayer !== this.computer)
      throw new Error("Not computer's turn");

    const result = this.computer.makeRandomAttack(this.player.getGameboard());

    if (this.player.getGameboard().allShipsSunk()) {
      this.gameOver = true;
      this.winner = this.computer;
    }

    this.switchTurns();
    return result;
  }

  switchTurns() {
    this.currentPlayer =
      this.currentPlayer === this.player ? this.computer : this.player;
  }

  getPlayer() {
    return this.player;
  }

  getComputer() {
    return this.computer;
  }

  getCurrentPlayer() {
    return this.currentPlayer;
  }

  isGameOver() {
    return this.gameOver;
  }

  getWinner() {
    return this.winner;
  }

  resetGame() {
    this.player = new Player("Player", false);
    this.computer = new Player("Computer", true);
    this.gameOver = false;
    this.winner = null;
    runGame();
  }
}

function runGame() {
  const gameInstance = new GameController();
  gameInstance.initializeGame();
  const domController = new DOMController(gameInstance);
  domController.setupGame();
}

runGame();

//To add

//remove logs
//Add this to a read me
//Fluff the code
//Laung and go to React
//UI revamping
//getLastAttackedCoordinates(gameboard) IN DOM CONTROLLER{
// You might need to modify your Gameboard class to track this better
// AI refining - if a hit is detected it hits the nearby cells,
//             - if the remained cell space does it not enough for the lenght of the remanined ships do not hit on cell
//Readd tests
//images for ships - already added in folder, needs to be added in UI
