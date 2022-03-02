import { useNavigate } from "react-router-dom";
import { Fragment, useState } from "react";
import { Folder } from "@mui/icons-material";
import { Button } from "@mui/material";

function Site({ _siteConfig, updateSiteConfig }) {
  const [editMode, setEditMode] = useState(false);
  const [siteConfig, setSiteConfig] = useState(_siteConfig);
  const navigate = useNavigate();

  const selectSite = (key) => {
    navigate("edit/"+key);
  };

  const updateCommands = (cmd_name, e) => {
    siteConfig.commands[cmd_name] = e.target.value;
    setSiteConfig(Object.assign({}, siteConfig));
  };

  return (
    <Fragment>
      {!editMode && (
        <div className="flex">
          <div
            style={{ background: "gray" }}
            onClick={() => selectSite(siteConfig.key)}
          >
            <p>{siteConfig.key}</p>
            <p>{siteConfig.path}</p>
          </div>
          <Button onClick={() => setEditMode(true)}>Edit</Button>
        </div>
      )}
      {editMode && (
        <div>
          <div className="flex">
            <p>{siteConfig.path}</p>
            <Button>
              {/* TODO: add open dialog event */}
              <Folder />
            </Button>
          </div>
          <div>
            <p>Commands</p>
            <div>
              {Object.keys(siteConfig.commands).map((cmd_name) => (
                <div className="flex">
                  <p>{cmd_name}:</p>
                  <input
                    onChange={(e) => updateCommands(cmd_name, e)}
                    value={siteConfig.commands[cmd_name]}
                  />
                </div>
              ))}
            </div>
          </div>
          <Button
            onClick={() => {
              updateSiteConfig(siteConfig);
              setEditMode(false);
            }}
          >
            Save
          </Button>
        </div>
      )}
    </Fragment>
  );
}

export default Site