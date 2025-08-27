export default class Gameboard {
    constructor(size = 10) {
        this.size = size;
        this.gameboard = this.generateBoard();
        this.shipsCount = 0;
    }

    generateBoard() {
        return Array(this.size).fill(null).map(() => Array(this.size).fill(null));
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