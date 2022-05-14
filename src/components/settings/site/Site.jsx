import { useState } from "react";
import { Folder } from "@mui/icons-material";
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
import { Prompt } from "react-router-dom";
import { useHistory } from "react-router-dom";

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
      addFrontmatter,
      removeFrontmatter,
      reorderFrontmatter,
      editPath,
      saveSiteConfig,
      removeSiteConfig,
      cancelSiteConfig,
    },
  ] = useSiteConfigBuffer(initialSiteConfig);
  const history = useHistory();

  const isDirty =
    JSON.stringify(initialSiteConfig) !== JSON.stringify(siteConfig);

  const [isFrontmatterDialogOpen, setIsFrontmatterDialogOpen] = useState(false);
  const closeFrontmatterDialog = () => {
    setIsFrontmatterDialogOpen(false);
  };
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <div id="setting-site">
      <Prompt when={isDirty} message="Continue without saving?" />
      {isNew && <Typography variant="h6">Create a new site</Typography>}
      <Grid container spacing={1}>
        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <Typography>Name:</Typography>
          </Grid>
          <Grid item>
            <TextField
              placeholder="Name of the site"
              value={siteConfig.name}
              variant="standard"
              onChange={(e) => {
                editName(e.target.value);
              }}
            />
          </Grid>
        </Grid>
        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <Typography>Path:</Typography>
          </Grid>
          <Grid item>
            <Typography sx={{ color: "#999" }}>
              {siteConfig.path ? siteConfig.path : "select root folder path"}
            </Typography>
          </Grid>
          <Grid item>
            <Button>
              <Folder onClick={editPath} />
            </Button>
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
            <Button onClick={addNewCommand}>New</Button>
          </Grid>
        </Grid>
        {siteConfig.commands.length !== 0 &&
          siteConfig.commands.map((cmd_obj, i) => (
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
          <FrontmatterDialog
            open={isFrontmatterDialogOpen}
            onClose={closeFrontmatterDialog}
            addFrontmatter={addFrontmatter}
          />
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
                  {siteConfig.frontmatter?.map((matter, i) => (
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
                              setAnchorEl(e.currentTarget);
                              e.stopPropagation();
                            }}
                          />
                          <Menu
                            anchorEl={anchorEl}
                            open={anchorEl !== null}
                            onClose={(e) => {
                              setAnchorEl(null);
                              e.stopPropagation();
                            }}
                            //on Click menuitems
                            onClick={(e) => {
                              setAnchorEl(null);
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
            <Button onClick={cancelSiteConfig}>Cancel</Button>
          </Grid>
          <Grid item>
            <Button
              onClick={() => {
                if (saveSiteConfig() && isNew) {
                  history.replace("/settings/" + siteConfig.key);
                }
              }}
            >
              Save
            </Button>
          </Grid>
          <Grid item>
            <Button onClick={() => removeSiteConfig(siteConfig.key)}>
              Delete
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Site;
