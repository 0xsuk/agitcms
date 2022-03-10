import { Fragment, useContext } from "react";
import { Button } from "@mui/material";
import { configContext } from "../context/ConfigContext";
import { Link } from "react-router-dom";

function Home() {
  const { config } = useContext(configContext);

  const addNewSite = () => {};

  return (
    <Fragment>
      <h1>Home</h1>
      {config.sites?.map((siteConfig) => (
        <div className="flex">
          <Link to={"/edit/" + siteConfig.key + "?path=" + siteConfig.path}>
            <h2>{siteConfig.name}</h2>
          </Link>
        </div>
      ))}
      <Button onClick={addNewSite} variant="contained">
        New
      </Button>
    </Fragment>
  );
}

export default Home;
