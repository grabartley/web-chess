class King extends Piece {
  constructor(isWhite) {
    super(...arguments);
    this.isWhite = isWhite;
    this.isAbleToJump = false;
    this.emoji = isWhite ? "♔" : "♚";
  }

  isValidMoveInternal(hDiff, vDiff, isCapturing) {
    return (Math.abs(hDiff) == 1 && Math.abs(vDiff) == 1) ||
            (hDiff == 0 && Math.abs(vDiff) == 1) ||
            (vDiff == 0 && Math.abs(hDiff) == 1);
  }
}
