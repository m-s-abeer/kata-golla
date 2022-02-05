import React, { useState } from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import axios from "axios";

let Home = () => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  let routeHistory = useHistory();

  const handleStartGameClick = () => {
    setButtonDisabled(true);
    axios.post("api/game/create").then((res) => {
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
        <Button
          disabled={buttonDisabled}
          variant="contained"
          color="primary"
          onClick={handleStartGameClick}
          endIcon={<ArrowForwardIosIcon />}
        >
          <Typography>Let's play!</Typography>
        </Button>
      </Grid>
    </Grid>
  );
};

export default Home;
