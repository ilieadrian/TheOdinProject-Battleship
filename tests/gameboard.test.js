import Gameboard from "../src/gameboard";
import Ship from "../src/ship";

let myGameboard = new Gameboard(10, 10);

test("placeShip should place a ship on the gameboard", () => {
  const myShip = new Ship(3);
  myGameboard.placeShip(myShip, 0, 0, "horizontal");

  expect(myGameboard.gameboard[0][0]).toBe(myShip);
  expect(myGameboard.gameboard[0][1]).toBe(myShip);
  expect(myGameboard.gameboard[0][2]).toBe(myShip);
});

test("placeShip should not allow placing a ship out of bounds", () => {
  const myShip = new Ship(3);
  myGameboard = new Gameboard(10, 10);
  expect(() => {
    myGameboard.placeShip(myShip, 0, 8, "horizontal");
  }).toThrow("Ship placement out of bounds");
});

test("placeShip should not allow overlapping ships", () => {
  myGameboard = new Gameboard(10, 10);
  const myShip1 = new Ship(3);
  const myShip2 = new Ship(3);
  myGameboard.placeShip(myShip1, 0, 0, "horizontal");
  expect(() => {
    myGameboard.placeShip(myShip2, 0, 1, "horizontal");
  }).toThrow("Ships cannot overlap");
});

test("receiveAttack should hit a ship", () => {
  const myShip = new Ship(3);
  myGameboard = new Gameboard(10, 10);
  myGameboard.placeShip(myShip, 0, 0, "horizontal");
  myGameboard.receiveAttack(0, 0);
  expect(myShip.getHits()).toBe(1);
  expect(myGameboard.gameboard[0][0]).toBe("hit");
});

test("receiveAttack should miss if no ship is present", () => {
  myGameboard = new Gameboard(10, 10);
  myGameboard.receiveAttack(1, 1);
  expect(myGameboard.gameboard[1][1]).toBe("miss");
});

test("receiveAttack should not hit out of bounds", () => {
  myGameboard = new Gameboard(10, 10);
  expect(() => {
    myGameboard.receiveAttack(10, 10);
  }).toThrow("Attack out of bounds");
});
test("allShipsSunk should return false if not all ships are sunk", () => {
  myGameboard = new Gameboard(10, 10);
  const myShip = new Ship(3);
  myGameboard.placeShip(myShip, 0, 0, "horizontal");
  expect(myGameboard.allShipsSunk()).toBe(false);
});
test("allShipsSunk should return true if all ships are sunk", () => {
  myGameboard = new Gameboard(10, 10);
  const myShip = new Ship(3);
  myGameboard.placeShip(myShip, 0, 0, "horizontal");
  myGameboard.receiveAttack(0, 0);
  myGameboard.receiveAttack(0, 1);
  myGameboard.receiveAttack(0, 2);
  expect(myGameboard.allShipsSunk()).toBe(true);
});
