const Game = require("../models/Game");
const Player = require("../models/Player");
const { player_v_player_move } = require("./player_v_player_services");
const { player_v_ai_move } = require("./player_v_ai_services");

let make_a_move = async (
  socket,
  row_id,
  col_id,
  gameReadyCallBack,
  endGameCallback
) => {
  const player = await Player.findOne({ socket_id: socket.id });
  if (!player) {
    return null;
  }
  let game = await Game.findById(player.game_id);

  let players = await Player.find({ game_id: player.game_id });
  const active_player = game.turn % 2 ^ game.first_player;
  if (
    active_player == player.player_num &&
    game.current_state[row_id][col_id] === "" &&
    players &&
    players.length == 2
  ) {
    return player_v_player_move(
      row_id,
      col_id,
      player,
      players,
      active_player,
      game,
      endGameCallback
    );
  } else if (game.playing_with_ai && players && players.length == 1) {
    return player_v_ai_move(
      row_id,
      col_id,
      player,
      active_player,
      game,
      gameReadyCallBack,
      endGameCallback
    );
  } else {
    throw new Error("Invalid move!");
  }
};
module.exports.make_a_move = make_a_move;
