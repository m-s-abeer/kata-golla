const mongoose = require("mongoose");

const PlayerSchema = mongoose.Schema({
  socket_id: String,
  game_id: String,
  player_num: Number,
});

module.exports = mongoose.model("Player", PlayerSchema);
