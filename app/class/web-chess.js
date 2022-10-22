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
    this.aiOpponent = new NormalAI();
  }

  play() {
    // prevented by https://goo.gl/xX8pDD
    // CommonUtil.playSound('setup');
    this.board.setUpPieces();
    CommonUtil.calculateValidMoveSets(this.board);
  }

  handleSpaceClicked(event) {
    if (!this.isWhiteTurn || this.state !== State.PLAY || this.turnInProgress) {
      return;
    }
    const clickedSpace = this.board.getSpaceById(event.target.id);
    if (!this.currentSpace) {
      if (!clickedSpace.hasPiece() || clickedSpace.piece.isWhite !== this.isWhiteTurn) {
        return;
      }
      for (const validMove of clickedSpace.piece.validMoveSet) {
        if (!CommonUtil.isMovingIntoCheck(validMove, this.board)) {
          document.getElementById(validMove.to.getId()).classList.add('valid-move');
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
      const move = new Move(currentSpace, proposedSpace);
      if (!this.handleTurn(move)) {
        this.proposedSpace = null;
      }
    }
  }

  async handleTurn(move) {
    if (!this.isValidMove(move)) {
      return false;
    }
    this.turnInProgress = true;
    try {
      this.takeTurn(move);
    } finally {
      this.updateBoard();
      await this.clearSpaceSelect();
      this.turnInProgress = false;
      // call the AI for non-white turn
      if (!this.isWhiteTurn) {
        this.aiOpponent.takeTurn(this.handleTurn.bind(this), this.board);
      }
    }
  }

  async clearSpaceSelect() {
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
    // sleep on non-white turn to improve game flow
    if (!this.isWhiteTurn) {
      await CommonUtil.sleep(2500);
    }
  }

  takeTurn(move) {
    console.log(`${this.isWhiteTurn ? 'White' : 'Black'} ${move.from.v}${move.from.h} to ${move.to.v}${move.to.h}...`);
    const capturedPiece = this.board.move(move);
    if (capturedPiece) {
      this.performCapture(capturedPiece);
    }
    CommonUtil.calculateValidMoveSets(this.board);
    if (CommonUtil.isInCheckmate(!this.isWhiteTurn, this.board)) {
      CommonUtil.playSound('checkmate', 0.5);
      console.log('CHECKMATE');
      this.handleCheckmate();
      return;
    }
    if (CommonUtil.isInCheck(!this.isWhiteTurn, this.board)) {
      CommonUtil.playSound('check');
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
    // commenting out board rotation for now due to AI usage
    // this.rotateBoard();
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
    CommonUtil.playSound('whoosh');
    boardEl.style.transform = rotation;
    boardEl.childNodes.forEach(childNode => {
      if (childNode && childNode.style) {
        childNode.style.transform = rotation;
      }
    });
  }

  isValidMove(move) {
    // additional checks before passing to piece checks
    const selectedPieceExistsAndIsYours =
      move.from.hasPiece() &&
      move.from.piece.isWhite == this.isWhiteTurn;
    const isNotCapturingKing = !(move.to.hasPiece() && move.to.piece instanceof King);

    if (selectedPieceExistsAndIsYours && isNotCapturingKing) {
      return move.from.piece.isValidMove(move, this.board);
    }

    return false;
  }

  performCapture(piece) {
    CommonUtil.playSound('attack');
    if (this.isWhiteTurn) {
      this.capturedBlackPieces.push(piece);
    } else {
      this.capturedWhitePieces.push(piece);
    }
  }

  handleCheckmate() {
    this.state = State.CHECKMATE;
    alert(`Game Over! ${this.isWhiteTurn ? 'White' : 'Black'} is the winner!`);
  }
}
