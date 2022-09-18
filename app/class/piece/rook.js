class Rook extends Piece {
  constructor(isWhite) {
    super(...arguments);
    this.isWhite = isWhite;
    this.isAbleToJump = false;
    this.emoji = isWhite ? "♖" : "♜";
  }

  isValidMoveInternal(hDiff, vDiff, isCapturing) {
    const isMovingHorizontally = hDiff == 0 && vDiff != 0;
    const isMovingVertically = vDiff == 0 && hDiff != 0;
    return isMovingHorizontally || isMovingVertically;
  }
}
