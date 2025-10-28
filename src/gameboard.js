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
    return Array(this.size)
      .fill(null)
      .map(() => Array(this.size).fill(null));
  }

  isValidCoordinate(x, y) {
    return x >= 0 && x < this.size && y >= 0 && y < this.size;
  }

  canPlaceShip(x, y, length, isHorizontal) {
    if (isHorizontal) {
      if (x + length > this.size) return false;
    } else {
      if (y + length > this.size) return false;
    }

    for (let i = 0; i < length; i++) {
      const checkX = isHorizontal ? x + i : x;
      const checkY = isHorizontal ? y : y + i;
      if (this.gameboard[checkY][checkX] !== null) {
        return false;
      }
    }

    return true;
  }

  placeShip(x, y, length, isHorizontal = true, name) {
    if (!this.isValidCoordinate(x, y)) {
      throw new Error("Invalid coordinates");
    }

    if (!this.canPlaceShip(x, y, length, isHorizontal)) {
      throw new Error("Cannot place ship at specified location");
    }

    const ship = new Ship(length, name);
    const shipData = {
      ship,
      coordinates: [],
    };
    
    for (let i = 0; i < length; i++) {
      const placeX = isHorizontal ? x + i : x;
      const placeY = isHorizontal ? y : y + i;
      this.gameboard[placeY][placeX] = {ship, name};
      shipData.coordinates.push([placeY, placeX]);
    }

    // Remove this after ship class implementation
      // Remove this after ship class implementation
        // Remove this after ship class implementation
    console.log("Shipdata bellow")
    console.table(shipData)
        // Remove this after ship class implementation  
      // Remove this after ship class implementation
    // Remove this after ship class implementation

    this.ships.push(shipData);
    return ship;
  }

  receiveAttack(x, y) {
    if (!this.isValidCoordinate(x, y)) {
      throw new Error("Invalid coordinates");
    }

    const coordinateKey = `${x},${y}`;
    if (this.attackedCoordinates.has(coordinateKey)) {
      throw new Error("Coordinate already attacked");
    }

    this.attackedCoordinates.add(coordinateKey);

    const target = this.gameboard[y][x];

    if (target === null) {
      this.missedAttacks.push([x, y]);
      return { hit: false, ship: null, sunk: false };
    } else {
      target.hit();
      const sunk = target.isSunk();
      return { hit: true, ship: target, sunk };
    }
  }

  getMissedAttacks() {
    return [...this.missedAttacks];
  }

  allShipsSunk() {
    return this.ships.every((shipData) => shipData.ship.isSunk());
  }

  getShipAt(x, y) {
    if (!this.isValidCoordinate(x, y)) return null;
    return this.gameboard[y][x];
  }

  getShips() {
    return this.ships.map((shipData) => ({
      ship: shipData.ship,
      coordinates: [...shipData.coordinates],
    }));
  }

  hasBeenAttacked(x, y) {
    return this.attackedCoordinates.has(`${x},${y}`);
  }
}
