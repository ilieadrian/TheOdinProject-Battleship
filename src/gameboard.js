import Ship from "./ship.js";

export default class Gameboard {
    constructor(size = 10) {
        this.size = size;
        this.gameboard = this.generateBoard();
        this.ships = [];
        this.missedAttacks = [];
        this.attackedCoordinates = new Set();
    }

  generateBoard() {
    return Array(this.size).fill(null).map(() => Array(this.size).fill(null));
  }

  isValidCoordinate(x, y) {
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }

  canPlaceShip(x, y, length, isHorizontal) {
    // Check if ship fits within board boundaries
    if (isHorizontal) {
      if (x + length > this.size) return false;
    } else {
      if (y + length > this.size) return false;
    }

    for (let i = 0; i < length; i++) {
      const checkX = isHorizontal ? x + i : x;
      const checkY = isHorizontal ? y : y + i;
      if (this.gameboard[checkX][checkY] !== null) {
        return false;
      }
    }

    return true;
  }

  placeShip(x, y, length, isHorizontal = true) {
    if (!this.isValidCoordinate(x, y)) {
      throw new Error('Invalid coordinates');
    }

    if (!this.canPlaceShip(x, y, length, isHorizontal)) {
      throw new Error('Cannot place ship at specified location');
    }

    const ship = new Ship(length);
    const shipData = {
      ship,
      coordinates: []
    };

    // Place ship on board
    for (let i = 0; i < length; i++) {
      const placeX = isHorizontal ? x + i : x;
      const placeY = isHorizontal ? y : y + i;
      
      this.gameboard[placeX][placeY] = ship;
      shipData.coordinates.push([placeX, placeY]);
    }

    this.ships.push(shipData);
    return ship;
  }

  receiveAttack(x, y) {
    if (!this.isValidCoordinate(x, y)) {
      throw new Error('Invalid coordinates');
    }

    const coordinateKey = `${x},${y}`;
    if (this.attackedCoordinates.has(coordinateKey)) {
      throw new Error('Coordinate already attacked');
    }

    this.attackedCoordinates.add(coordinateKey);

    const target = this.gameboard[y][x];
    
    if (target === null) {
      console.log("Missed hit")
      // Miss
      this.missedAttacks.push([x, y]);
      return { hit: false, ship: null, sunk: false };
    } else {
      // Hit
      console.log("hit hit")
      target.hit();
      const sunk = target.isSunk();
      return { hit: true, ship: target, sunk };
    }
  }

  allShipsSunk() {
    return this.ships.every(shipData => shipData.ship.isSunk());
  }

  getShipAt(x, y) {
    if (!this.isValidCoordinate(x, y)) return null;
    return this.gameboard[y][x];
  }

  hasBeenAttacked(x, y) {
    return this.attackedCoordinates.has(`${x},${y}`);
  }

  printBoard() {
    const display = this.gameboard
      .map((row) =>
        row
          .map((cell) => {
            if (cell === null) return ".";
            if (cell === "hit") return "X";
            if (cell === "miss") return "o";
            if (typeof cell === "object") return "S"; // ship
          })
          .join(" "),
      )
      .join("\n");

    return display;
  }
}