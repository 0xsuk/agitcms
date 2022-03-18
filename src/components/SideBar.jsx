import { Link } from "react-router-dom";
import useSiteConfig from "../lib/useSiteConfig";
import { Button } from "@mui/material";

function SideBar() {
  const { siteConfig, isNew } = useSiteConfig();

  const runCommand = async (command) => {
    window.electronAPI.runCommand(
      command.command,
      siteConfig.path,
      command.key
    );
  };

  return (
    <div>
      {siteConfig !== null && !isNew && (
        <div>
          <p style={{ fontSize: "20px", padding: "0 10px" }}>
            {siteConfig.name}
          </p>

          {/*TODO: mapping commands  */}
          {siteConfig.commands.map((command) => (
            <div>
              <Button onClick={() => runCommand(command)}>
                {command.name}
              </Button>
            </div>
          ))}

          {/* mapping pinnedDirs */}
          {siteConfig.pinnedDirs.map((dir) => (
            <div>
              <Link
                to={
                  "/edit/" +
                  siteConfig.key +
                  "?path=" +
                  dir.path +
                  "&name=" +
                  dir.name +
                  "&isDir=" +
                  dir.isDir
                }
              >
                {dir.name}
              </Link>
            </div>
          ))}
          <br></br>
          <div>
            <Link to="/">Home</Link>
          </div>
          <div>
            <Link to={"/edit/" + siteConfig.key + "?path=" + siteConfig.path}>
              Root
            </Link>
          </div>
          <div>
            <Link to={"/settings/" + siteConfig.key}>Settings</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default SideBar;
