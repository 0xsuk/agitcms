import { Link, useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { ArrowBackIosNew } from "@mui/icons-material";
import useSiteConfig from "../lib/useSiteConfig";

function SideBar() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const { siteConfig, isNew } = useSiteConfig();

  return (
    <Fragment>
      <ArrowBackIosNew className="mui-icon" onClick={goBack} />

      {/*TODO: siteConfig.pinnedDirs.map */}
      {siteConfig !== null && (
        <div>
          {isNew && <h1>New Site</h1>}
          <h1>{siteConfig.name}</h1>
          <p>{siteConfig.path}</p>
          {siteConfig.pinnedDirs.map((dir) => (
            <div>
              <Link
                to={
                  "/edit/" +
                  siteConfig.key +
                  "?path=" +
                  dir.path +
                  "&name=" +
                  dir.name +
                  "&isDir=" +
                  dir.isDir
                }
              >
                {dir.name}
              </Link>
            </div>
          ))}
          <br></br>
          <div>
            <Link to="/">Home</Link>
          </div>
          <div>
            <Link to={"/edit/" + siteConfig.key + "?path=" + siteConfig.path}>
              Root
            </Link>
          </div>
          <div>
            <Link to={"/settings/" + siteConfig.key}>Settings</Link>
          </div>
        </div>
      )}

      {!siteConfig && (
        <div>
          <h1>Home</h1>
        </div>
      )}
    </Fragment>
  );
}

export default SideBar;
