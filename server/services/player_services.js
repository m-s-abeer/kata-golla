const Player = require("../models/Player");

const get_player_init_info = async (game_sockets, socket_id, game_id) => {
  const playerData = {
    socket_id: socket_id,
    game_id: game_id,
    player_num: 0,
  };

  if (game_sockets) {
    const [other_socket] = game_sockets;
    const otherPlayer = await Player.findOne({ socket_id: other_socket });

    if (otherPlayer.player_num === playerData.player_num) {
      playerData.player_num = 1 - playerData.player_num;
    }
  } else {
    console.log("Creating first player");
  }

  const newPlayer = new Player(playerData);
  newPlayer.save();
  return newPlayer;
};

const remove_player = async (socket_id) => {
  await Player.deleteOne({ socket_id: socket_id }).exec();
};

module.exports.remove_player = remove_player;
module.exports.get_player_init_info = get_player_init_info;
