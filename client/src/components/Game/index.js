import { Grid, Box, Typography, Card, CardContent } from "@material-ui/core";
import React, { Fragment, useState } from "react";
import { gameStyles } from "./styles";
import clsx from "clsx";

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
      <Grid>
        <Typography variant="h4">{title}</Typography>
      </Grid>
      <Grid>
        <Typography variant="h4">{score}</Typography>
      </Grid>
    </Grid>
  );
};

let Game = () => {
  const initGameState = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  const [gameState, setGameState] = useState(initGameState);

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
      <Grid>
        <Typography variant="h1">KATA GOLLA</Typography>
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
