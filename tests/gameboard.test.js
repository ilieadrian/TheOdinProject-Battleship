import Gameboard from "../src/gameboard";
import Ship from "../src/ship";

let myGameboard = new Gameboard(10, 10);


test('placeShip should place a ship on the gameboard', () => {
  const myShip = new Ship(3);
  myGameboard.placeShip(myShip, 0, 0, 'horizontal');

  expect(myGameboard.gameboard[0][0]).toBe(myShip);
  expect(myGameboard.gameboard[0][1]).toBe(myShip);
  expect(myGameboard.gameboard[0][2]).toBe(myShip);
});

test('placeShip should not allow placing a ship out of bounds', () => {
    const myShip = new Ship(3);
    myGameboard = new Gameboard(10, 10);
    expect(() => {
        myGameboard.placeShip(myShip, 0, 8, 'horizontal');
    }).toThrow('Ship placement out of bounds');
});
test('placeShip should not allow overlapping ships', () => {
    myGameboard = new Gameboard(10, 10);
    const myShip1 = new Ship(3);
    const myShip2 = new Ship(3);
    myGameboard.placeShip(myShip1, 0, 0, 'horizontal');
    expect(() => {
        myGameboard.placeShip(myShip2, 0, 1, 'horizontal');
    }).toThrow('Ships cannot overlap');
});