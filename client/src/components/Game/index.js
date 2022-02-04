import { Grid, Box, Typography, Card, CardContent } from "@material-ui/core";
import React, { Fragment, useState, useEffect } from "react";
import { gameStyles } from "./styles";
import axios from "axios";
import { useHistory, useParams } from "react-router";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

let GridCell = (props) => {
  const classes = gameStyles();
  const { row_id, col_id, game_id, player_active, value } = props;

  const handleCellClick = () => {
    socket.emit("make_move", row_id, col_id);
  };

  return (
    <Grid
      item
      container
      alignItems="center"
      justifyContent="center"
      className={
        player_active
          ? value === ""
            ? `${classes.singleCell} ${classes.activeHover}`
            : `${classes.singleCell}`
          : `${classes.singleCell} ${classes.disabledCell}`
      }
      component="div"
      onClick={player_active ? handleCellClick : null}
    >
      <Typography variant="h1">{value}</Typography>
    </Grid>
  );
};

let GridRow = (props) => {
  const { row, row_id, game_id, player_active } = props;
  return (
    <Grid item container justifyContent="center" direction="row">
      {row.map((col, idx) => {
        return (
          <GridCell
            value={col}
            row_id={row_id}
            col_id={idx}
            game_id={game_id}
            player_active={player_active}
            key={idx}
          />
        );
      })}
    </Grid>
  );
};

let ScoreGrid = (props) => {
  const { title, score } = props;
  return (
    <Grid item container direction="column" xs={3} alignItems="center">
      <Typography variant="h4">{title}</Typography>
      <Typography variant="h4">{score}</Typography>
    </Grid>
  );
};

let Game = (props) => {
  const { game_id } = useParams();
  const initGameState = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const playerInitState = {
    game_id: "",
    socket_id: "",
    player_num: "",
  };

  const [invalidGame, setInvalidGame] = useState(true);
  const [gameState, setGameState] = useState(initGameState);
  const [playerActive, setPlayerActive] = useState(false);
  const [gameObj, setGameObj] = useState({
    title: "",
    player0_wins: 0,
    player1_wins: 0,
    player_signs: ["X", "O"],
    ties: 0,
    turn: 0,
    first_player: 0,
    current_state: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
  });
  const [playerInfo, setPlayerInfo] = useState(playerInitState);
  let routeHistory = useHistory();

  const updateActivePlayer = () => {
    const active_player = gameObj.turn % 2 ^ gameObj.first_player;
    if (active_player === playerInfo.player_num) setPlayerActive(true);
    else setPlayerActive(false);
  };
  useEffect(() => {
    socket.on("game_updated", (game) => {
      setGameObj(game);
    });
  }, [socket]);

  useEffect(() => {
    updateActivePlayer();
  }, [playerInfo]);

  useEffect(() => {
    axios
      .get(`/api/game/${game_id}`)
      .then((res) => {
        setInvalidGame(false);
        setGameObj(res.data);
        socket.emit("join_game", res.data._id);
        socket.on("join_game_success", (res) => {
          setPlayerInfo(res.data);
        });
        socket.on("join_game_error", (err) => {
          console.log("error", err.error);
          routeHistory.push(`/`);
        });
      })
      .catch(() => {
        routeHistory.push(`/`);
      });
  }, []);

  useEffect(() => {
    setGameState(gameObj.current_state);
    updateActivePlayer();
  }, [gameObj.current_state]);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      alignContent="center"
      style={{ minHeight: "100%" }}
    >
      <Grid container alignItems="center" direction="column">
        <Typography variant="h1">KATA GOLLA</Typography>
        <Typography variant="h5" color={playerActive ? "primary" : "f0f0f0"}>
          {playerActive
            ? `Your turn! (${gameObj.player_signs[playerInfo.player_num]})`
            : playerInfo.player_num
            ? `Your friend's turn!  (${gameObj.player_signs[0]})`
            : `Your friend's turn!  (${gameObj.player_signs[1]})`}
        </Typography>
      </Grid>

      <Box height={50} />
      {gameState.map((row, idx) => {
        return (
          <GridRow
            row={row}
            row_id={idx}
            key={idx}
            game_id={game_id}
            player_active={playerActive}
          />
        );
      })}

      <Box height={50} />

      <Grid item container direction="row" justifyContent="center">
        <ScoreGrid
          title="Your score"
          score={
            playerInfo.player_num ? gameObj.player1_wins : gameObj.player0_wins
          }
        />
        <ScoreGrid title="Ties" score={gameObj.ties} />
        <ScoreGrid
          title="Friend's score"
          score={
            playerInfo.player_num ? gameObj.player0_wins : gameObj.player1_wins
          }
        />
      </Grid>
    </Grid>
  );
};

export default Game;
