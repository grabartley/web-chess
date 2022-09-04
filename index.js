/* enums */
const State = {
  MENU: 0,
  NEW_GAME: 1,
  PLAY: 2,
  CHECKMATE: 3,
  EXIT: 4
};

/* classes */
class HorizontalSpaceIndex {
  static mapping = {
    0: '1',
    1: '2',
    2: '3',
    3: '4',
    4: '5',
    5: '6',
    6: '7',
    7: '8',
  };
  static keys = Object.keys(HorizontalSpaceIndex.mapping);

  static getNameByIndex(i) {
    return HorizontalSpaceIndex.mapping[i];
  }

  static getIndexByName(name) {
    return Number(HorizontalSpaceIndex.keys.find(key => HorizontalSpaceIndex.mapping[key] === name));
  }
}

class VerticalSpaceIndex {
  static mapping = {
    0: 'a',
    1: 'b',
    2: 'c',
    3: 'd',
    4: 'e',
    5: 'f',
    6: 'g',
    7: 'h',
  };
  static keys = Object.keys(VerticalSpaceIndex.mapping);

  static getNameByIndex(i) {
    return VerticalSpaceIndex.mapping[i];
  }

  static getIndexByName(name) {
    return Number(VerticalSpaceIndex.keys.find(key => VerticalSpaceIndex.mapping[key] === name));
  }
}

class CommonUtil {
  static getHIndex(h) {
    const hIndex = HorizontalSpaceIndex.getIndexByName(h);

    return Number(hIndex === null ? -1 : hIndex);
  }

  static getHIndexBySpace(space) {
    return CommonUtil.getHIndex(space.h);
  }

  static getHDiff(currentSpace, proposedSpace) {
    const currentHIndex = CommonUtil.getHIndexBySpace(currentSpace);
    const proposedHIndex = CommonUtil.getHIndexBySpace(proposedSpace);

    return proposedHIndex - currentHIndex;
  }

  static getVIndex(v) {
    const vIndex = VerticalSpaceIndex.getIndexByName(v);

    return Number(vIndex === null ? -1 : vIndex);
  }

  static getVIndexBySpace(space) {
    return CommonUtil.getVIndex(space.v);
  }

  static getVDiff(currentSpace, proposedSpace) {
    const currentVIndex = CommonUtil.getVIndexBySpace(currentSpace);
    const proposedVIndex = CommonUtil.getVIndexBySpace(proposedSpace);

    return proposedVIndex - currentVIndex;
  }
}

class Space {
  constructor(h, v, piece) {
    this.h = h;
    this.v = v;
    this.piece = piece;
  }

  getId() {
    return `${this.v}${this.h}`;
  }

  hasPiece() {
    return Boolean(this.piece);
  }
}

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

/* main class */
class WebChess {
  constructor(state = undefined, board = undefined) {
    this.state = state || State.PLAY;
    this.board = board || new Board();
    this.isWhiteTurn = true;
    this.turnInProgress = false;
    this.currentSpace = null;
    this.proposedSpace = null;
    this.capturedWhitePieces = [];
    this.capturedBlackPieces = [];
  }

  play() {
    this.board.setUpPieces();
  }

  showMenu() {
    // noop
    console.error("Not implemented yet.");
  }
  
  newGame() {
    // noop
    console.error("Not implemented yet.");
  }
  
  handleSpaceClicked(event) {
    if (this.state !== State.PLAY || this.turnInProgress) {
      return;
    }
    const clickedSpace = this.board.getSpaceById(event.target.id);
    if (!this.currentSpace) {
      if (!clickedSpace.hasPiece() || clickedSpace.piece.isWhite !== this.isWhiteTurn) {
        return;
      }
      clickedSpace.piece.calculateValidMoveSet(clickedSpace, this.board);
      for (const validMoveSpace of clickedSpace.piece.validMoveSet) {
        if (!this.isMovingIntoCheck(clickedSpace.piece, clickedSpace, validMoveSpace)) {
          document.getElementById(validMoveSpace.getId()).classList.add('valid-move');
        }
      }
      document.getElementById(event.target.id).classList.add('selected');
      this.currentSpace = event;
    } else if (this.currentSpace.target.id === event.target.id) {
      this.clearSpaceSelect();
    } else if (!this.proposedSpace) {
      if (clickedSpace.hasPiece() && clickedSpace.piece.isWhite === this.isWhiteTurn) {
        this.clearSpaceSelect();
        return this.handleSpaceClicked(event);
      } else {
        this.proposedSpace = event;
      }
    }
    if (this.currentSpace && this.proposedSpace) {
      const currentSpace = this.board.getSpaceById(this.currentSpace.target.id);
      const proposedSpace = this.board.getSpaceById(this.proposedSpace.target.id);
      if (this.isValidMove(currentSpace, proposedSpace)) {
        this.handleTurn(currentSpace, proposedSpace);
      } else {
        this.proposedSpace = null;
      }
    }
  }

  handleTurn(currentSpace, proposedSpace) {
    this.turnInProgress = true;
    try {
      this.takeTurn(currentSpace, proposedSpace);
    } finally {
      this.updateBoard();
      this.clearSpaceSelect();
      this.turnInProgress = false;
    }
  }

  clearSpaceSelect() {
    if (this.currentSpace) {
      const validMoveEls = Array.from(document.getElementsByClassName('valid-move'));
      for (const validMoveEl of validMoveEls) {
        validMoveEl.classList.remove('valid-move');
      }
      document.getElementById(this.currentSpace.target.id).classList.remove('selected');
      this.currentSpace = null;
    }
    if (this.proposedSpace) {
      this.proposedSpace = null;
    }
  }
  
  takeTurn(currentSpace, proposedSpace) {
    console.log(`Attempting to move ${currentSpace.v}${currentSpace.h} to ${proposedSpace.v}${proposedSpace.h}...`);
    const capturedPiece = currentSpace.piece.move(currentSpace, proposedSpace);
    if (capturedPiece) {
      this.performCapture(capturedPiece);
    }
    if (this.isInCheckmate(!this.isWhiteTurn)) {
      this.playSound('checkmate', 0.75);
      console.log('CHECKMATE');
      this.handleCheckmate();
      return;
    }
    if (this.isInCheck(!this.isWhiteTurn)) {
      this.playSound('check', 0.75);
      console.log('CHECK');
    }
    this.isWhiteTurn = !this.isWhiteTurn;
  }

  updateBoard() {
    this.board.allSpaces.forEach(space => {
      const spaceEl = document.getElementById(space.getId());
      if (space.piece) {
        spaceEl.innerText = space.piece.emoji;
      } else {
        spaceEl.innerText = '';
      }
    });
    this.updateGraveyards();
    this.rotateBoard();
  }

  updateGraveyards() {
    if (this.isWhiteTurn) {
      const whiteGraveyardEl = document.getElementById('back-left');
      whiteGraveyardEl.innerText = '';
      for (const capturedPiece of this.capturedWhitePieces) {
        whiteGraveyardEl.innerText = whiteGraveyardEl.innerText + capturedPiece.emoji;
      }
    } else {
      const blackGraveyardEl = document.getElementById('back-right');
      blackGraveyardEl.innerText = '';
      for (const capturedPiece of this.capturedBlackPieces) {
        blackGraveyardEl.innerText = blackGraveyardEl.innerText + capturedPiece.emoji;
      }
    }
  }

  rotateBoard() {
    const boardEl = document.getElementById('board');
    const rotation = this.isWhiteTurn ? '' : 'rotate(180deg)';
    this.playSound('whoosh');
    boardEl.style.transform = rotation;
    boardEl.childNodes.forEach(childNode => {
      if (childNode && childNode.style) {
        childNode.style.transform = rotation;
      }
    });
  }

  isValidMove(currentSpace, proposedSpace) {
    const selectedPieceExistsAndIsYours = 
      currentSpace.hasPiece() &&
      currentSpace.piece.isWhite == this.isWhiteTurn;
    
    if (selectedPieceExistsAndIsYours) {
      const isMovingIntoCheck = this.isMovingIntoCheck(currentSpace.piece, currentSpace, proposedSpace);
      return currentSpace.piece.isValidMove(currentSpace, proposedSpace, this.board) && !isMovingIntoCheck;
    }

    return false;
  }

  isMovingIntoCheck(piece, currentSpace, proposedSpace) {
    const capturedPiece = piece.simulateMove(currentSpace, proposedSpace);
    const isPieceMovingIntoCheck = this.isInCheck(piece.isWhite);
    piece.simulateMove(proposedSpace, currentSpace);
    // put the captured piece back in place
    if (capturedPiece) {
      proposedSpace.piece = capturedPiece;
    }
    return isPieceMovingIntoCheck;
  }

  performCapture(piece) {
    const attackSoundNum = Math.ceil(Math.random() * 3);
    this.playSound(`attack${attackSoundNum}`);
    if (this.isWhiteTurn) {
      this.capturedBlackPieces.push(piece);
    } else {
      this.capturedWhitePieces.push(piece);
    }
  }

  calculateValidMoveSets() {
    this.board.getActiveSpaces().forEach(space => {
      space.piece.calculateValidMoveSet(space, this.board);
    });
  }

  isInCheckmate(isWhiteTurn) {
    if (!this.isInCheck(isWhiteTurn)) {
      return false;
    }
    const friendlySpaces = this.board.getActiveSpacesForPlayer(isWhiteTurn);
    for (const currentSpace of friendlySpaces) {
      const piece = currentSpace.piece;
      const validMoveSet = piece.validMoveSet;
      for (const proposedSpace of validMoveSet) {
        if (!this.isMovingIntoCheck(piece, currentSpace, proposedSpace)) {
          return false;
        }
      }
    }
    return true;
  }

  isInCheck(isWhiteTurn) {
    this.calculateValidMoveSets();
    const friendlyKingSpace = this.board.getSpacesContainingPiece(King, isWhiteTurn)[0];
    const enemyPieces = this.board.getActiveSpacesForPlayer(!isWhiteTurn).map(space => space.piece);
    return enemyPieces.some(piece => piece.validMoveSet.includes(friendlyKingSpace))
  }

  handleCheckmate() {
    this.state = State.CHECKMATE;
    alert(`Game Over! ${this.isWhiteTurn ? 'White' : 'Black'} is the winner!`);
  }

  playSound(assetPath, volume = 0.5) {
    const audioAsset = new Audio(`./assets/sound/${assetPath}.mp3`);
    audioAsset.volume = volume;
    return audioAsset.play();
  }
}

/* create the main game object */
const webChess = new WebChess();

/* register event listeners */
document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
function onDOMContentLoaded() {
  webChess.updateBoard();
  for (let i = 1; i < 9; i++) {
    addClickEvent(`a${i}`);
    addClickEvent(`b${i}`);
    addClickEvent(`c${i}`);
    addClickEvent(`d${i}`);
    addClickEvent(`e${i}`);
    addClickEvent(`f${i}`);
    addClickEvent(`g${i}`);
    addClickEvent(`h${i}`);
  }
}
function addClickEvent(id) {
  document.getElementById(id).addEventListener('click', webChess.handleSpaceClicked.bind(webChess));
}

/* invoke the entrypoint */
webChess.play();
