import Gameboard from "./gameboard.js";
import Player from "./player.js";
import Ship from "./ship.js";
// import DOMController from './DOMController.js';


//Point 4.2
//Set up a new game by creating Players. 

const player1 = new Player('User');
const player2 = new Player('Computer', true); // true = isComputer



//For now just populate each player’s Gameboard with predetermined coordinates. 

player1.gameboard.placeShip(new Ship(3), 0, 0, 'horizontal');
player2.gameboard.placeShip(new Ship(3), 1, 1, 'vertical');
// player2.gameboard.placeShip(new Ship(2), 3, 4, 'horizontal');
//You are going to implement a system for allowing players to place their ships later.

player1.gameboard.printBoard();
player2.gameboard.printBoard();



