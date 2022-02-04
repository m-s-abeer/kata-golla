import React, { useState } from "react";
import { Button, Grid, TextField } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import axios from "axios";

let Home = () => {
  const [gameTitle, setGameTitle] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  let routeHistory = useHistory();

  const handleStartGameClick = () => {
    setButtonDisabled(true);
    axios
      .post("api/game/create", {
        title: gameTitle,
      })
      .then((res) => {
        const gameId = res.data._id;
        routeHistory.push(`/play/${gameId}`);
      });
    setButtonDisabled(false);
  };

  return (
    <Grid
      container
      spacing={3}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100%" }}
    >
      <Grid item xs={12}>
        <TextField
          id="game-id"
          label="Game title"
          variant="outlined"
          value={gameTitle}
          onChange={(e) => setGameTitle(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          disabled={buttonDisabled}
          variant="contained"
          color="primary"
          onClick={handleStartGameClick}
          endIcon={<ArrowForwardIosIcon />}
        >
          Start new game
        </Button>
      </Grid>
    </Grid>
  );
};

export default Home;
