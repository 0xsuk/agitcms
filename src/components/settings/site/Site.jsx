import { Fragment } from "react";
import { Folder } from "@mui/icons-material";
import { Button } from "@mui/material";
import useSiteConfig from "../../../lib/useSiteConfig";
import useSiteConfigBuffer from "../../../lib/useSiteConfigBuffer";

function Site() {
  const { siteConfig: initialSiteConfig, isNew } = useSiteConfig();
  const [
    siteConfig,
    {
      editName,
      editCommand,
      editCommandName,
      addNewCommand,
      removeCommand,
      editFrontmatterDefault,
      editFrontmatterKey,
      editFrontmatterType,
      addNewFrontmatter,
      removeFrontmatter,
      editPath,
      saveSiteConfig,
      removeSiteConfig,
      cancelSiteConfig,
    },
  ] = useSiteConfigBuffer(initialSiteConfig);

  console.log(siteConfig.frontmatter);

  return (
    <Fragment>
      <div>
        {isNew && <h1>New Site</h1>}
        <div className="flex">
          <p>name:</p>
          <input
            onChange={(e) => {
              editName(e.target.value);
            }}
            value={siteConfig.name}
          />
        </div>
        <p>key: {siteConfig.key}</p>
        <div className="flex">
          <p>{siteConfig.path}</p>
          <Button>
            <Folder onClick={editPath} />
          </Button>
        </div>

        <div>
          <p>Commands</p>
          <Button onClick={addNewCommand}>New</Button>
          <div>
            {siteConfig.commands.length !== 0 &&
              siteConfig.commands.map((cmd_obj, i) => (
                <div className="flex">
                  <input
                    value={cmd_obj.name}
                    onChange={(e) => editCommandName(e.target.value, i)}
                  />
                  <input
                    value={cmd_obj.command}
                    onChange={(e) => editCommand(e.target.value, i)}
                  />
                  <Button onClick={() => removeCommand(i)}>x</Button>
                </div>
              ))}
          </div>
        </div>

        <div>
          <p>frontmatter</p>
          <Button onClick={addNewFrontmatter}>New</Button>
          {siteConfig.frontmatter.length !== 0 &&
            siteConfig.frontmatter.map((f, i) => (
              <div className="flex">
                <input
                  value={f.key}
                  onChange={(e) => editFrontmatterKey(e.target.value, i)}
                />
                <input
                  value={f.type}
                  onChange={(e) => editFrontmatterType(e.target.value, i)}
                />
                <input
                  value={f.default}
                  onChange={(e) => editFrontmatterDefault(e.target.value, i)}
                />
                <Button onClick={() => removeFrontmatter(i)}>x</Button>
              </div>
            ))}
        </div>

        <Button onClick={cancelSiteConfig}>Cancel</Button>
        <Button onClick={saveSiteConfig}>Save</Button>
        <Button onClick={() => removeSiteConfig(siteConfig.key)}>Delete</Button>
      </div>
    </Fragment>
  );
}

export default Site;
