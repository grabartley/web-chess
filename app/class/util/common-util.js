class CommonUtil {
  static isInCheck(isWhiteTurn, board) {
    const friendlyKingSpace = board.getSpacesContainingPiece(King, isWhiteTurn)[0];
    const enemyPieces = board.getActiveSpacesForPlayer(!isWhiteTurn).map(space => space.piece);
    return enemyPieces
      .filter(piece => Boolean(piece.validMoveSet))
      .some(piece => (piece.validMoveSet)
        .map(move => move.to)
        .includes(friendlyKingSpace))
  }

  static isMovingIntoCheck(move, board) {
    const movedPiece = move.from.piece;
    const capturedPiece = board.simulateMove(move);
    const isPieceMovingIntoCheck = CommonUtil.isInCheck(movedPiece.isWhite, board);
    board.simulateMove(new Move(move.to, move.from));
    // put the captured piece back in place
    if (capturedPiece) {
      move.to.piece = capturedPiece;
    }
    return isPieceMovingIntoCheck;
  }

  static isInCheckmate(isWhiteTurn, board) {
    if (!CommonUtil.isInCheck(isWhiteTurn, board)) {
      return false;
    }
    const friendlySpaces = board.getActiveSpacesForPlayer(isWhiteTurn);
    for (const currentSpace of friendlySpaces) {
      const piece = currentSpace.piece;
      const validMoveSet = piece.validMoveSet;
      for (const move of validMoveSet) {
        if (!CommonUtil.isMovingIntoCheck(move, board)) {
          return false;
        }
      }
    }
    return true;
  }

  static calculateValidMoveSets(board) {
    board.getActiveSpaces().forEach(space => {
      space.piece.calculateValidMoveSet(space, board);
    });
  }

  static playSound(assetPath, volume = 0.25) {
    const audioAsset = new Audio(`./assets/sound/${assetPath}.mp3`);
    audioAsset.volume = volume;
    return audioAsset.play();
  }

  static sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static getHIndex(h) {
    const hIndex = HorizontalSpaceIndex.getIndexByName(h);

    return Number(hIndex === null ? -1 : hIndex);
  }

  static getHIndexBySpace(space) {
    return CommonUtil.getHIndex(space.h);
  }

  static getHDiff(move) {
    const currentHIndex = CommonUtil.getHIndexBySpace(move.from);
    const proposedHIndex = CommonUtil.getHIndexBySpace(move.to);

    return proposedHIndex - currentHIndex;
  }

  static getVIndex(v) {
    const vIndex = VerticalSpaceIndex.getIndexByName(v);

    return Number(vIndex === null ? -1 : vIndex);
  }

  static getVIndexBySpace(space) {
    return CommonUtil.getVIndex(space.v);
  }

  static getVDiff(move) {
    const currentVIndex = CommonUtil.getVIndexBySpace(move.from);
    const proposedVIndex = CommonUtil.getVIndexBySpace(move.to);

    return proposedVIndex - currentVIndex;
  }
}
