import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
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
import { useState } from "react";

function SideBar() {
  const siteConfig = useSiteConfig();
  const history = useHistory();
  const [isVisible, setIsVisible] = useState(true);

  const sidebarBody = document.getElementById("sidebar-body");
  if (isVisible && sidebarBody) {
    sidebarBody.style.display = "block";
  } else if (!isVisible && sidebarBody) {
    sidebarBody.style.display = "none";
  }

  return (
    <div id="sidebar">
      <div id="sidebar-body">
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
                  onClick={() => {
                    if (dir.isDir) {
                      history.push(
                        "/site/explorer/" +
                          siteConfig.key +
                          "?path=" +
                          dir.path +
                          "&name=" +
                          dir.name +
                          "&isDir=" +
                          dir.isDir
                      );
                    } else {
                      history.push(
                        "/site/editor/" +
                          siteConfig.key +
                          "?path=" +
                          dir.path +
                          "&name=" +
                          dir.name +
                          "&isDir=" +
                          dir.isDir
                      );
                    }
                  }}
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
              <div
                className="site-link"
                onClick={() => history.push("/site/settings/" + siteConfig.key)}
              >
                <SettingsOutlinedIcon fontSize="small" />
                <Typography variant="subtitle1" sx={{ paddingLeft: "5px" }}>
                  Settings
                </Typography>
              </div>
            </div>
          </div>
        )}

        {/*siteConfig === null && (
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
      )*/}
      </div>
      {!isVisible && (
        <a id="sidebar-open" onClick={() => setIsVisible(true)}>
          <span>
            <svg viewBox="0 0 24 24">
              <path d="m 8 5 l 8 7 l -8 7 l -1 -1 l 7 -6 l -7 -6 l 1 -1"></path>
            </svg>
          </span>
        </a>
      )}
      {isVisible && (
        <a id="sidebar-close" onClick={() => setIsVisible(false)}>
          <span>
            <svg viewBox="0 0 24 24">
              <path d="m 16 5 l -8 7 l 8 7 l 1 -1 l -7 -6 l 7 -6 l -1 -1"></path>
            </svg>
          </span>
        </a>
      )}
    </div>
  );
}

export default SideBar;
