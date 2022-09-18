class Pawn extends Piece {
  constructor(isWhite) {
    super(...arguments);
    this.isWhite = isWhite;
    this.isAbleToJump = false;
    this.emoji = isWhite ? "♙" : "♟";
  }

  isValidMoveInternal(hDiff, vDiff, isCapturing) {
    const isMovingDiagonallyForwardOne = Math.abs(hDiff) == Math.abs(vDiff) && (this.isWhite ? hDiff == 1 : hDiff == -1);
    const isMovingForwardOne = vDiff == 0 && (this.isWhite ? hDiff == 1 : hDiff == -1);
    const isMovingForwardTwoOnFirstMove = vDiff == 0 && !this.hasMoved && (this.isWhite ? hDiff == 2 : hDiff == -2);
    if (isCapturing) {
      return isMovingDiagonallyForwardOne;
    }
    return isMovingForwardOne || isMovingForwardTwoOnFirstMove;
  }
}
