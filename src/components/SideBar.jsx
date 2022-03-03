import { Link, useNavigate, useParams } from "react-router-dom";
import { Fragment, useContext } from "react";
import { ArrowBackIosNew } from "@mui/icons-material";
import { ConfigContext } from "../App";

function SideBar() {
  const { config } = useContext(ConfigContext);
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const params = useParams();
  let siteConfig;
  if (params.siteKey) {
    config.sites.every((site, i) => {
      if (site.key == params.siteKey) {
        siteConfig = site;
        return false;
      }
      return true;
    });
  }

  // useEffect(() => navigate("/edit"), []);
  return (
    <Fragment>
      <ArrowBackIosNew className="mui-icon" onClick={goBack} />

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
