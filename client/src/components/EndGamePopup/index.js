import React from "react";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { Button, Grid } from "@material-ui/core";
import winner_png from "../../assets/winner.png";
import loser_png from "../../assets/loser.png";
import tie_png from "../../assets/tie.png";
import { useHistory } from "react-router-dom";
import { popUpStyles } from "./styles";

export default function EndGameModal(props) {
  const { open, setOpen, winner, disconnectCallback } = props;
  const classes = popUpStyles();
  const history = useHistory();

  const handleClose = () => {
    setOpen(false);
  };

  const handleGoHome = () => {
    disconnectCallback();
    history.replace("/");
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Grid
            container
            justifyContent="center"
            direction="column"
            alignItems="center"
            className={classes.paper}
          >
            {winner === 1 ? (
              <img src={winner_png} alt="TallyKhata" height="30%" width="30%" />
            ) : winner === 0 ? (
              <img src={loser_png} alt="TallyKhata" height="30%" width="30%" />
            ) : (
              <img src={tie_png} alt="TallyKhata" height="20%" width="20%" />
            )}

            <h1 id="transition-modal-title">
              {winner === 1
                ? "That was a nice game! Play another one?"
                : winner === 0
                ? "You can definitely do better next time. Try again?"
                : "Awesome! Nothing to lose! Let's play another!!!"}
            </h1>
            <Grid style={{ height: "20px" }} />
            <Grid item container justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleClose}
              >
                Yes!
              </Button>
              <Grid style={{ width: "10px" }} />
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={handleGoHome}
              >
                Go home!
              </Button>
            </Grid>
          </Grid>
        </Fade>
      </Modal>
    </div>
  );
}
