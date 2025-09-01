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