import React, { useState } from "react";
import { Button, Grid, TextField } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";

let Home = () => {
  const [gameId, setGameId] = useState("");
  const [username, setUsername] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  let routeHistory = useHistory();

  const handleStartGameClick = () => {
    console.log("Clicked!");
    setButtonDisabled(true);
    // create new game
    routeHistory.push("/play/game");
    setButtonDisabled(false);
  };

  return (
    <Grid
      container
      spacing={3}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: "100%" }}
    >
      <Grid item xs={12}>
        <TextField
          id="game-id"
          label="Game ID"
          variant="outlined"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="outlined-search"
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          disabled={buttonDisabled}
          variant="contained"
          color="primary"
          onClick={handleStartGameClick}
        >
          Start new game
        </Button>
      </Grid>
    </Grid>
  );
};

export default Home;
