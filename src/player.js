import Gameboard from './gameboard.js';

export default class Player {
    constructor(name) {
        this.name = name;
        this.gameboard = new Gameboard(10, 10);
    }
}