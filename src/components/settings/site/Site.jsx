import { useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState, useContext } from "react";
import { configContext } from "../../../context/ConfigContext";
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

  const updateSitePath = async () => {
    const { folderPath, err, canceled } =
      await window.electronAPI.getFolderPath();
    if (err) {
      alert(err);
      return;
    }
    if (!err && !canceled) {
      siteConfig.path = folderPath;
      setSiteConfig({ ...siteConfig });
    }
  };

  const updateCommandKey = (newKey, i) => {
    siteConfig.commands[i].key = newKey;
    setSiteConfig({ ...siteConfig });
  };
  const updateCommand = (newCommand, i) => {
    siteConfig.commands[i].command = newCommand;
    setSiteConfig({ ...siteConfig });
  };

  const updateFrontmatterKey = (newKey, i) => {
    siteConfig.frontmatter[i].key = newKey;
    setSiteConfig({ ...siteConfig });
  };
  const updateFrontmatterType = (newType, i) => {
    siteConfig.frontmatter[i].type = newType;
    setSiteConfig({ ...siteConfig });
  };
  const updateFrontmatterDefault = (newDefault, i) => {
    siteConfig.frontmatter[i].default = newDefault;
    setSiteConfig({ ...siteConfig });
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
              <Folder onClick={updateSitePath} />
            </Button>
          </div>

          {/* TODO: add new commands */}
          <div>
            <p>Commands</p>
            <Button>New</Button>
            <div>
              {siteConfig.commands?.length &&
                siteConfig.commands.map((cmd_obj, i) => (
                  <div className="flex">
                    <input
                      value={cmd_obj.key}
                      onChange={(e) => updateCommandKey(e.target.value, i)}
                    />
                    <input
                      value={cmd_obj.command}
                      onChange={(e) => updateCommand(e.target.value, i)}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* TODO: FrontMatter */}
          <div>
            <p>frontmatter</p>
            <Button>New</Button>
            {siteConfig.frontmatter?.length &&
              siteConfig.frontmatter.map((f, i) => (
                <div className="flex">
                  <input
                    value={f.key}
                    onChange={(e) => updateFrontmatterKey(e.target.value, i)}
                  />
                  <input
                    value={f.type}
                    onChange={(e) => updateFrontmatterType(e.target.value, i)}
                  />
                  <input
                    value={f.default}
                    onChange={(e) =>
                      updateFrontmatterDefault(e.target.value, i)
                    }
                  />
                </div>
              ))}
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
