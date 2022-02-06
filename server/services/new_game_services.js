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

module.exports = update_game_for_another_play;
