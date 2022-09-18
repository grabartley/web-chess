class Space {
  constructor(h, v, piece) {
    this.h = h;
    this.v = v;
    this.piece = piece;
  }

  getId() {
    return `${this.v}${this.h}`;
  }

  hasPiece() {
    return Boolean(this.piece);
  }
}
