import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { HashRouter as Router } from "react-router-dom";
import ConfigContext from "./context/ConfigContext";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ConfigContext>
        <App />
      </ConfigContext>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
