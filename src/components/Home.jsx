import { Fragment, useContext, useState } from "react";
import { Button } from "@mui/material";
import Site from "./settings/site/Site";
import { configContext } from "../context/ConfigContext";
import { newSiteConfig } from "../lib/config";
import { Link } from "react-router-dom";

function Home() {
  const { config } = useContext(configContext);
  const [isNewSite, setIsNewSite] = useState(false);

  return (
    <Fragment>
      <h1>Home</h1>
      {config.sites?.map((siteConfig) => (
        <div className="flex">
          <Link to={"/edit/" + siteConfig.key}>
            <h2>{siteConfig.name}</h2>
          </Link>
          <Link to={"/settings/" + siteConfig.key}>
            <Button>Edit</Button>
          </Link>
        </div>
      ))}
      <Button onClick={() => setIsNewSite(true)} variant="contained">
        New
      </Button>
    </Fragment>
  );
}

export default Home;
