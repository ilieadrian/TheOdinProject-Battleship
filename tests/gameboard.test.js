import Gameboard from "../src/gameboard";
import Ship from "../src/ship";

let myGameboard = new Gameboard(10, 10);

test('placeShip should place a ship on the gameboard', () => {
    const myShip = new Ship(3);
    myGameboard.placeShip(myShip, 0, 0, 'horizontal');
    expect(myGameboard.generateBoard()[0][0]).toBe(myShip);
    expect(myGameboard.generateBoard()[0][1]).toBe(myShip);
    expect(myGameboard.generateBoard()[0][2]).toBe(myShip);
});