import createTheme from "@mui/material/styles/createTheme";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import App from "./App";
import ConfigContext from "./context/ConfigContext";
import SiteContext from "./context/SiteContext";

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
  <Router>
    <ConfigContext>
      <SiteContext>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </SiteContext>
    </ConfigContext>
  </Router>,
  document.getElementById("root")
);
