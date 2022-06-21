import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import DragHandleOutlinedIcon from "@mui/icons-material/DragHandleOutlined";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Button,
  Divider,
  Grid,
  Menu,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import useSiteConfig, {
  FrontmatterLanguages,
  FrontmatterTypeToName,
} from "../lib/useSiteConfig";
import useSiteConfigBuffer from "../lib/useSiteConfigBuffer";
import CommandDialog from "./CommandDialog";
import CustomSelect from "./CustomSelect";
import FrontmatterDialog from "./FrontmatterDialog";
import TextDialog from "./TextDialog";

function Site() {
  const siteConfig = useSiteConfig();
  const [
    siteConfigBuffer,
    {
      editMediaPublicPath,
      editMediaStaticPath,
      editFrontmatterLanguage,
      editFrontmatterDelimiter,
      addCommand,
      addFrontmatter,
      removeFrontmatter,
      reorderFrontmatter,
      saveSiteConfig,
      removeSiteConfig,
    },
  ] = useSiteConfigBuffer(siteConfig);

  const isDirty =
    JSON.stringify(siteConfig) !== JSON.stringify(siteConfigBuffer);

  if (isDirty) {
    saveSiteConfig();
  }

  const [FrontmatterAnchorEl, setFrontmatterAnchorEl] = useState(null);
  const [isFrontmatterDialogOpen, setIsFrontmatterDialogOpen] = useState(false);
  const [isCommandDialogOpen, setIsCommandDialogOpen] = useState(false);
  const [
    isFrontmatterDelimiterEditorOpen,
    setIsFrontmatterDelimiterEditorOpen,
  ] = useState(false);

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
      <Grid container spacing={2}>
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
        <Grid item container spacing={1} alignItems="center">
          <Grid item>Frontmatter Language:</Grid>
          <Grid item xs={4}>
            <CustomSelect
              isSelected={(item) =>
                item === siteConfigBuffer.frontmatterLanguage
              }
              onChange={(newValue) => {
                editFrontmatterLanguage(newValue);
              }}
              items={FrontmatterLanguages}
            >
              {({ ref, setIsOpen }) => (
                <TextField
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <Button onClick={() => setIsOpen(true)} ref={ref}>
                        <ArrowDropDown />
                      </Button>
                    ),
                  }}
                  sx={{ color: "#999" }}
                  value={siteConfigBuffer.frontmatterLanguage}
                  variant="filled"
                  label="required"
                  size="small"
                ></TextField>
              )}
            </CustomSelect>
          </Grid>
        </Grid>
        <Grid item container spacing={1} alignItems="center">
          <Grid item>Frontmatter delimiters:</Grid>
          <Grid item xs={4}>
            <TextField
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <Button
                    onClick={() => setIsFrontmatterDelimiterEditorOpen(true)}
                  >
                    EDIT
                  </Button>
                ),
              }}
              sx={{ color: "#999" }}
              value={siteConfigBuffer.frontmatterDelimiter}
              variant="filled"
              label="required"
              size="small"
            ></TextField>
            <TextDialog
              initialValue={siteConfigBuffer.frontmatterDelimiter}
              isOpen={isFrontmatterDelimiterEditorOpen}
              onClose={() => setIsFrontmatterDelimiterEditorOpen(false)}
              onSave={editFrontmatterDelimiter}
              isValid={(value) => value !== ""}
              dialogTitle="Frontmatter Delimiter"
            />
          </Grid>
        </Grid>
      </Grid>
      <Divider sx={{ padding: "20px", color: "#999" }}>optional</Divider>
      <Grid container spacing={3}>
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
                          style={{ ...provided.draggableProps.style }}
                        >
                          <p className="dotdotdot" style={{ width: "20%" }}>
                            {matter.key}
                          </p>
                          <p
                            className="dotdotdot"
                            style={{
                              color: "#999",
                              width: "20%",
                              marginLeft: "5px",
                            }}
                          >
                            {FrontmatterTypeToName(matter.type)}
                          </p>
                          <p
                            className="dotdotdot"
                            style={{
                              color: "#999",
                              marginLeft: "5px",
                            }}
                          >
                            {String(matter.default)}
                          </p>
                          <div
                            style={{
                              position: "absolute",
                              right: "60px",
                              color: "#999",
                            }}
                            {...provided.dragHandleProps}
                          >
                            <DragHandleOutlinedIcon />
                          </div>
                          <MoreHorizIcon
                            sx={{ position: "absolute", right: "20px" }}
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

        {/* MediaDir TODO: prompt restart*/}
        <Grid item>
          <Typography variant="h6">Media</Typography>
        </Grid>

        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <Typography>Media Folder Path:</Typography>
          </Grid>
          <Grid item>
            <Typography sx={{ color: "#999" }}>
              {siteConfigBuffer.media.staticPath === ""
                ? "select media folder path"
                : siteConfigBuffer.media.staticPath}
            </Typography>
          </Grid>
          <Grid item>
            <Button onClick={editMediaStaticPath}>
              <DriveFolderUploadOutlinedIcon size="small" />
            </Button>
          </Grid>
        </Grid>
        <Grid item container spacing={1} alignItems="center">
          <Grid item>
            <Typography>Media Public Path:</Typography>
          </Grid>
          <Grid item>
            <TextField
              size="small"
              label="optional"
              variant="filled"
              value={siteConfigBuffer.media.publicPath}
              onChange={(e) => editMediaPublicPath(e.target.value)}
            />
          </Grid>
        </Grid>
        {/* -MediaDir */}

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
              delete site
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Site;
