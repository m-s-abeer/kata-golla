const Game = require("../models/Game");
const Player = require("../models/Player");
const { get_best_move } = require("./ai_services");
const { get_winner_or_tie } = require("./get_winner_or_tie");
const update_game_for_another_play = require("./new_game_services");

let make_an_ai_move = (
  socket_id,
  game,
  player_num,
  sign,
  gameReadyCallBack,
  endGameCallback
) => {
  const gameObj = game.toObject();
  const best_move_obj = get_best_move(gameObj, sign);
  const [row_id, col_id] = best_move_obj.move;

  new_game_state = gameObj.current_state;
  new_game_state[row_id][col_id] = sign;
  game.turn++;
  game.current_state = new_game_state;
  winner = get_winner_or_tie(game.toObject());

  if (winner === "X" || winner === "O") {
    game = update_game_for_another_play(game);
    if (player_num) game.player0_wins++;
    else game.player1_wins++;
    gameReadyCallBack(game._id.toString(), false);
    endGameCallback(socket_id, 0);
  } else if (winner === "T") {
    game = update_game_for_another_play(game);
    game.ties++;
    gameReadyCallBack(game._id.toString(), false);
    endGameCallback(socket_id, -1);
  }

  return game;
};

let player_v_ai_move = async (
  row_id,
  col_id,
  player,
  active_player,
  game,
  gameReadyCallBack,
  endGameCallback
) => {
  if (!player) return null;
  player_sign = game.player_signs[player.player_num];
  ai_sign = player_sign === "X" ? "O" : "X";

  new_game_state = game.toObject().current_state;
  new_game_state[row_id][col_id] = player_sign;
  game.turn++;
  game.current_state = new_game_state;
  winner = get_winner_or_tie(game.toObject());

  if (winner === "X" || winner === "O") {
    if (active_player === 0) {
      game.player0_wins++;
    } else {
      game.player1_wins++;
    }
    game = update_game_for_another_play(game);
    gameReadyCallBack(game._id.toString(), false);
    endGameCallback(player.socket_id.toString(), 1);
  } else if (winner === "T") {
    game.ties = game.ties + 1;
    game = update_game_for_another_play(game);
    gameReadyCallBack(game._id.toString(), false);
    endGameCallback(player.socket_id.toString(), -1);
  } else {
    // make ai move
    game = make_an_ai_move(
      player.socket_id.toString(),
      game,
      player.player_num,
      ai_sign,
      gameReadyCallBack,
      endGameCallback
    );
  }

  await game.save();

  return game;
};

let add_ai = async (socket, game_id, endGameCallback) => {
  let game = await Game.findById(game_id);

  game.playing_with_ai = true;

  // ai move
  let player = await Player.findOne({ socket_id: socket.id });
  const active_player = game.turn % 2 ^ game.first_player;
  if (active_player !== player.player_num) {
    sign = game.player_signs[active_player];
    game = make_an_ai_move(
      socket.id,
      game,
      player.player_num,
      sign,
      endGameCallback
    );
  }

  game.save();

  return game;
};

let remove_ai = async (game_id) => {
  let game = await Game.findById(game_id);

  game.playing_with_ai = false;
  game.save();

  return game;
};

module.exports.add_ai = add_ai;
module.exports.remove_ai = remove_ai;
module.exports.player_v_ai_move = player_v_ai_move;
