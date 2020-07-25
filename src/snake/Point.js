class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  equals(other) {
    return this.x === other.x && this.y === other.y;
  }
  move(dir) {
    switch (dir) {
      case 'up':
        return new Point(this.x, this.y - 1);
      case 'right':
        return new Point(this.x + 1, this.y);
      case 'down':
        return new Point(this.x, this.y + 1);
      case 'left':
        return new Point(this.x - 1, this.y);
    }
  }
}

export default Point;
