import Gameboard from "./gameboard.js";

export default class Player {
  constructor(name, isComputer = false) {
    this.name = name;
    this.isComputer = isComputer;
    this.gameboard = new Gameboard();
    this.attackedCoordinates = new Set();
  }

  attack(enemyGameboard, x, y) {
    if (enemyGameboard.hasBeenAttacked(x, y)) {
      throw new Error("Coordinate already attacked");
    }

    return enemyGameboard.receiveAttack(x, y);
  }

  makeRandomAttack(enemyGameboard) {
    if (!this.isComputer) {
      throw new Error("Only computer players can make random attacks");
    }

    const availableCoordinates = [];

    for (let x = 0; x < enemyGameboard.size; x++) {
      for (let y = 0; y < enemyGameboard.size; y++) {
        if (!enemyGameboard.hasBeenAttacked(x, y)) {
          availableCoordinates.push([x, y]);
        }
      }
    }

    if (availableCoordinates.length === 0) {
      throw new Error("No more moves available");
    }

    const randomIndex = Math.floor(Math.random() * availableCoordinates.length);
    const [x, y] = availableCoordinates[randomIndex];

    return this.attack(enemyGameboard, x, y);
  }

  placeShipsRandomly() {
    console.log("placeShipsRandomly fired")
    // const shipLengths = [5, 4, 3, 3, 2];
    const shipLengths = [2];

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
        throw new Error(
          `Failed to place ship of length ${length} after ${maxAttempts} attempts`,
        );
      }
    }
  }

  getName() {
    return this.name;
  }

  getGameboard() {
    return this.gameboard;
  }

  isComputerPlayer() {
    return this.isComputer;
  }
}
