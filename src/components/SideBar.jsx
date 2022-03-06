import { Link, useNavigate, useParams } from "react-router-dom";
import { Fragment, useContext } from "react";
import { ArrowBackIosNew } from "@mui/icons-material";
import { configContext } from "../context/ConfigContext";
import { findSiteConfigBySiteKey } from "../lib/config";

function SideBar() {
  const { config } = useContext(configContext);
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const params = useParams();
  let siteConfig;
  if (params.siteKey) {
    siteConfig = findSiteConfigBySiteKey(config, params.siteKey);
  }

  // useEffect(() => navigate("/edit"), []);
  return (
    <Fragment>
      <ArrowBackIosNew className="mui-icon" onClick={goBack} />

      {/*TODO: siteConfig.pinnedDirs.map */}
      {siteConfig && (
        <div>
          <h1>{siteConfig.name}</h1>
          <p>{siteConfig.path}</p>
        </div>
      )}

      <div>
        <Link to="/">Home</Link>
      </div>
      <div>
        <Link to="/settings">Settings</Link>
      </div>
      <div>
        <Link to="edit">edit</Link>
      </div>
    </Fragment>
  );
}

export default SideBar;
