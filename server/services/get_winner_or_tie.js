let get_winner_or_tie = (gameObj) => {
  if (gameObj.turn === 9) return "T";
  const game_state = gameObj.current_state;
  const signs = ["O", "X"];
  for (let si = 0; si < 2; si++) {
    const sign = signs[si];
    if (
      // main diagonal check
      game_state[0][0] == sign &&
      game_state[1][1] == sign &&
      game_state[2][2] == sign
    )
      return sign;
    if (
      // secondary diagonal check
      game_state[0][2] == sign &&
      game_state[1][1] == sign &&
      game_state[2][0] == sign
    )
      return sign;
    for (let i = 0; i < 3; i++) {
      if (
        // rows check
        game_state[i][0] == sign &&
        game_state[i][1] == sign &&
        game_state[i][2] == sign
      )
        return sign;
      if (
        // columns check
        game_state[0][i] == sign &&
        game_state[1][i] == sign &&
        game_state[2][i] == sign
      )
        return sign;
    }
  }
  return null;
};

module.exports.get_winner_or_tie = get_winner_or_tie;
