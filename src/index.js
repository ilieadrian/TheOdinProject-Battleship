import Gameboard from "./gameboard.js";
import Player from "./player.js";
// import Ship from "./ship.js";
import  { DOMController } from "./DOMController.js";

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
}


function runGame(){
  const gameInstance = new GameController();
  gameInstance.initializeGame()
  const domController = new DOMController(gameInstance);
  console.log(domController)
  console.log(gameInstance.player.gameboard.printBoard())
  console.log(gameInstance.computer.gameboard.printBoard())

}

runGame();

// export default class GameController{
//   constructor() {
//     this.user = new Player('user');
//     this.cpu = new Player('cpu');

//     this.gameOver = false;
//     this.isUsersTurn = true;
//     this.winner = null;
//     this.successfulHit = false;
//   }

//     initializeGame() {
//     this.player.gameboard.placeShipsRandomly();
//     this.computer.gameboard.placeShipsRandomly();
//     this.currentPlayer = this.player;
//     this.gameOver = false;
//     this.winner = null;
//   }
// }

// function runGame() {
//   const player1 = new Player("User");
//   const player2 = new Player("Computer", true);

//   player1.gameboard.placeShip(new Ship(3), 0, 0, "horizontal");
//   player1.gameboard.placeShip(new Ship(2), 3, 2, "horizontal");
//   player1.gameboard.placeShip(new Ship(4), 4, 6, "vertical");
//   player2.gameboard.placeShip(new Ship(3), 1, 1, "vertical");
//   player2.gameboard.placeShip(new Ship(4), 5, 3, "vertical");
//   player2.gameboard.placeShip(new Ship(4), 1, 8, "vertical");

//   const player1Grid = document.getElementById("player-grid");
//   const player2Grid = document.getElementById("cpu-grid");

//   player1.gameboard.printBoard();
//   player2.gameboard.printBoard();

//   console.log(player1.gameboard.gameboard)

//   player1.gameboard.receiveAttack(0, 0)
//   player2.gameboard.receiveAttack(3, 0)
//   // player1.gameboard.receiveAttack(0, 0)
//   player2.gameboard.receiveAttack(3, 1)

//   const enemyBoardContainer = document.getElementById("cpu-grid");

// enemyBoardContainer.addEventListener("click", (e) => {
//   if (!e.target.dataset.x || !e.target.dataset.y) return;

//   const x = parseInt(e.target.dataset.x, 10);
//   const y = parseInt(e.target.dataset.y, 10);

//   try {
//     console.log(x, y);
//   } catch (err) {
//     console.error(err.message);
//     return;
//   }

//   // re-render board to show updated state
//   renderBoard(player2.gameboard.gameboard, enemyBoardContainer);
// });

//   renderBoard(player1.gameboard.gameboard, player1Grid, true); // show player's ships
//   renderBoard(player2.gameboard.gameboard, player2Grid, true); // hide computer ships
// }








 //   Explosion: Sound Effect by Ahmed Abdulaal from Pixabay
//https://pixabay.com/users/ahmed_abdulaal-49290858/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=312361
//    Ship Destroyed: Sound Effect by freesound_community from Pixabay
//https://pixabay.com/users/freesound_community-46691455/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=42132
//    Miss: Sound Effect by Alexander Jauk from Pixabay
//https://pixabay.com/users/alex_jauk-16800354/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=147014
//    Sound Effect by Advik Singh from Pixabay
//https://pixabay.com/users/scratchonix-50592769/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=366448
//    Sound Effect by Eiklo from Pixabay
//https://pixabay.com/users/eiklo-41248033/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=303896
