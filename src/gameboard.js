export default class Gameboard {
    constructor(x, y) {
        this.rows = x;
        this.columns = y;
        this.gameboard = this.generateBoard(this.rows, this.columns);
        this.shipsCount = 0;
    }

    generateBoard(r, c) {
        const gameboard = Array.from({ length: r }, () =>
            Array.from({ length: c }, () => null)
        );
        return gameboard;
    }

    
}