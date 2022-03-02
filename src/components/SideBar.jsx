import { Link, useNavigate, useParams } from "react-router-dom";
import { Fragment } from "react";
import { ArrowBackIosNew } from "@mui/icons-material";

function SideBar() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const params = useParams()

  // useEffect(() => navigate("/edit"), []);
  return (
    <Fragment>
      <ArrowBackIosNew className="mui-icon" onClick={goBack} />

      {params.siteKey && <h1>{params.siteKey}</h1>}

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
