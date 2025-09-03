import Player from "./player.js";
import { DOMController } from "./DOMController.js";

export default class GameController {
  constructor(){
    this.player = new Player('Player', false);     
    this.computer = new Player('Computer', true);  
    this.currentPlayer = this.player;              
    this.gameOver = false;
    this.winner = null;
  }

  initializeGame() {
    this.player.placeShipsRandomly();
    this.computer.placeShipsRandomly();
    this.currentPlayer = this.player;
    this.gameOver = false;
    this.winner = null;
  }

playerAttack(x, y) {
  if (this.gameOver) throw new Error('Game is over');
  if (this.currentPlayer !== this.player) throw new Error("Not player's turn");

  const result = this.player.attack(this.computer.getGameboard(), x, y);

  if (this.computer.getGameboard().allShipsSunk()) {
    this.gameOver = true;
    this.winner = this.player;
  }

  this.switchTurns();  // <--- always switch
  return result;
}

computerTurn() {
  if (this.gameOver) return null;
  if (this.currentPlayer !== this.computer) throw new Error("Not computer's turn");

  const result = this.computer.makeRandomAttack(this.player.getGameboard());

  if (this.player.getGameboard().allShipsSunk()) {
    this.gameOver = true;
    this.winner = this.computer;
  }

  this.switchTurns();  // <--- always switch
  return result;
}

  switchTurns() {
    this.currentPlayer = this.currentPlayer === this.player ? this.computer : this.player;
    console.log("switchTurns fired, curent playa: ", this.currentPlayer.name)
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
    this.player = new Player('Player', false);
    this.computer = new Player('Computer', true);
    this.initializeGame();
  }
}

function runGame(){
  const gameInstance = new GameController();
  gameInstance.initializeGame()
  const domController = new DOMController(gameInstance);
  domController.setupGame()
  // console.log(domController)
  // console.log(gameInstance.player.gameboard.printBoard())
  // console.log(gameInstance.computer.gameboard.printBoard())
}

runGame();