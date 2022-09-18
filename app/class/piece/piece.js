class Piece {
  constructor() {
    if (this.constructor == Piece) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  simulateMove(currentSpace, proposedSpace) {
    const capturedPiece = proposedSpace.hasPiece() ? proposedSpace.piece : null;
    currentSpace.piece = null;
    proposedSpace.piece = this;
    return capturedPiece;
  }

  move(currentSpace, proposedSpace) {
    const capturedPiece = this.simulateMove(currentSpace, proposedSpace);
    this.hasMoved = true;
    return capturedPiece;
  }

  calculateValidMoveSet(currentSpace, board) {
    this.validMoveSet = board.allSpaces.filter(space => this.isValidMove(currentSpace, space, board));
  }

  isValidMoveInternal(hDiff, vDiff, isCapturing) {}

  isValidMove(currentSpace, proposedSpace, board) {
    const capturingYourOwnPiece = proposedSpace.hasPiece() && proposedSpace.piece.isWhite == this.isWhite;
    const pathIsBlockedAndCantJump = !this.isAbleToJump && !board.isPathClear(currentSpace, proposedSpace);
    if (capturingYourOwnPiece || pathIsBlockedAndCantJump) {
      return false;
    }

    const hDiff = CommonUtil.getHDiff(currentSpace, proposedSpace);
    const vDiff = CommonUtil.getVDiff(currentSpace, proposedSpace);

    return this.isValidMoveInternal(hDiff, vDiff, proposedSpace.hasPiece());
  }
}
