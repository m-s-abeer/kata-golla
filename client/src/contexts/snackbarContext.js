import { Snackbar } from "@material-ui/core";
import React, { createContext, useState } from "react";
import MuiAlert from "@material-ui/lab/Alert";

let Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

export let GlobalSnackbarContext = createContext();

export let GlobalSnackbar = (props) => {
  let [snack, setSnack] = useState({
    show: false,
    message: "",
    severity: "success",
  });

  let handleClose = () => {
    setSnack({
      show: false,
      message: "",
      severity: "success",
    });
  };

  let showSnackbar = (message, severity = "info") => {
    setSnack({
      show: true,
      message,
      severity,
    });
  };

  let onSuccessSnackbar = (message) => {
    setSnack({
      show: true,
      severity: "success",
      message,
    });
  };

  let onErrorSnackbar = (message) => {
    setSnack({
      show: true,
      severity: "error",
      message,
    });
  };

  return (
    <GlobalSnackbarContext.Provider
      value={{
        showSnackbar,
        onErrorSnackbar,
        onSuccessSnackbar,
      }}
    >
      <Snackbar open={snack.show} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snack.severity}>
          {snack.message}
        </Alert>
      </Snackbar>
      {props.children}
    </GlobalSnackbarContext.Provider>
  );
};
