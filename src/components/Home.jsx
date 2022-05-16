import { Fragment, useContext, useState } from "react";
import { Button } from "@mui/material";
import { configContext } from "../context/ConfigContext";
import { Link } from "react-router-dom";
import NewSiteDialog from "./settings/site/NewSiteDialog";
import { newSiteConfig } from "../lib/useSiteConfig";

function Home() {
  const { config, updateSiteConfig } = useContext(configContext);

  //TODO
  const addNewSite = (name, path) => {
    //siteKey == "new"
    const siteConfig = newSiteConfig();
    siteConfig.name = name;
    siteConfig.path = path;
    updateSiteConfig(siteConfig);
  };

  const [isNewSiteDialogOpen, setIsNewSiteDialogOpen] = useState(false);
  const closeNewSiteDialog = () => {
    setIsNewSiteDialogOpen(false);
  };

  return (
    <Fragment>
      <NewSiteDialog
        open={isNewSiteDialogOpen}
        onClose={closeNewSiteDialog}
        addNewSite={addNewSite}
      />
      <h1>Home</h1>
      {config.sites?.map((siteConfig) => (
        <div className="flex">
          <Link
            to={
              "/edit/" +
              siteConfig.key +
              "?path=" +
              siteConfig.path +
              "&name=Root&isDir=true"
            }
          >
            <h2>{siteConfig.name}</h2>
          </Link>
        </div>
      ))}
      <Button onClick={() => setIsNewSiteDialogOpen(true)} variant="contained">
        New
      </Button>
    </Fragment>
  );
}

export default Home;
