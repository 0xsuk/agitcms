import { Link } from "react-router-dom";
import { Fragment } from "react";
import useSiteConfig from "../lib/useSiteConfig";

function SideBar() {
  const { siteConfig, isNew } = useSiteConfig();

  return (
    <div>
      {/*TODO: siteConfig.pinnedDirs.map */}
      {siteConfig !== null && !isNew && (
        <div>
          <p style={{ fontSize: "20px", padding: "0 10px" }}>
            {siteConfig.name}
          </p>

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
    </div>
  );
}

export default SideBar;
