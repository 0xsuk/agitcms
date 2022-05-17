import { useState } from "react";
import {
  Button,
  Divider,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import useSiteConfig from "../../../lib/useSiteConfig";
import useSiteConfigBuffer from "../../../lib/useSiteConfigBuffer";
import FrontmatterDialog from "./FrontmatterDialog";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import CommandDialog from "./CommandDialog";

function Site() {
  const siteConfig = useSiteConfig();
  const [
    siteConfigBuffer,
    {
      editCommand,
      editCommandName,
      addCommand,
      removeCommand,
      reorderCommands,
      addFrontmatter,
      removeFrontmatter,
      reorderFrontmatter,
      editPath,
      saveSiteConfig,
      removeSiteConfig,
      cancelSiteConfig,
    },
  ] = useSiteConfigBuffer(siteConfig);

  const isDirty =
    JSON.stringify(siteConfig) !== JSON.stringify(siteConfigBuffer);

  if (isDirty) {
    saveSiteConfig();
  }

  const [FrontmatterAnchorEl, setFrontmatterAnchorEl] = useState(null);
  const [CommandAnchorEl, setCommandAnchorEl] = useState(null);
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
        {/* Commands */}
        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <Typography variant="h6">Command shortcuts</Typography>
          </Grid>
          <Grid item>
            <Button onClick={() => setIsCommandDialogOpen(true)}>New</Button>
          </Grid>
        </Grid>

        <Grid item sx={{ width: "100%" }}>
          <DragDropContext onDragEnd={reorderCommands}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {siteConfigBuffer.commands?.map((cmd, i) => (
                    <Draggable key={cmd.key} draggableId={cmd.key} index={i}>
                      {(provided) => (
                        <div
                          className="setting-draggable"
                          data-id={cmd.key}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ ...provided.draggableProps.style }}
                        >
                          <p>{cmd.name}</p>
                          <p
                            style={{
                              color: "#999",
                              right: "200px",
                              position: "absolute",
                              maxWidth: "50%",
                            }}
                          >
                            {cmd.command}
                          </p>
                          <MoreHorizIcon
                            onClick={(e) => {
                              setCommandAnchorEl(e.currentTarget);
                              e.stopPropagation();
                            }}
                          />
                          <Menu
                            //TODO: many Menu refer to the same el
                            anchorEl={CommandAnchorEl}
                            open={
                              CommandAnchorEl?.parentNode.dataset.id === cmd.key
                            }
                            onClose={(e) => {
                              setCommandAnchorEl(null);
                              e.stopPropagation();
                            }}
                            //on Click menuitems
                            onClick={(e) => {
                              setCommandAnchorEl(null);
                              e.stopPropagation();
                            }}
                          >
                            {/* TODO: delete not working */}
                            <MenuItem onClick={() => removeCommand(cmd.key)}>
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
        {/* -Commands */}

        {/* Frontmatter */}
        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <Typography variant="h6">Frontmatter template</Typography>
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
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {siteConfigBuffer.frontmatter?.map((matter, i) => (
                    <Draggable
                      key={matter.key}
                      draggableId={matter.key}
                      index={i}
                    >
                      {(provided) => (
                        <div
                          className="setting-draggable"
                          data-id={matter.id}
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
                            open={
                              FrontmatterAnchorEl?.parentNode.dataset.id ===
                              matter.id
                            }
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
                            {/* TODO: delete not working */}
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
        {/* -Frontmatter */}

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
