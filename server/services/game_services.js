const { get_best_move } = require("../ai_player/next_best_move");
const Game = require("../models/Game");
const Player = require("../models/Player");

let is_winning_state = (game_state) => {
  let winning = false;
  ["X", "O"].forEach((sign) => {
    if (
      // main diagonal check
      game_state[0][0] == sign &&
      game_state[1][1] == sign &&
      game_state[2][2] == sign
    ) {
      winning = true;
    } else if (
      // secondary diagonal check
      game_state[0][2] == sign &&
      game_state[1][1] == sign &&
      game_state[2][0] == sign
    )
      winning = true;
    for (let i = 0; i < 3; i++) {
      if (
        // rows check
        game_state[i][0] == sign &&
        game_state[i][1] == sign &&
        game_state[i][2] == sign
      )
        winning = true;
      if (
        // columns check
        game_state[0][i] == sign &&
        game_state[1][i] == sign &&
        game_state[2][i] == sign
      )
        winning = true;
    }
  });
  return winning;
};

let get_new_game_state = () => {
  return [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
};

let update_game_for_another_play = (game) => {
  const total_games = game.player0_wins + game.player1_wins + game.ties;
  game.current_state = get_new_game_state();
  game.turn = 0;
  // after every game
  game.first_player ^= 1;
  [game.player_signs[0], game.player_signs[1]] = [
    game.player_signs[1],
    game.player_signs[0],
  ];
  if ((total_games - 1) & 1) {
    // after every two games
    [game.player_signs[0], game.player_signs[1]] = [
      game.player_signs[1],
      game.player_signs[0],
    ];
  }
  game.playing_with_ai = false;
  return game;
};

let one_v_one_move = async (
  row_id,
  col_id,
  player,
  players,
  active_player,
  game,
  gameObj,
  endGameCallback
) => {
  if (players[0].player_num === 1) {
    [players[0], players[1]] = [players[1], players[0]];
  }
  player_sign = game.player_signs[player.player_num];

  new_game_state = gameObj.current_state;
  new_game_state[row_id][col_id] = player_sign;
  winning = is_winning_state(new_game_state);

  if (winning === true) {
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
  } else if (game.turn == 8) {
    game.ties = game.ties + 1;
    game = update_game_for_another_play(game);
    endGameCallback(players[0].socket_id.toString(), -1);
    endGameCallback(players[1].socket_id.toString(), -1);
  } else {
    game.current_state = new_game_state;
    game.turn = game.turn + 1;
  }

  await game.save();

  return game;
};

let with_ai_move = async (
  row_id,
  col_id,
  player,
  players,
  active_player,
  game,
  gameObj,
  gameReadyCallBack,
  endGameCallback
) => {
  if (!player) return null;
  player_sign = game.player_signs[player.player_num];
  ai_sign = player_sign === "X" ? "O" : "X";

  new_game_state = gameObj.current_state;
  new_game_state[row_id][col_id] = player_sign;
  winning = is_winning_state(new_game_state);

  if (winning === true) {
    if (active_player === 0) {
      game.player0_wins++;
    } else {
      game.player1_wins++;
    }
    game = update_game_for_another_play(game);
    gameReadyCallBack(game._id.toString(), false);
    endGameCallback(player.socket_id.toString(), 1);
  } else if (game.turn == 8) {
    game.ties = game.ties + 1;
    game = update_game_for_another_play(game);
    gameReadyCallBack(game._id.toString(), false);
    endGameCallback(players.socket_id.toString(), -1);
  } else {
    game.current_state = new_game_state;
    game.turn++;

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
  const gameObj = game.toObject();

  let players = await Player.find({ game_id: player.game_id });
  const active_player = game.turn % 2 ^ game.first_player;
  if (
    active_player == player.player_num &&
    game.current_state[row_id][col_id] === "" &&
    players &&
    players.length == 2
  ) {
    return one_v_one_move(
      row_id,
      col_id,
      player,
      players,
      active_player,
      game,
      gameObj,
      endGameCallback
    );
  } else if (game.playing_with_ai && players && players.length == 1) {
    return with_ai_move(
      row_id,
      col_id,
      player,
      players,
      active_player,
      game,
      gameObj,
      gameReadyCallBack,
      endGameCallback
    );
  } else {
    throw new Error("Invalid move!");
  }
};

let make_an_ai_move = (
  socket_id,
  game,
  player_num,
  sign,
  gameReadyCallBack,
  endGameCallback
) => {
  const gameObj = game.toObject();
  const best_move_obj = get_best_move(
    gameObj.current_state,
    sign,
    is_winning_state
  );
  const [row_id, col_id] = best_move_obj.move;

  new_game_state = gameObj.current_state;
  new_game_state[row_id][col_id] = sign;
  game.current_state = new_game_state;
  winning = is_winning_state(new_game_state);

  if (winning) {
    game = update_game_for_another_play(game);
    if (player_num) game.player0_wins++;
    else game.player1_wins++;
    gameReadyCallBack(game._id.toString(), false);
    endGameCallback(socket_id, 0);
  } else if (game.turn == 8) {
    game = update_game_for_another_play(game);
    game.ties++;
    gameReadyCallBack(game._id.toString(), false);
    endGameCallback(socket_id, -1);
  } else {
    game.turn++;
  }

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
module.exports.make_a_move = make_a_move;
module.exports.is_winning_state = is_winning_state;
