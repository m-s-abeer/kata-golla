const Game = require("../models/Game");
const { get_winner_or_tie } = require("./get_winner_or_tie");
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

let is_ai_playing = async (game_id) => {
  let game = await Game.findById(game_id);

  return game.playing_with_ai === true;
};

let get_best_move = (gameObj, sign) => {
  // base cases
  const winner_or_tie = get_winner_or_tie(gameObj);
  if (winner_or_tie === "T") return { score: 0, move: [-1, -1] };
  else if (winner_or_tie !== null) return { score: -1, move: [-1, -1] };

  let randomized_moves = moves // randomizing it just so it doesn't always make the same boring move
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  let result = {
    score: -101,
    move: [-1, -1],
  };

  randomized_moves.forEach((move) => {
    const [row_id, col_id] = move;
    if (gameObj.current_state[row_id][col_id] !== "") return;

    if (result.score === -101) {
      // just noting down a valid move
      result.score = -1;
      result.move = [row_id, col_id];
    }

    // making the move
    gameObj.turn++;
    gameObj.current_state[row_id][col_id] = sign;
    opponent_game = get_best_move(gameObj, sign === "X" ? "O" : "X");
    gameObj.current_state[row_id][col_id] = "";
    gameObj.turn--;

    const opponent_score = ~opponent_game.score + 1; // changes sign

    if (opponent_score >= result.score) {
      result.score = opponent_score;
      result.move = [row_id, col_id];
    }
  });

  return result;
};

module.exports.get_best_move = get_best_move;
module.exports.is_ai_playing = is_ai_playing;
