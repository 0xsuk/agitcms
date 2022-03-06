import { Fragment, useContext, useState } from "react";
import { Button } from "@mui/material";
import Site from "./Site";
import { configContext } from "../context/ConfigContext";
import { newSiteConfig } from "../lib/config";

function Home() {
  const { config } = useContext(configContext);
  const [isNewSite, setIsNewSite] = useState(false);

  return (
    <Fragment>
      <h1>Home</h1>
      {config.sites?.map((siteConfig) => (
        <Site _siteConfig={siteConfig} />
      ))}
      {isNewSite && (
        <Site
          _siteConfig={newSiteConfig()}
          isNewSite={true}
          setIsNewSite={setIsNewSite}
        />
      )}
      <Button onClick={() => setIsNewSite(true)} variant="contained">
        New
      </Button>
    </Fragment>
  );
}

export default Home;
