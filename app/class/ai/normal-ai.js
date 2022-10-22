/*

Basic "AI" Opponent to play against

*/
class NormalAI {
  constructor() {}

  static LOOKAHEAD = 1;
  static BASE_SCORE = 1;
  static CAPTURE_SCORE = .3;

  takeTurn(callback, board, isWhiteTurn = false) {
    const activeSpaces = board.getActiveSpacesForPlayer(isWhiteTurn);
    const scoredMoves = [];
    let highestScore = null;
    for(const activeSpace of activeSpaces) {
      for (const move of activeSpace.piece.validMoveSet) {
        if (!CommonUtil.isMovingIntoCheck(move, board)) {
          this.scoreMove(move);
          if (move.score > highestScore || highestScore == null) {
            highestScore = move.score;
          }
          scoredMoves.push(move);
        }
      }
    }
    const highestScoredMoves = scoredMoves.filter(move => move.score === highestScore);
    const moveChoiceIndex = Math.floor(Math.random() * highestScoredMoves.length);
    callback(highestScoredMoves[moveChoiceIndex]);
  }

  scoreMove(move) {
    let score = NormalAI.BASE_SCORE;
    // if a capture would be performed
    if (move.to.hasPiece()) {
      score += NormalAI.CAPTURE_SCORE;
    }
    // add randomness and round to two decimal places
    score = Math.round((Math.random() * score) * 100) / 100;
    // set the score
    move.score = score;
  }
}
