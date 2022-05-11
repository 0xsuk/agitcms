import { Fragment, useContext } from "react";
import { Button } from "@mui/material";
import { configContext } from "../context/ConfigContext";
import { Link, useHistory } from "react-router-dom";

function Home() {
  console.log("HOME");
  const { config } = useContext(configContext);
  const history = useHistory();

  const addNewSite = () => {
    //siteKey == "new"
    history.push("/settings/new");
  };

  return (
    <Fragment>
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
      <Button onClick={addNewSite} variant="contained">
        New
      </Button>
    </Fragment>
  );
}

export default Home;
