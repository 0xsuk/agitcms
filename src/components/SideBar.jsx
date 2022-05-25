import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import useSiteConfig from "../lib/useSiteConfig";
import { Button, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";

function SideBar() {
  const siteConfig = useSiteConfig();
  const history = useHistory();

  const runCommand = async (command) => {
    const { err } = await window.electronAPI.runCommand(
      command.command,
      siteConfig.path,
      command.key
    );
    if (err) {
      alert(err.message);
    }
  };

  const stopCommand = async (cid) => {
    window.electronAPI.stopCommand(cid);
  };

  return (
    <div>
      <div className="flex">
        <HomeOutlinedIcon
          fontSize="small"
          onClick={() => history.push("/")}
          sx={{ "&:hover": { cursor: "pointer" } }}
        />
      </div>
      {siteConfig !== null && (
        <div>
          <Typography variant="h6">{siteConfig.name}</Typography>

          {/*{siteConfig.commands.map((command) => (
            <div>
              <Button onClick={() => runCommand(command)}>
                {command.name}
              </Button>
               TODO: isCommandRunning? -> Stop button 
              <Button onClick={() => stopCommand(command.key)}>Stop</Button>
            </div>
            ))} 
          */}
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
                    "/edit/" +
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
            <div
              className="site-link"
              onClick={() => history.push("/shell/" + siteConfig.key)}
            >
              <NotesOutlinedIcon fontSize="small" />
              <Typography variant="subtitle1" sx={{ paddingLeft: "5px" }}>
                Shell
              </Typography>
            </div>
            <div
              className="site-link"
              onClick={() => history.push("/settings/" + siteConfig.key)}
            >
              <NotesOutlinedIcon fontSize="small" />
              <Typography variant="subtitle1" sx={{ paddingLeft: "5px" }}>
                Settings
              </Typography>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SideBar;
