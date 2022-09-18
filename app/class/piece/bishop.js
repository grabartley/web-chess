class Bishop extends Piece {
  constructor(isWhite) {
    super(...arguments);
    this.isWhite = isWhite;
    this.isAbleToJump = false;
    this.emoji = isWhite ? "♗" : "♝";
  }

  isValidMoveInternal(hDiff, vDiff, isCapturing) {
    return hDiff != 0 && Math.abs(hDiff) == Math.abs(vDiff);
  }
}
