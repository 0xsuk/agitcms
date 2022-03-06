import { useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState, useContext } from "react";
import { configContext } from "../context/ConfigContext";
import { Folder } from "@mui/icons-material";
import { Button } from "@mui/material";

function Site({ _siteConfig, isNewSite, setIsNewSite }) {
  const [editMode, setEditMode] = useState(
    isNewSite === undefined ? false : isNewSite
  );
  const [siteConfig, setSiteConfig] = useState(_siteConfig);
  const { updateSiteConfig, deleteSiteConfig } = useContext(configContext);
  const navigate = useNavigate();

  const selectSite = (key) => {
    navigate("edit/" + key);
  };

  const updatePath = async () => {
    const { folderPath, err, canceled } =
      await window.electronAPI.getFolderPath();
    if (err) {
      alert(err);
      return;
    }
    if (!err && !canceled) {
      siteConfig.path = folderPath;
      setSiteConfig(Object.assign({}, siteConfig));
    }
  };
  const updateCommands = (cmd_name, e) => {
    siteConfig.commands[cmd_name] = e.target.value;
    setSiteConfig(Object.assign({}, siteConfig));
  };

  const saveSiteConfig = () => {
    if (siteConfig.name === "") {
      alert("name cannot be empty");
      return;
    }
    if (siteConfig.path === "") {
      alert("path cannot be empty");
      return;
    }

    updateSiteConfig(siteConfig);
    if (isNewSite) setIsNewSite(false);
    setEditMode(false);
  };

  const cancelSiteConfig = () => {
    //siteConfig state is remains modified
    setSiteConfig(_siteConfig);
    if (isNewSite) setIsNewSite(false);
    setEditMode(false);
  };

  useEffect(() => {
    if (siteConfig.key === "") setEditMode(true);
  }, [siteConfig]);

  return (
    <Fragment>
      {!editMode && (
        <div className="flex">
          <div
            style={{ background: "gray" }}
            onClick={() => selectSite(siteConfig.key)}
          >
            <h2>{siteConfig.name}</h2>
            <p>{siteConfig.key}</p>
            <p>{siteConfig.path}</p>
          </div>
          <Button onClick={() => setEditMode(true)}>Edit</Button>
        </div>
      )}
      {editMode && (
        <div>
          <div className="flex">
            <p>name:</p>
            <input
              onChange={(e) => {
                setSiteConfig((pre) => ({ ...pre, name: e.target.value }));
              }}
              value={siteConfig.name}
            />
          </div>
          <p>key: {siteConfig.key}</p>
          <div className="flex">
            <p>{siteConfig.path}</p>
            <Button>
              <Folder onClick={updatePath} />
            </Button>
          </div>

          {/* TODO: add new commands */}
          <div>
            <p>Commands</p>
            <div>
              {siteConfig.commands &&
                Object.keys(siteConfig.commands).map((cmd_name) => (
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

          <Button onClick={cancelSiteConfig}>Cancel</Button>
          <Button onClick={saveSiteConfig}>Save</Button>
          {!isNewSite && (
            <Button onClick={() => deleteSiteConfig(siteConfig.key)}>
              Delete
            </Button>
          )}
        </div>
      )}
    </Fragment>
  );
}

export default Site;
