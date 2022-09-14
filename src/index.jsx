import createTheme from "@mui/material/styles/createTheme";
import ConfigContext from "context/ConfigContext";
import ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import App from "./App";

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

//ReactDOM.render(
//  <Router>
//    <ConfigContext>
//      <SiteContext>
//        <ThemeProvider theme={theme}>
//          <App />
//        </ThemeProvider>
//      </SiteContext>
//    </ConfigContext>
//  </Router>,
//  document.getElementById("root")
//);
ReactDOM.render(
  <Router>
    <ConfigContext>
      <App />
    </ConfigContext>
  </Router>,
  document.getElementById("root")
);
