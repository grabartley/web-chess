class Board {
  constructor() {
    this.board = [];
    this.allSpaces = [];

    // add spaces to the board
    for (let i = 0; i < 8; i++) {
      this.board[i] = [];
      const h = HorizontalSpaceIndex.getNameByIndex(i);
      for (let j = 0; j < 8; j++) {
        const v = VerticalSpaceIndex.getNameByIndex(j);
        const space = new Space(h, v, null);
        this.board[i][j] = space;
        this.allSpaces.push(space);
      }
    }
  }

  setUpPieces() {
    this.board[0][0].piece = new Rook(true);
    this.board[0][1].piece = new Knight(true);
    this.board[0][2].piece = new Bishop(true);
    this.board[0][3].piece = new Queen(true);
    this.board[0][4].piece = new King(true);
    this.board[0][5].piece = new Bishop(true);
    this.board[0][6].piece = new Knight(true);
    this.board[0][7].piece = new Rook(true);
    for (let i = 0; i < 8; i++) {
      this.board[1][i].piece = new Pawn(true);
      this.board[2][i].piece = null;
      this.board[3][i].piece = null;
      this.board[4][i].piece = null;
      this.board[5][i].piece = null;
      this.board[6][i].piece = new Pawn(false);
    }
    this.board[7][0].piece = new Rook(false);
    this.board[7][1].piece = new Knight(false);
    this.board[7][2].piece = new Bishop(false);
    this.board[7][3].piece = new King(false);
    this.board[7][4].piece = new Queen(false);
    this.board[7][5].piece = new Bishop(false);
    this.board[7][6].piece = new Knight(false);
    this.board[7][7].piece = new Rook(false);
  }

  getSpaceById(id) {
    if (!id || id.length !== 2) {
      return null;
    }
    return this.getSpaceByHV(id[1], id[0]);
  }

  getSpaceByHV(h, v) {
    const hIndex = CommonUtil.getHIndex(h);
    const vIndex = CommonUtil.getVIndex(v);

    return this.board[hIndex][vIndex];
  }

  getActiveSpaces() {
    return this.allSpaces.filter(space => space.hasPiece());
  }

  getActiveSpacesForPlayer(isWhiteTurn) {
    return this.getActiveSpaces().filter(space => space.piece.isWhite === isWhiteTurn);
  }

  getSpacesContainingPiece(pieceType, isWhiteTurn) {
    return this.getActiveSpacesForPlayer(isWhiteTurn).filter(space => space.piece instanceof pieceType);
  }

  isPathClear(currentSpace, proposedSpace) {
    return !this.getSpacesBetween(currentSpace, proposedSpace).some(space => space.hasPiece());
  }

  getSpacesBetween(currentSpace, proposedSpace) {
    const currentHIndex = CommonUtil.getHIndexBySpace(currentSpace);
    const currentVIndex = CommonUtil.getVIndexBySpace(currentSpace);
    const hDiff = CommonUtil.getHDiff(currentSpace, proposedSpace);
    const vDiff = CommonUtil.getVDiff(currentSpace, proposedSpace);
    const isSameSpace = hDiff == 0 && vDiff == 0;
    const isAdjacentSpace = hDiff == 1 || hDiff == -1 || vDiff == 1 || vDiff == -1;
    const isDiagonalSpace = Math.abs(hDiff) == Math.abs(vDiff);
    const isHorizontalSpace = hDiff == 0;

    if (isSameSpace || isAdjacentSpace) {
      return [];
    }

    if (isDiagonalSpace) {
      return this.getSpacesBetweenDiagonal(currentHIndex, currentVIndex, hDiff, vDiff);
    }

    if (isHorizontalSpace) {
      return this.getSpacesBetweenHorizontal(currentHIndex, currentVIndex, vDiff);
    }

    return this.getSpacesBetweenVertical(currentHIndex, currentVIndex, hDiff);
  }

  getSpacesBetweenDiagonal(currentHIndex, currentVIndex, hDiff, vDiff) {
    const spacesBetween = [];
    const numOfSpacesBetween = Math.abs(hDiff) - 1;

    for (let i = 1; i <= numOfSpacesBetween; i++) {
      const hIndex = currentHIndex + (hDiff < 0 ? -1 * i : i);
      const vIndex = currentVIndex + (vDiff < 0 ? -1 * i : i);
      spacesBetween.push(this.board[hIndex][vIndex]);
    }

    return spacesBetween;
  }

  getSpacesBetweenHorizontal(currentHIndex, currentVIndex, vDiff) {
    const spacesBetween = [];
    const numOfSpacesBetween = Math.abs(vDiff) - 1;

    for (let i = 1; i <= numOfSpacesBetween; i++) {
      const vIndex = currentVIndex + (vDiff < 0 ? -1 * i : i);
      spacesBetween.push(this.board[currentHIndex][vIndex]);
    }

    return spacesBetween;
  }

  getSpacesBetweenVertical(currentHIndex, currentVIndex, hDiff) {
    const spacesBetween = [];
    const numOfSpacesBetween = Math.abs(hDiff) - 1;

    for (let i = 1; i <= numOfSpacesBetween; i++) {
      const hIndex = currentHIndex + (hDiff < 0 ? -1 * i : i);
      spacesBetween.push(this.board[hIndex][currentVIndex]);
    }

    return spacesBetween;
  }
}
