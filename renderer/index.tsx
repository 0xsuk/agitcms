import ConfigContext from "@/context/ConfigContext";
import SiteContext from "@/context/SiteContext";
import { ThemeProvider } from "@emotion/react";
import createTheme from "@mui/material/styles/createTheme";
import * as ReactDOM from "react-dom";
import { HashRouter as Router } from "react-router-dom";
import App from "./App";
import { socketClient } from "./utils/socketClient";
import { warnError } from "./utils/warnError";
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

(async function () {
  const { config, err } = await socketClient.readConfig();
  if (err !== null) {
    warnError(err);
    return;
  }
  if (config.version === undefined || config.version !== "2.0") {
    alert("Configuration file is out of date and might cause some bugs");
  }

  ReactDOM.render(
    <Router>
      <ConfigContext initialConfig={config}>
        <SiteContext>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </SiteContext>
      </ConfigContext>
    </Router>,
    document.getElementById("root")
  );
})();
