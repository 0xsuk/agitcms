import { Fragment, useContext, useState } from "react";
import { Button } from "@mui/material";
import Site from "./Site";
import { ConfigContext } from "../App";

const newSiteConfig = () => {
  return {
    key: Date.now(),
    path: "",
  };
};

function Home() {
  const { config, updateConfig } = useContext(ConfigContext);
  const [isNewSite, setIsNetSite] = useState(false);

  const updateSiteConfig = (siteConfig) => {
    const isSiteExist = !config.sites.every((site, i) => {
      if (site.key == siteConfig.key) {
        config.sites[i] = siteConfig;
        return false;
      }
      return true;
    });

    if (!isSiteExist) {
      if (config.sites == undefined) config.sites = [];
      config.sites.push(siteConfig);
      setIsNetSite(false);
    }

    updateConfig(config);
  };

  return (
    <Fragment>
      <h1>Home</h1>
      {config.sites?.map((siteConfig) => (
        <Site _siteConfig={siteConfig} updateSiteConfig={updateSiteConfig} />
      ))}
      {isNewSite && (
        <Site
          _siteConfig={newSiteConfig()}
          updateSiteConfig={updateSiteConfig}
          isNewSite={true}
        />
      )}
      <Button onClick={() => setIsNetSite(true)} variant="contained">
        New
      </Button>
    </Fragment>
  );
}

export default Home;
