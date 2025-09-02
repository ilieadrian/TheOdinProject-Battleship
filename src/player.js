import Gameboard from "./gameboard.js";

export default class Player {
  constructor(name, isComputer = false) {
    this.name = name;
    this.isComputer = isComputer;
    this.gameboard = new Gameboard();
    this.attackedCoordinates = new Set();
  }

    //Curently working here
  attack(enemyGameboard, x, y) {
    if (enemyGameboard.hasBeenAttacked(x, y)) {
      throw new Error('Coordinate already attacked');
    }
    
    return enemyGameboard.receiveAttack(x, y);
  }

  placeShipsRandomly() {
    const shipLengths = [5, 4, 3, 3, 2]; 
    
    for (const length of shipLengths) {
      let placed = false;
      let attempts = 0;
      const maxAttempts = 100;
      
      while (!placed && attempts < maxAttempts) {
        const x = Math.floor(Math.random() * this.gameboard.size);
        const y = Math.floor(Math.random() * this.gameboard.size);
        const isHorizontal = Math.random() < 0.5;
        
        try {
          this.gameboard.placeShip(x, y, length, isHorizontal);
          placed = true;
        } catch (error) {
          attempts++;
        }
      }
      
      if (!placed) {
        throw new Error(`Failed to place ship of length ${length} after ${maxAttempts} attempts`);
      }
    }
  }

  getGameboard() {
    return this.gameboard;
  }
}