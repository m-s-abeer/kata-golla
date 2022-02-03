import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import Game from "./components/Game";
import Home from "./components/Home";
import "./App.css";

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
      <Router>
        <Switch>
          <Route path="/play/:id">
            <Game />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </MuiThemeProvider>
  );
}
