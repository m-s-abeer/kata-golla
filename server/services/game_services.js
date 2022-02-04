const Game = require("../models/Game");
const Player = require("../models/Player");

let make_a_move = async (socket, row_id, col_id) => {
  console.log("socket", socket.id);
  const player = await Player.findOne({ socket_id: socket.id });
  console.log(player);
  const game = await Game.findById(player.game_id);
  const gameObj = game.toObject();

  const players = await Player.find({ game_id: player.game_id });

  if (
    game.turn % 2 == player.player_num &&
    game.current_state[row_id][col_id] === "" &&
    players &&
    players.length == 2
  ) {
    player_sign = game.player_signs[player.player_num];

    new_game_state = gameObj.current_state;
    new_game_state[row_id][col_id] = player_sign;

    game.current_state = new_game_state;
    game.turn = game.turn + 1;
    await game.save();

    return game;
  } else {
    console.log("Move failed");
    Error("Not possible");
  }
};

module.exports.make_a_move = make_a_move;
