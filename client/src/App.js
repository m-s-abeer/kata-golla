import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import Game from "./components/Game";
import Home from "./components/Home";
import "./App.css";
import { GlobalSnackbar } from "./contexts/snackbarContext";

const themeLight = createTheme({
  palette: {
    background: {
      default: "#ffffff",
    },
    primary: {
      main: "#2989ff",
    },
  },
});

export default function App() {
  return (
    <MuiThemeProvider theme={themeLight}>
      <CssBaseline />
      <GlobalSnackbar>
        <Router>
          <Switch>
            <Route path="/play/:gameId">
              <Game />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
          </Switch>
        </Router>
      </GlobalSnackbar>
    </MuiThemeProvider>
  );
}
