import Gameboard from './gameboard';

class Player {
    constructor(name) {
        this.name = name;
        this.gameboard = new Gameboard(10, 10);
    }
}

export default Player;