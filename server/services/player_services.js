const Player = require("../models/Player");

const get_player_init_info = async (game_sockets, socket_id, game_id) => {
  const playerData = {
    socket_id: socket_id,
    game_id: game_id,
    player_num: 0,
  };

  if (game_sockets) {
    // if another player is active, get different player number
    const [other_socket] = game_sockets;
    const otherPlayer = await Player.findOne({ socket_id: other_socket });

    if (otherPlayer.player_num === playerData.player_num) {
      playerData.player_num = 1 - playerData.player_num;
    }
  }

  const newPlayer = new Player(playerData);
  newPlayer.save();
  return newPlayer;
};

const remove_player = async (io, socket_id) => {
  const playerData = await Player.findOne({ socket_id: socket_id });
  if (playerData) {
    await io.to(playerData.game_id.toString()).emit("game_ready", false);
    await Player.deleteOne({ socket_id: socket_id }).exec();
  }
};

module.exports.remove_player = remove_player;
module.exports.get_player_init_info = get_player_init_info;
