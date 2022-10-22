class Piece {
  constructor() {
    if (this.constructor == Piece) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  calculateValidMoveSet(currentSpace, board) {
    this.validMoveSet = board.allSpaces
      .map((space) => new Move(currentSpace, space))
      .filter(move => this.isValidMove(move, board));
  }

  isValidMoveInternal(hDiff, vDiff, isCapturing) {}

  isValidMove(move, board) {
    const capturingYourOwnPiece = move.to.hasPiece() && move.to.piece.isWhite == this.isWhite;
    const pathIsBlockedAndCantJump = !this.isAbleToJump && !board.isPathClear(move);
    if (capturingYourOwnPiece || pathIsBlockedAndCantJump) {
      return false;
    }

    const hDiff = CommonUtil.getHDiff(move);
    const vDiff = CommonUtil.getVDiff(move);

    return this.isValidMoveInternal(hDiff, vDiff, move.to.hasPiece());
  }
}
