class Queen extends Piece {
  constructor(isWhite) {
    super(...arguments);
    this.isWhite = isWhite;
    this.isAbleToJump = false;
    this.emoji = isWhite ? "♕" : "♛";
  }

  isValidMoveInternal(hDiff, vDiff, isCapturing) {
    const isMovingHorizontally = hDiff == 0 && vDiff != 0;
    const isMovingVertically = vDiff == 0 && hDiff != 0;
    const isMovingDiagonally = hDiff != 0 && Math.abs(hDiff) == Math.abs(vDiff);
    return isMovingHorizontally || isMovingVertically || isMovingDiagonally;
  }
}
