import { Grid, Typography, Switch } from "@mui/material";
import { configContext } from "../../context/ConfigContext";
import { useContext } from "react";

function Settings() {
  const { config, updateConfig } = useContext(configContext);

  const toggleUseTerminal = (newValue) => {
    if (
      window.navigator.platform === "Win32" &&
      !window.confirm(
        "You have to install some dependencies in order to use integrated terminal. Are you sure?"
      )
    )
      return;
    updateConfig({ ...config, useTerminal: newValue });
  };
  return (
    <div id="settings">
      <Grid container spacing={2}>
        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <Typography>Use Integrated Terminal:</Typography>
          </Grid>
          <Grid item>
            <Switch
              size="small"
              checked={config.useTerminal}
              onChange={(e) => {
                toggleUseTerminal(e.target.checked);
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Settings;
