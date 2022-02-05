import { Grid, Box, Typography } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { gameStyles } from "./styles";
import axios from "axios";
import { useHistory, useParams } from "react-router";
import io from "socket.io-client";
import EndGameModal from "../EndGamePopup";

let GameCell = (props) => {
  const classes = gameStyles();
  const { row_id, col_id, cellClickCallback, player_active, value } = props;

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
      onClick={player_active ? () => cellClickCallback(row_id, col_id) : null}
    >
      <Typography variant="h1">{value}</Typography>
    </Grid>
  );
};

let GameRow = (props) => {
  const { row, row_id, player_active, cellClickCallback } = props;
  return (
    <Grid item container justifyContent="center" direction="row">
      {row.map((col, idx) => {
        return (
          <GameCell
            value={col}
            row_id={row_id}
            col_id={idx}
            player_active={player_active}
            cellClickCallback={cellClickCallback}
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
  const [socket, setSocket] = useState(null);
  const initGameState = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];

  const initPlayerObj = {
    game_id: "",
    socket_id: "",
    player_num: "",
  };

  const initGameObj = {
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
  };

  let routeHistory = useHistory();
  const { game_id } = useParams();
  const [gameReady, setGameReady] = useState(false);
  const [gameObj, setGameObj] = useState(initGameObj);
  const [playerActive, setPlayerActive] = useState(false);
  const [gameState, setGameState] = useState(initGameState);
  const [playerInfo, setPlayerInfo] = useState(initPlayerObj);
  const [win, setWin] = useState(false);
  const [lose, setLose] = useState(false);
  const [tie, setTie] = useState(false);

  const updateActivePlayer = () => {
    const active_player = gameObj.turn % 2 ^ gameObj.first_player;
    if (active_player === playerInfo.player_num) setPlayerActive(true);
    else setPlayerActive(false);
  };

  const handleDisconnect = () => {
    socket.disconnect();
  };

  const handleCellClick = (row_id, col_id) => {
    socket.emit("make_move", row_id, col_id);
  };

  useEffect(() => {
    setSocket(io.connect("http://localhost:3001"));
  }, []);

  useEffect(() => {
    if (socket) {
      axios
        .get(`/api/game/${game_id}`)
        .then((res) => {
          setGameObj(res.data);
          socket.emit("join_game", res.data._id);
        })
        .catch(() => {
          handleDisconnect();
          routeHistory.replace(`/`);
        });
    }
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("game_updated", (game) => {
        setGameObj(game);
      });
      socket.on("game_ready", (ready) => {
        console.log("game_ready", ready);
        setGameReady(ready);
      });
      socket.on("join_game_success", (res) => {
        setPlayerInfo(res.data);
      });
      socket.on("join_game_error", (err) => {
        console.log("error", err.error);
        routeHistory.push(`/`);
      });
      socket.on("end_game", (win) => {
        if (win === 1) setWin(true);
        else if (win < 0) setTie(true);
        else setLose(true);
      });
    }
  }, [socket]);

  useEffect(() => {
    updateActivePlayer();
  }, [playerInfo]);

  useEffect(() => {
    setGameState(gameObj.current_state);
    updateActivePlayer();
  }, [gameObj]);

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
      {win ? (
        <EndGameModal
          open={win}
          setOpen={setWin}
          winner={1}
          disconnectCallback={handleDisconnect}
        />
      ) : null}
      {lose ? (
        <EndGameModal
          open={lose}
          setOpen={setLose}
          winner={0}
          disconnectCallback={handleDisconnect}
        />
      ) : null}
      {tie ? (
        <EndGameModal
          open={tie}
          setOpen={setTie}
          winner={-1}
          disconnectCallback={handleDisconnect}
        />
      ) : null}

      <Grid container alignItems="center" direction="column">
        <Typography variant="h1">KATA GOLLA</Typography>
        {gameReady ? (
          <Typography
            variant="h5"
            color={playerActive ? "primary" : "textPrimary"}
          >
            {playerActive
              ? `Your turn! (${gameObj.player_signs[playerInfo.player_num]})`
              : playerInfo.player_num
              ? `Your friend's turn!  (${gameObj.player_signs[0]})`
              : `Your friend's turn!  (${gameObj.player_signs[1]})`}
          </Typography>
        ) : (
          <Typography variant="h5" color="secondary">
            Waiting for your friend...
          </Typography>
        )}
      </Grid>

      <Box height={50} />
      {gameState.map((row, idx) => {
        return (
          <GameRow
            row={row}
            row_id={idx}
            key={idx}
            cellClickCallback={handleCellClick}
            player_active={playerActive && gameReady}
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
