export default class Ship {
  constructor(length, name) {
    if (length <= 0) {
      throw new Error("Ship length must be greater than 0");
    }
    this.length = length;
    this.hits = 0;
    this.name = name;
  }

  getLength() {
    return this.length;
  }

  hit() {
    if (this.hits < this.length) {
      this.hits++;
    }
  }

  setName(name) {
    this.name = name;
  }

  getHits() {
    return this.hits;
  }

  getName(){
    return this.name;
  }

  isSunk() {
    return this.hits >= this.length;
  }
}
