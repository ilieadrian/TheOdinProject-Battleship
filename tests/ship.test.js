import Ship from '../src/ship.js';

test('Ship is created with correct length', () => {
  const ship = Ship(3);
  expect(ship.length).toBe(3);
});

test('Ship can be hit', () => {
  const ship = Ship(2);
  ship.hit();
  expect(ship.isSunk()).toBe(false);
  ship.hit();
  expect(ship.isSunk()).toBe(true);
});