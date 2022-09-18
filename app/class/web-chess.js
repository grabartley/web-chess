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
