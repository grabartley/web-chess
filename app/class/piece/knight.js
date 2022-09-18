class Knight extends Piece {
  constructor(isWhite) {
    super(...arguments);
    this.isWhite = isWhite;
    this.isAbleToJump = true;
    this.emoji = isWhite ? "♘" : "♞";
  }

  isValidMoveInternal(hDiff, vDiff, isCapturing) {
    return (Math.abs(hDiff) == 1 && Math.abs(vDiff) == 2) || (Math.abs(hDiff) == 2 && Math.abs(vDiff) == 1);
  }
}
