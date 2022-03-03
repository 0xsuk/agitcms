import { Fragment, useContext, useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { ConfigContext } from "../App";
import { findSiteConfigBySiteKey } from "../lib/config";

function Dir() {
  console.log("Dir");
  const { config } = useContext(ConfigContext);
  const [filesAndFolders, setFilesAndFolders] = useState([]);
  const pathname = useLocation().pathname;
  const { siteKey } = useParams();
  const siteConfig = findSiteConfigBySiteKey(config, siteKey);
  const currentDir = siteConfig.path + pathname.replace("/edit/" + siteKey, "");
  console.log(currentDir);

  useEffect(async () => {
    const res = await window.electronAPI.getFilesAndFolders(siteConfig.path);
    if (res.err) {
      alert(res.err.message);
      return;
    }
    setFilesAndFolders(res.filesAndFolders);
  }, []);

  return (
    <Fragment>
      {filesAndFolders.map((f) => (
        <Link to={f.name}>
          <div>
            {f.name} {f.isDir && "(isDir)"}
          </div>
        </Link>
      ))}
    </Fragment>
  );
}

export default Dir;
