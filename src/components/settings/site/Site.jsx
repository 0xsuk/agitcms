import { useState } from "react";
import {
  Button,
  Divider,
  Grid,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import useSiteConfig from "../../../lib/useSiteConfig";
import useSiteConfigBuffer from "../../../lib/useSiteConfigBuffer";
import FrontmatterDialog from "./FrontmatterDialog";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useHistory } from "react-router-dom";
import CommandDialog from "./CommandDialog";

function Site() {
  const siteConfig = useSiteConfig();
  const [
    siteConfigBuffer,
    {
      editName,
      editCommand,
      editCommandName,
      addCommand,
      removeCommand,
      addFrontmatter,
      removeFrontmatter,
      reorderFrontmatter,
      editPath,
      saveSiteConfig,
      removeSiteConfig,
      cancelSiteConfig,
    },
  ] = useSiteConfigBuffer(siteConfig);
  const history = useHistory();

  const isDirty =
    JSON.stringify(siteConfig) !== JSON.stringify(siteConfigBuffer);

  if (isDirty) {
    console.log(JSON.stringify(siteConfig));
    console.log(JSON.stringify(siteConfigBuffer));
    saveSiteConfig();
  }

  const [FrontmatterAnchorEl, setFrontmatterAnchorEl] = useState(null);
  const [isFrontmatterDialogOpen, setIsFrontmatterDialogOpen] = useState(false);
  const [isCommandDialogOpen, setIsCommandDialogOpen] = useState(false);

  return (
    <div id="setting-site">
      <FrontmatterDialog
        open={isFrontmatterDialogOpen}
        onClose={() => setIsFrontmatterDialogOpen(false)}
        addFrontmatter={addFrontmatter}
      />
      <CommandDialog
        open={isCommandDialogOpen}
        onClose={() => setIsCommandDialogOpen(false)}
        addCommand={addCommand}
      />
      <Grid container spacing={1}>
        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <Typography>Name:</Typography>
          </Grid>
          <Grid item>
            <Typography sx={{ color: "#999" }}>
              {siteConfigBuffer.name}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <Typography>Path:</Typography>
          </Grid>
          <Grid item>
            <Typography sx={{ color: "#999" }}>
              {siteConfigBuffer.path}
            </Typography>
          </Grid>
        </Grid>
      </Grid>

      <Divider sx={{ padding: "20px", color: "#999" }}>optional</Divider>

      <Grid container spacing={1}>
        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <Typography>Command shortcuts</Typography>
          </Grid>
          <Grid item>
            <Button onClick={() => setIsCommandDialogOpen(true)}>New</Button>
          </Grid>
        </Grid>
        {siteConfigBuffer.commands.length !== 0 &&
          siteConfigBuffer.commands.map((cmd_obj, i) => (
            <Grid item container spacing={1} alignItems="center">
              <Grid item>
                <TextField
                  value={cmd_obj.name}
                  variant="standard"
                  onChange={(e) => editCommandName(e.target.value, i)}
                />
              </Grid>
              <Grid item>
                <TextField
                  value={cmd_obj.command}
                  variant="standard"
                  onChange={(e) => editCommand(e.target.value, i)}
                />
              </Grid>
              <Grid item>
                <Button onClick={() => removeCommand(i)}>x</Button>
              </Grid>
            </Grid>
          ))}

        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <Typography>Frontmatter template</Typography>
          </Grid>
          <Grid item>
            <Button onClick={() => setIsFrontmatterDialogOpen(true)}>
              New
            </Button>
          </Grid>
        </Grid>

        <Grid item sx={{ width: "100%" }}>
          <DragDropContext onDragEnd={reorderFrontmatter}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div
                  className="setting-frontmatter-list"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {siteConfigBuffer.frontmatter?.map((matter, i) => (
                    <Draggable
                      key={matter.key}
                      draggableId={matter.key}
                      index={i}
                    >
                      {(provided) => (
                        <div
                          className="setting-matter"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ ...provided.draggableProps.style }}
                        >
                          <p>{matter.key}</p>
                          <p
                            style={{
                              color: "#999",
                              right: "400px",
                              position: "absolute",
                            }}
                          >
                            {String(matter.default)}
                          </p>
                          <p
                            style={{
                              color: "#999",
                              right: "200px",
                              position: "absolute",
                            }}
                          >
                            {matter.type}
                          </p>
                          <MoreHorizIcon
                            onClick={(e) => {
                              setFrontmatterAnchorEl(e.currentTarget);
                              e.stopPropagation();
                            }}
                          />
                          <Menu
                            anchorEl={FrontmatterAnchorEl}
                            open={FrontmatterAnchorEl !== null}
                            onClose={(e) => {
                              setFrontmatterAnchorEl(null);
                              e.stopPropagation();
                            }}
                            //on Click menuitems
                            onClick={(e) => {
                              setFrontmatterAnchorEl(null);
                              e.stopPropagation();
                            }}
                          >
                            {/*TODO<MenuItem
                            onClick={() => removeFrontmatter(matter.id)}
                          >
                            edit
                          </MenuItem>*/}
                            <MenuItem
                              onClick={() => removeFrontmatter(matter.id)}
                            >
                              delete
                            </MenuItem>
                          </Menu>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Grid>

        <Grid
          item
          container
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{ marginTop: "20px" }}
        >
          <Grid item>
            <Button onClick={() => removeSiteConfig(siteConfigBuffer.key)}>
              Delete
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Site;
