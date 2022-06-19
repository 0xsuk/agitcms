import { ArrowDropDown } from "@mui/icons-material";
import {
  Button,
  Divider,
  Grid,
  Slider,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { configContext } from "../context/ConfigContext";
import CustomSelect from "./CustomSelect";

const autosaveOptions = ["always", "never"];
const themeOptions = ["dark", "light"];

function Settings() {
  const { config, updateConfig } = useContext(configContext);

  const toggleUseTerminal = (newValue) => {
    updateConfig({ ...config, useTerminal: newValue });
  };

  const updateAutosave = (newValue) => {
    updateConfig({ ...config, autosave: newValue });
  };

  const updateTheme = (newValue) => {
    updateConfig({ ...config, theme: newValue });
  };

  const updateZoom = (newValue) => {
    newValue = Number(newValue);
    newValue = newValue / 100;
    updateConfig({ ...config, zoom: newValue });
  };

  return (
    <div id="settings">
      <Typography variant="h5">Global Settings</Typography>
      <Divider sx={{ marginBottom: "20px" }} />
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
        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <Typography>Auto Save:</Typography>
          </Grid>
          <Grid item>
            <CustomSelect
              onChange={(newValue) => {
                updateAutosave(newValue);
              }}
              items={autosaveOptions}
            >
              {({ ref, setIsOpen }) => (
                <TextField
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <Button onClick={() => setIsOpen(true)} ref={ref}>
                        <ArrowDropDown />
                      </Button>
                    ),
                  }}
                  sx={{ color: "#999" }}
                  value={config.autosave}
                  variant="filled"
                  label="required"
                  size="small"
                ></TextField>
              )}
            </CustomSelect>
          </Grid>
        </Grid>
        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <Typography>Theme:</Typography>
          </Grid>
          <Grid item>
            <CustomSelect
              onChange={(newValue) => {
                updateTheme(newValue);
              }}
              items={themeOptions}
            >
              {({ ref, setIsOpen }) => (
                <TextField
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <Button onClick={() => setIsOpen(true)} ref={ref}>
                        <ArrowDropDown />
                      </Button>
                    ),
                  }}
                  sx={{ color: "#999" }}
                  value={config.theme}
                  variant="filled"
                  label="required"
                  size="small"
                ></TextField>
              )}
            </CustomSelect>
          </Grid>
        </Grid>
        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <Typography>Zoom:</Typography>
          </Grid>
          <Grid item sx={{ width: "200px", paddingTop: "100px" }}>
            <Slider
              min={60}
              max={140}
              valueLabelDisplay="auto"
              marks={[{ value: 100 }]}
              onChangeCommitted={(_, v) => {
                updateZoom(v);
              }}
              components={{
                ValueLabel: ValueLabelComponent,
              }}
              defaultValue={config.zoom * 100}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

function ValueLabelComponent({ value, children }) {
  return (
    <Tooltip title={value + "%"} placement={"bottom"}>
      {children}
    </Tooltip>
  );
}

export default Settings;
