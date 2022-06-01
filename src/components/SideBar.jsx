import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import useSiteConfig from "../lib/useSiteConfig";
import { Typography } from "@mui/material";
import { useHistory } from "react-router-dom";

function SideBar() {
  const siteConfig = useSiteConfig();
  const history = useHistory();

  const copyMediaFilePath = async () => {
    if (siteConfig.media.staticPath === "") {
      alert("please set media folder path");
      return;
    }
    const { err, filePath, canceled } = await window.electronAPI.getMediaFile(
      siteConfig.media.staticPath,
      siteConfig.media.publicPath
    );
    if (canceled) return;
    if (err !== null) {
      alert(err);
      return;
    }

    const buf = document.createElement("input");
    document.body.appendChild(buf);
    buf.value = filePath;
    buf.select();
    document.execCommand("copy");
    document.body.removeChild(buf);
  };

  return (
    <div>
      <div className="flex">
        <ChevronLeftOutlinedIcon
          className="hpointer"
          fontSize="small"
          onClick={() => history.goBack()}
        />
        <ChevronRightOutlinedIcon
          className="hpointer"
          fontSize="small"
          onClick={() => history.goForward()}
        />
        <HomeOutlinedIcon
          fontSize="small"
          onClick={() => history.push("/")}
          className="hpointer"
        />
        <ReplayOutlinedIcon
          fontSize="small"
          className="hpointer"
          onClick={() => window.location.reload()}
        />
      </div>
      {siteConfig !== null && (
        <div>
          <Typography variant="h6">{siteConfig.name}</Typography>

          <div style={{ padding: "10px" }} />

          {/* mapping pinnedDirs */}
          <Typography
            variant="caption"
            sx={{ fontWeight: "bold", color: "#999" }}
          >
            PINNED
          </Typography>
          <div className="pinnedDirs">
            {siteConfig.pinnedDirs.map((dir) => (
              <div
                className="pinnedDir"
                onClick={() =>
                  history.push(
                    "/site/edit/" +
                      siteConfig.key +
                      "?path=" +
                      dir.path +
                      "&name=" +
                      dir.name +
                      "&isDir=" +
                      dir.isDir
                  )
                }
              >
                {dir.isDir ? (
                  <FolderOpenOutlinedIcon fontSize="small" />
                ) : (
                  <DescriptionOutlinedIcon fontSize="small" />
                )}
                <Typography variant="subtitle1" sx={{ paddingLeft: "5px" }}>
                  {dir.name}
                </Typography>
              </div>
            ))}
          </div>

          <div style={{ padding: "10px" }} />

          <Typography
            variant="caption"
            sx={{ fontWeight: "bold", color: "#999" }}
          >
            SITE
          </Typography>
          <div className="site-links">
            <div className="site-link" onClick={copyMediaFilePath}>
              <PermMediaOutlinedIcon fontSize="small" />
              <Typography variant="subtitle1" sx={{ paddingLeft: "5px" }}>
                Media
              </Typography>
            </div>
            <div
              className="site-link"
              onClick={() => history.push("/site/settings/" + siteConfig.key)}
            >
              <NotesOutlinedIcon fontSize="small" />
              <Typography variant="subtitle1" sx={{ paddingLeft: "5px" }}>
                Settings
              </Typography>
            </div>
          </div>
        </div>
      )}

      {siteConfig === null && (
        <>
          <div style={{ padding: "10px" }} />
          <Typography
            variant="caption"
            sx={{ fontWeight: "bold", color: "#999" }}
          >
            GLOBAL
          </Typography>
          <div className="site-links">
            <div
              className="site-link"
              onClick={() => history.push("/settings/")}
            >
              <NotesOutlinedIcon fontSize="small" />
              <Typography variant="subtitle1" sx={{ paddingLeft: "5px" }}>
                Settings
              </Typography>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SideBar;
