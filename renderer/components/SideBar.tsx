import useSiteConfig from "@/utils/useSiteConfig";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Typography } from "@mui/material";
import { useState } from "react";
import { useHistory } from "react-router-dom";

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
          <ReplayOutlinedIcon
            fontSize="small"
            className="hpointer"
            onClick={() => window.location.reload()}
          />
          <HomeOutlinedIcon
            fontSize="small"
            onClick={() => history.push("/")}
            className="hpointer"
          />
        </div>
        {siteConfig !== null && (
          <div>
            <Typography sx={{ fontWeight: "semi-bold" }}>
              {siteConfig.name}
            </Typography>

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
                          "&isDir=" +
                          dir.isDir
                      );
                    } else {
                      history.push(
                        "/site/editor/" +
                          siteConfig.key +
                          "?path=" +
                          dir.path +
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
                <SettingsOutlinedIcon fontSize="small" />
                <Typography variant="subtitle1" sx={{ paddingLeft: "5px" }}>
                  Settings
                </Typography>
              </div>
            </div>
          </>
        )}
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
