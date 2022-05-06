import { Fragment, useState } from "react";
import { Folder } from "@mui/icons-material";
import { Button } from "@mui/material";
import useSiteConfig from "../../../lib/useSiteConfig";
import useSiteConfigBuffer from "../../../lib/useSiteConfigBuffer";
import FrontmatterDialog from "./FrontmatterDialog";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
      addOrEditFrontmatter,
      removeFrontmatter,
      reorderFrontmatter,
      editPath,
      saveSiteConfig,
      removeSiteConfig,
      cancelSiteConfig,
    },
  ] = useSiteConfigBuffer(initialSiteConfig);

  console.log(siteConfig.frontmatter);

  const [isFrontmatterDialogOpen, setIsFrontmatterDialogOpen] = useState(false);
  const closeFrontmatterDialog = () => {
    setIsFrontmatterDialogOpen(false);
  };

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
          <Button onClick={() => setIsFrontmatterDialogOpen(true)}>New</Button>
          <FrontmatterDialog
            open={isFrontmatterDialogOpen}
            onClose={closeFrontmatterDialog}
            addOrEditFrontmatter={addOrEditFrontmatter}
          />

          <DragDropContext onDragEnd={reorderFrontmatter}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {siteConfig.frontmatter?.map((matter, i) => (
                    <Draggable
                      key={matter.key}
                      draggableId={matter.key}
                      index={i}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {matter.key}
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <Button onClick={cancelSiteConfig}>Cancel</Button>
        <Button onClick={saveSiteConfig}>Save</Button>
        <Button onClick={() => removeSiteConfig(siteConfig.key)}>Delete</Button>
      </div>
    </Fragment>
  );
}

export default Site;
