export default class Ship {
  constructor(length) {
    if (length <= 0) {
      throw new Error("Ship length must be greater than 0");
    }
    this.length = length;
    this.hits = 0;
  }

  getLength() {
    return this.length;
  }

  hit() {
    if (this.hits < this.length) {
      this.hits++;
    }
  }

  getHits() {
    return this.hits;
  }

  isSunk() {
    return this.hits >= this.length;
  }
}
