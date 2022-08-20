import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { HashRouter as Router } from "react-router-dom";
import ConfigContext from "./context/ConfigContext";
import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import StateContext from "./context/StateContext";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3391ff",
    },
    background: {
      paper: "#0d1117",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ConfigContext>
        <StateContext>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </StateContext>
      </ConfigContext>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
