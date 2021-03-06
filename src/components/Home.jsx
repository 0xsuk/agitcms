import { Button, Grid, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { configContext } from "../context/ConfigContext";
import { newSiteConfig } from "../lib/useSiteConfig";
import NewSiteDialog from "./NewSiteDialog";

function Home() {
  const { config, updateSiteConfig } = useContext(configContext);
  const history = useHistory();
  const addNewSite = (name, path) => {
    //siteKey == "new"
    const siteConfig = newSiteConfig();
    siteConfig.name = name;
    siteConfig.path = path;
    siteConfig.pinnedDirs = [{ name: "Root", path, isDir: true }];
    updateSiteConfig(siteConfig);
  };

  const [isNewSiteDialogOpen, setIsNewSiteDialogOpen] = useState(false);
  const closeNewSiteDialog = () => {
    setIsNewSiteDialogOpen(false);
  };

  return (
    <div id="home">
      <NewSiteDialog
        open={isNewSiteDialogOpen}
        onClose={closeNewSiteDialog}
        addNewSite={addNewSite}
      />
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <Typography variant="h5">Home</Typography>
        </Grid>
        <Grid item>
          <Button onClick={() => setIsNewSiteDialogOpen(true)}>New</Button>
        </Grid>
      </Grid>
      <Grid container spacing={0} direction="column" justifyContent="center">
        {config.sites?.map((siteConfig) => (
          <Grid item>
            <div
              className="siteName"
              onClick={() =>
                history.push(
                  "/site/explorer/" +
                    siteConfig.key +
                    "?path=" +
                    siteConfig.path +
                    "&name=Root&isDir=true"
                )
              }
            >
              <Typography variant="h6">{siteConfig.name}</Typography>
              <Typography variant="caption" sx={{ color: "#999" }}>
                {siteConfig.path}
              </Typography>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export default Home;
