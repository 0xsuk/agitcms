import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import { Link } from "react-router-dom";
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
      {siteConfig !== null && (
        <div>
          <Typography variant="h6">{siteConfig.name}</Typography>

          {/*TODO: mapping commands  */}
          {siteConfig.commands.map((command) => (
            <div>
              <Button onClick={() => runCommand(command)}>
                {command.name}
              </Button>
              {/* TODO: isCommandRunning? -> Stop button */}
              <Button onClick={() => stopCommand(command.key)}>Stop</Button>
            </div>
          ))}

          {/* mapping pinnedDirs */}
          <div style={{ borderBottom: "solid 1px #ddd" }}>
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

          <div>
            <Link to={"/edit/" + siteConfig.key + "?path=" + siteConfig.path}>
              Root
            </Link>
          </div>
          <div>
            <Link to={"/shell/" + siteConfig.key}>Shell</Link>
          </div>
          <div>
            <Link to={"/settings/" + siteConfig.key}>Settings</Link>
          </div>
        </div>
      )}
      <div>
        <Link to="/">Home</Link>
      </div>

      <div>
        <Link to="/test">Test</Link>
      </div>
    </div>
  );
}

export default SideBar;
