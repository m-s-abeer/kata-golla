const express = require("express");
const router = express.Router();
const Game = require("../models/Game");

router.get("/", async (req, res) => {
  try {
    const all_games = await Game.find();
    res.json(all_games);
  } catch (err) {
    res.json(err);
  }
});

router.post("/create", async (req, res) => {
  const data = req.body;
  try {
    const new_game = await new Game({
      title: data.title,
    });
    new_game.save();
    res.status(201).json(new_game);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/:gameId", async (req, res) => {
  const gameId = req.params.gameId;
  try {
    const game = await Game.findById(gameId);
    res.json(game);
  } catch (err) {
    res.status(404).send({
      error: "This game doesn't exist!",
    });
  }
});

module.exports = router;
