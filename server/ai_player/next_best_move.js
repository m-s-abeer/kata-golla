const moves = [
  [0, 0],
  [0, 1],
  [0, 2],
  [1, 0],
  [1, 1],
  [1, 2],
  [2, 0],
  [2, 1],
  [2, 2],
];

let get_best_move = (game_state, sign, is_winning_state) => {
  if (is_winning_state(game_state))
    return { wins: 0, move: [0, 0], steps: 0, lose_count: 1 };

  let randomized_moves = moves // randomizing it just so it doesn't always make the same boring move
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  let result = {
    wins: 0,
    move: [0, 0],
    steps: -1,
    lose_count: 0,
  };
  let opponent_max_lost = -1;
  let on_lost_max_steps = -1;

  randomized_moves.forEach((move) => {
    const [row_id, col_id] = move;
    if (game_state[row_id][col_id] !== "") return;

    if (result.steps === -1) {
      // note down the first valid move
      result.move = [row_id, col_id];
      result.steps = 0;
    }

    // making the move
    let new_game_state = game_state;
    new_game_state[row_id][col_id] = sign;
    opponent_game = get_best_move(
      new_game_state,
      sign === "X" ? "O" : "X",
      is_winning_state
    );
    new_game_state[row_id][col_id] = "";

    if (opponent_game.wins === 0) {
      // if opponent has no way to win, this is the optimal move
      result.wins = 1;
      result.move = [row_id, col_id];
      result.steps = opponent_game.steps + 1;
    } else if (
      // if the count of opponent's losing state is higher than last best
      // or if it's same but takes more steps to end game
      opponent_max_lost < opponent_game.lose_count ||
      (opponent_max_lost === opponent_game.lose_count &&
        on_lost_max_steps < opponent_game.steps + 1)
    ) {
      opponent_max_lost = opponent_game.lose_count;
      on_lost_max_steps = opponent_game.steps + 1;
    }

    if (opponent_game.wins === 1) result.lose_count++;
  });

  if (result.wins === 0) result.steps = on_lost_max_steps;

  return result;
};

module.exports.get_best_move = get_best_move;
