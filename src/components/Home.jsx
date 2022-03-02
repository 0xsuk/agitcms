import { Fragment, useContext } from "react";
import { Button } from "@mui/material";
import Site from "./Site"
import { ConfigContext } from "../App";


function Home() {
  const { config, updateConfig } = useContext(ConfigContext)
  console.log("home");

  const createSiteConfig = () => {
    if (!config.sites) return;
    //TODO sample
    const newSite = {
      key: "newsite",
      path: "/",
    };
    let isDuplicatedKey = false;
    config.sites.every((site) => {
      if (site.key == newSite.key) {
        isDuplicatedKey = true;
        return false;
      }
      return true;
    });
    if (isDuplicatedKey) {
      alert("key already exists");
      return;
    }
    config.sites.push(newSite);
    updateConfig(config);
  };

  const updateSiteConfig = (siteConfig) => {
    config.sites.every((site, i) => {
      if (site.key == siteConfig.key) {
        config.sites[i] = siteConfig;
        return false;
      }
      return true;
    });
    updateConfig(config);
  };

  return (
    <Fragment>
      <h1>Home</h1>
      {config.sites?.map((siteConfig) => (
        <Site _siteConfig={siteConfig} updateSiteConfig={updateSiteConfig} />
      ))}
      <Button onClick={createSiteConfig} variant="contained">
        New
      </Button>
    </Fragment>
  );
}

export default Home;
