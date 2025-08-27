import Gameboard from "./gameboard.js";

// export default class Player {
//   constructor(name) {
//     this.name = name;
//     this.gameboard = new Gameboard(10, 10);
//   }
// }
export default class Player {
  constructor(name, isComputer = false) {
    this.name = name;
    this.isComputer = isComputer;
    this.gameboard = new Gameboard();
    this.attackedCoordinates = new Set();
  }
}