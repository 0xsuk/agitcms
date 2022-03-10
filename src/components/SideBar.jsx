import { Link, useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { ArrowBackIosNew } from "@mui/icons-material";
import useSiteConfig from "../lib/useSiteConfig";

function SideBar() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const [siteKey, siteConfig] = useSiteConfig();

  return (
    <Fragment>
      <ArrowBackIosNew className="mui-icon" onClick={goBack} />

      {/*TODO: siteConfig.pinnedDirs.map */}
      {siteConfig && (
        <div>
          <h1>{siteConfig.name}</h1>
          <p>{siteConfig.path}</p>
          <div>
            <Link to="/">Home</Link>
          </div>
          <div>
            <Link to={"/edit/" + siteKey + "?path=" + siteConfig.path}>
              Root
            </Link>
          </div>
          <div>
            <Link to={"/settings/" + siteKey}>Settings</Link>
          </div>
        </div>
      )}
    </Fragment>
  );
}

export default SideBar;
