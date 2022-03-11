import { Fragment } from "react";
import { Folder } from "@mui/icons-material";
import { Button } from "@mui/material";
import useSiteConfig from "../../../lib/useSiteConfig";
import useSiteConfigBuffer from "../../../lib/useSiteConfigBuffer";

function Site() {
  const res = useSiteConfig();
  const initialSiteConfig = res.siteConfig;
  const isNew = res.isNew;
  const [
    siteConfig,
    {
      updateName,
      updateCommand,
      updateCommandKey,
      updateFrontmatterDefault,
      updateFrontmatterKey,
      updateFrontmatterType,
      updatePath,
      saveSiteConfig,
      deleteSiteConfig,
      cancelSiteConfig,
    },
  ] = useSiteConfigBuffer(initialSiteConfig);

  return (
    <Fragment>
      <div>
        {isNew && <h1>New Site</h1>}
        <div className="flex">
          <p>name:</p>
          <input
            onChange={(e) => {
              updateName(e.target.value);
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
                  onChange={(e) => updateFrontmatterDefault(e.target.value, i)}
                />
              </div>
            ))}
        </div>

        <Button onClick={cancelSiteConfig}>Cancel</Button>
        <Button onClick={saveSiteConfig}>Save</Button>
        <Button onClick={() => deleteSiteConfig(siteConfig.key)}>Delete</Button>
      </div>
    </Fragment>
  );
}

export default Site;
