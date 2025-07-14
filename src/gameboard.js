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

    placeShip(ship, startX, startY, orientation){
        const length = ship.getLength();

        if (orientation === 'horizontal') {
            if (
                !(
                    this.gameboard[startX][startY] === undefined ||
                    this.gameboard[startX][startY + length - 1] === undefined
                )
            ) {
                for (let i = 0; i < length; i += 1) {
                    if (
                        typeof this.gameboard[startX][startY + i] === 'object' &&
                        this.gameboard[startX][startY + i] !== null
                    ) {
                        throw new Error('Ships cannot overlap');
                    }
                }
                for (let i = 0; i < length; i += 1) {
                    this.gameboard[startX][startY + i] = ship;
                }
                this.shipsCount += 1;
            } else {
                throw new Error('Ship placement out of bounds');
            }
        } else if (orientation === 'vertical') {
            if (
                !(
                    this.gameboard[startX][startY] === undefined ||
                    this.gameboard[startX + length - 1] === undefined
                )
            ) {
                for (let i = 0; i < length; i += 1) {
                    if (
                        typeof this.gameboard[startX + i][startY] === 'object' &&
                        this.gameboard[startX + i][startY] !== null
                    ) {
                        throw new Error('Ships cannot overlap');
                    }
                }
                for (let i = 0; i < length; i += 1) {
                    this.gameboard[startX + i][startY] = ship;
                }
                this.shipsCount += 1;
            } else {
                throw new Error('Ship placement out of bounds');
            }
        }
    }

    receiveAttack(startX, startY){
         if (
            this.gameboard[startX] === undefined ||
            this.gameboard[startX][startY] === undefined
        ) {
            throw new Error('Attack out of bounds');
        }
    }
    
}