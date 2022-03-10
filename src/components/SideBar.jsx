import { Link, useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { ArrowBackIosNew } from "@mui/icons-material";
import { useSiteConfig } from "../lib/config";

function SideBar() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const [_, siteConfig] = useSiteConfig();

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
    </Fragment>
  );
}

export default SideBar;
