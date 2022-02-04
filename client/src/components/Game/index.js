import { Grid, Box, Typography, Card, CardContent } from "@material-ui/core";
import React, { Fragment, useState, useEffect } from "react";
import { gameStyles } from "./styles";
import axios from "axios";
import { useHistory, useParams } from "react-router";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

let GridCell = (props) => {
  const classes = gameStyles();
  const { rowId, colId, value } = props;
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
      onClick={() => console.log(`clicked row = ${rowId} col = ${colId}`)}
    >
      <Typography variant="h1">{value}</Typography>
    </Grid>
  );
};

let GridRow = (props) => {
  const { row, rowId } = props;
  return (
    <Grid item container justifyContent="center" direction="row">
      {row.map((col, idx) => {
        return <GridCell value={col} rowId={rowId} colId={idx} key={idx} />;
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
  const [invalidGame, setInvalidGame] = useState(true);
  const [gameState, setGameState] = useState(initGameState);
  const [gameObj, setGameObj] = useState({});
  let routeHistory = useHistory();

  useEffect(() => {
    axios
      .get(`/api/game/${game_id}`)
      .then((res) => {
        console.log(res.data);
        setInvalidGame(false);
        const { _id } = res.data;
        socket.emit("join_game", _id);
        socket.on("join_game_error", (data) => {
          console.log(data.error);
          routeHistory.push(`/`);
        });
      })
      .catch((err) => {
        routeHistory.push(`/`);
      });
  }, []);

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
        <Typography variant="h5">{gameObj.title || "No title"}</Typography>
      </Grid>

      <Box height={50} />
      {gameState.map((row, idx) => {
        return <GridRow row={row} rowId={idx} key={idx} />;
      })}

      <Box height={50} />

      <Grid item container direction="row" justifyContent="center">
        <ScoreGrid title="Player 1 score" score={0} />
        <ScoreGrid title="Draws" score={0} />
        <ScoreGrid title="Player 2 score" score={0} />
      </Grid>
    </Grid>
  );
};

export default Game;
