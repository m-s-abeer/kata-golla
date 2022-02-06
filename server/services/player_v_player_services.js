const { get_winner_or_tie } = require("./get_winner_or_tie");
const update_game_for_another_play = require("./new_game_services");

let player_v_player_move = async (
  row_id,
  col_id,
  player,
  players,
  active_player,
  game,
  endGameCallback
) => {
  if (players[0].player_num === 1) {
    [players[0], players[1]] = [players[1], players[0]];
  }
  player_sign = game.player_signs[player.player_num];

  new_game_state = game.toObject().current_state;
  new_game_state[row_id][col_id] = player_sign;
  game.turn++;
  game.current_state = new_game_state;
  winner = get_winner_or_tie(game.toObject());

  if (winner === "X" || winner === "O") {
    if (active_player === 0) {
      game.player0_wins++;
      endGameCallback(players[0].socket_id.toString(), 1);
      endGameCallback(players[1].socket_id.toString(), 0);
    } else {
      game.player1_wins++;
      endGameCallback(players[0].socket_id.toString(), 0);
      endGameCallback(players[1].socket_id.toString(), 1);
    }
    game = update_game_for_another_play(game);
  } else if (winner === "T") {
    endGameCallback(players[0].socket_id.toString(), -1);
    endGameCallback(players[1].socket_id.toString(), -1);
    game.ties = game.ties + 1;
    game = update_game_for_another_play(game);
  }

  await game.save();

  return game;
};

module.exports.player_v_player_move = player_v_player_move;
