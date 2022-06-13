import {
  Grid,
  Typography,
  Switch,
  Divider,
  TextField,
  Button,
} from "@mui/material";
import { configContext } from "../../context/ConfigContext";
import { useContext, useState } from "react";
import CustomSelect from "../CustomSelect";
import { ArrowDropDown } from "@mui/icons-material";
import TextDialog from "../TextDialog";

const autosaveOptions = ["always", "never"];
const themeOptions = ["dark", "light"];

function Settings() {
  const { config, updateConfig } = useContext(configContext);
  const [isFontsizeDialogOpen, setIsFontsizeDialogOpen] = useState(false);

  const toggleUseTerminal = (newValue) => {
    updateConfig({ ...config, useTerminal: newValue });
  };

  const updateAutosave = (newValue) => {
    updateConfig({ ...config, autosave: newValue });
  };

  const updateTheme = (newValue) => {
    updateConfig({ ...config, theme: newValue });
  };

  const updateFontsize = (newValue) => {
    newValue = Number(newValue);
    if (newValue === 0) {
      return;
    }
    updateConfig({ ...config, fontSize: newValue });
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
            <Typography>Font Size:</Typography>
          </Grid>
          <Grid item>
            <TextField
              value={config.fontSize}
              InputProps={{
                readOnly: true,
                endAdornment: <p style={{ paddingLeft: "10px" }}> em</p>,
              }}
              label="required"
              variant="filled"
              onClick={() => {
                setIsFontsizeDialogOpen(true);
              }}
            />
            <TextDialog
              type="number"
              isOpen={isFontsizeDialogOpen}
              isValid={(value) => Number(value) !== 0}
              onSave={updateFontsize}
              onClose={() => setIsFontsizeDialogOpen(false)}
              dialogTitle={"Font size"}
              tailValue={"em"}
              initialValue={config.fontSize}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Settings;
