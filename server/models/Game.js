const mongoose = require("mongoose");

const GameSchema = mongoose.Schema({
  title: String,
  player0_id: {
    type: String,
    default: "",
  },
  player1_id: {
    type: String,
    default: "",
  },
  player_symobls: {
    type: [String],
    default: ["X", "O"],
  },
  player0_wins: {
    type: Number,
    default: 0,
  },
  player1_wins: {
    type: Number,
    default: 0,
  },
  ties: {
    type: Number,
    default: 0,
  },
  turn: {
    type: Number,
    default: 0,
  },
  current_state: {
    type: [[String]],
    default: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
  },
});

module.exports = mongoose.model("Game", GameSchema);