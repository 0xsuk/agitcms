import {configContext} from "@/context/ConfigContext";
import {
  Divider,
  Grid, Switch, Typography
} from "@mui/material";
import {useContext} from "react";

export const helpLinks = {};

function Settings() {
  const { config, updateConfig } = useContext(configContext);

  const toggleUseTerminal = (newValue: boolean) => {
    updateConfig({ ...config, useTerminal: newValue });
  };

  return (
    <div id="settings">
      <Typography variant="h5">Global Settings</Typography>
      <Divider sx={{ marginBottom: "20px" }} />
      <Grid container spacing={2}>
        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <Typography>Open Integrated Terminal with Ctrl+@:</Typography>
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
