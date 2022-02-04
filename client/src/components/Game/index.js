import { Grid, Box, Typography, Card, CardContent } from "@material-ui/core";
import React, { Fragment, useState, useEffect } from "react";
import { gameStyles } from "./styles";
import axios from "axios";
import { useHistory, useParams } from "react-router";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

let GridCell = (props) => {
  const classes = gameStyles();
  const { row_id, col_id, game_id, value } = props;

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
        value === ""
          ? `${classes.singleCell} ${classes.hover}`
          : `${classes.singleCell}`
      }
      component="div"
      onClick={handleCellClick}
    >
      <Typography variant="h1">{value}</Typography>
    </Grid>
  );
};

let GridRow = (props) => {
  const { row, row_id, game_id } = props;
  return (
    <Grid item container justifyContent="center" direction="row">
      {row.map((col, idx) => {
        return (
          <GridCell
            value={col}
            row_id={row_id}
            col_id={idx}
            game_id={game_id}
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
  const [gameObj, setGameObj] = useState({
    title: "",
    player0_wins: 0,
    player1_wins: 0,
    ties: 0,
    turn: 0,
    current_state: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
  });
  const [playerInfo, setPlayerInfo] = useState(playerInitState);
  let routeHistory = useHistory();

  useEffect(() => {
    socket.on("game_updated", (game) => {
      setGameObj(game);
    });
  }, [socket]);

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
        {/* <Typography variant="h5">{gameObj.title || "No title"}</Typography> */}
      </Grid>

      <Box height={50} />
      {gameState.map((row, idx) => {
        return <GridRow row={row} row_id={idx} key={idx} game_id={game_id} />;
      })}

      <Box height={50} />

      <Grid item container direction="row" justifyContent="center">
        <ScoreGrid title="Player 1 score" score={gameObj.player0_wins} />
        <ScoreGrid title="Ties" score={gameObj.ties} />
        <ScoreGrid title="Player 2 score" score={gameObj.player1_wins} />
      </Grid>
    </Grid>
  );
};

export default Game;
