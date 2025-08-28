import Ship from "./ship.js";

export default class Gameboard {
    constructor(size = 10) {
        this.size = size;
        this.gameboard = this.generateBoard();
        this.ships = [];
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
//   
//   placeShip(ship, startX, startY, orientation) {
//     const length = ship.getLength();

//     if (orientation === "horizontal") {
//       if (
//         !(
//           this.gameboard[startX][startY] === undefined ||
//           this.gameboard[startX][startY + length - 1] === undefined
//         )
//       ) {
//         for (let i = 0; i < length; i += 1) {
//           if (
//             typeof this.gameboard[startX][startY + i] === "object" &&
//             this.gameboard[startX][startY + i] !== null
//           ) {
//             throw new Error("Ships cannot overlap");
//           }
//         }
//         for (let i = 0; i < length; i += 1) {
//           this.gameboard[startX][startY + i] = ship;
//         }
//         this.shipsCount += 1;
//       } else {
//         throw new Error("Ship placement out of bounds");
//       }
//     } else if (orientation === "vertical") {
//       if (
//         !(
//           this.gameboard[startX][startY] === undefined ||
//           this.gameboard[startX + length - 1] === undefined
//         )
//       ) {
//         for (let i = 0; i < length; i += 1) {
//           if (
//             typeof this.gameboard[startX + i][startY] === "object" &&
//             this.gameboard[startX + i][startY] !== null
//           ) {
//             throw new Error("Ships cannot overlap");
//           }
//         }
//         for (let i = 0; i < length; i += 1) {
//           this.gameboard[startX + i][startY] = ship;
//         }
//         this.shipsCount += 1;
//       } else {
//         throw new Error("Ship placement out of bounds");
//       }
//     }
//   }

//   placeShipsRandomly() {
//     const shipLengths = [5, 4, 3, 3, 2]; // Standard Battleship ships
    
//     for (const length of shipLengths) {
//       let placed = false;
//       let attempts = 0;
//       const maxAttempts = 100;
      
//       while (!placed && attempts < maxAttempts) {
//         const x = Math.floor(Math.random() * this.gameboard.size);
//         const y = Math.floor(Math.random() * this.gameboard.size);
//         const isHorizontal = Math.random() < 0.5;
        
//         try {
//           this.gameboard.placeShip(x, y, length, isHorizontal);
//           placed = true;
//         } catch (error) {
//           attempts++;
//         }
//       }
      
//       if (!placed) {
//         throw new Error(`Failed to place ship of length ${length} after ${maxAttempts} attempts`);
//       }
//     }
//   }

//   receiveAttack(startX, startY) {
//     if (
//       this.gameboard[startX] === undefined ||
//       this.gameboard[startX][startY] === undefined
//     ) {
//       throw new Error("Attack out of bounds");
//     } else if (this.gameboard[startX][startY] === null) {
//       this.gameboard[startX][startY] = "miss";
//     } else if (typeof this.gameboard[startX][startY] === "object") {
//       this.gameboard[startX][startY].hit();
//       if (this.gameboard[startX][startY].isSunk()) {
//         this.shipsCount -= 1;
//       }
//       this.gameboard[startX][startY] = "hit";
//     } else {
//       throw new Error("Can not hit same spot twice");
//     }
//   }

//   allShipsSunk() {
//     if (this.shipsCount === 0) {
//       return true;
//     }
//     return false;
//   }
//   printBoard() {
//     const display = this.gameboard
//       .map((row) =>
//         row
//           .map((cell) => {
//             if (cell === null) return ".";
//             if (cell === "hit") return "X";
//             if (cell === "miss") return "o";
//             if (typeof cell === "object") return "S"; // ship
//           })
//           .join(" "),
//       )
//       .join("\n");

//       console.table(display)

//     return display;
//   }
// }