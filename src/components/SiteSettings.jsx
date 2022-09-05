import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DragHandleOutlinedIcon from "@mui/icons-material/DragHandleOutlined";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Button,
  Divider,
  Grid,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import { FrontmatterTypes } from "../lib/frontmatterInterface";
import useSiteConfig, { FrontmatterLanguages } from "../lib/useSiteConfig";
import useSiteConfigBuffer from "../lib/useSiteConfigBuffer";
import CustomSelect from "./CustomSelect";
import FrontmatterDialog from "./FrontmatterDialog";
import TextDialog from "./TextDialog";

function FrontmatterList({
  isFrontmatterDialogOpen,
  setIsFrontmatterDialogOpen,
  saveFrontmatter,
  removeFrontmatter,
  reorderFrontmatter,
  metainfoList,
  parentMetainfoKeys = [],
}) {
  const [FrontmatterAnchorEl, setFrontmatterAnchorEl] = useState(null);
  const [isChildFrontmatterDialogOpen, setIsChildFrontmatterDialogOpen] =
    useState(false);

  const droppableId = uuid();

  return (
    <>
      <FrontmatterDialog
        open={isFrontmatterDialogOpen}
        onClose={() => setIsFrontmatterDialogOpen(false)}
        saveFrontmatter={(newChildMetainfo) =>
          saveFrontmatter(newChildMetainfo, parentMetainfoKeys)
        }
      />
      <Grid item sx={{ width: "100%" }}>
        <DragDropContext
          onDragEnd={(result) => reorderFrontmatter(result, parentMetainfoKeys)}
        >
          <Droppable droppableId={droppableId}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {metainfoList?.map((metainfo, i) => (
                  <Draggable draggableId={droppableId + i} index={i}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        style={{ ...provided.draggableProps.style }}
                      >
                        <div
                          className="setting-draggable"
                          data-key={metainfo.key} //used by Menu
                        >
                          <p className="dotdotdot" style={{ width: "20%" }}>
                            {metainfo.name}
                          </p>
                          <p
                            className="dotdotdot"
                            style={{
                              color: "#999",
                              width: "20%",
                              marginLeft: "5px",
                            }}
                          >
                            {metainfo.type}
                          </p>
                          <p
                            className="dotdotdot"
                            style={{
                              color: "#999",
                              marginLeft: "5px",
                            }}
                          >
                            {metainfo.type !== FrontmatterTypes.Nest &&
                              String(metainfo.default)}
                          </p>
                          {metainfo.type === FrontmatterTypes.Nest && (
                            <Tooltip title="add child frontmatter">
                              <AddCircleOutlinedIcon
                                onClick={() =>
                                  setIsChildFrontmatterDialogOpen(true)
                                }
                                fontSize="small"
                                sx={{
                                  color: "inherit",
                                  cursor: "pointer",
                                  position: "absolute",
                                  right: "100px",
                                }}
                              />
                            </Tooltip>
                          )}
                          <div
                            style={{
                              position: "absolute",
                              right: "60px",
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
                              FrontmatterAnchorEl?.parentNode.dataset.key ===
                              metainfo.key
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
                              onClick={() =>
                                removeFrontmatter(
                                  metainfo.key,
                                  parentMetainfoKeys
                                )
                              }
                            >
                              delete
                            </MenuItem>
                          </Menu>
                        </div>
                        {metainfo.type === FrontmatterTypes.Nest && (
                          <div style={{ paddingLeft: "15px" }}>
                            <FrontmatterList
                              isFrontmatterDialogOpen={
                                isChildFrontmatterDialogOpen
                              }
                              setIsFrontmatterDialogOpen={
                                setIsChildFrontmatterDialogOpen
                              }
                              metainfoList={metainfo.default}
                              parentMetainfoKeys={[
                                ...parentMetainfoKeys,
                                metainfo.key,
                              ]}
                              saveFrontmatter={saveFrontmatter}
                              removeFrontmatter={removeFrontmatter}
                              reorderFrontmatter={reorderFrontmatter}
                            />
                          </div>
                        )}
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
    </>
  );
}

function Site() {
  const siteConfig = useSiteConfig();
  const {
    siteConfig: siteConfigBuffer,
    editMediaPublicPath,
    editMediaStaticPath,
    editFrontmatterLanguage,
    editFrontmatterDelimiter,
    saveFrontmatter,
    removeFrontmatter,
    reorderFrontmatter,
    removePinnedDir,
    reorderPinnedDirs,
    saveSiteConfig,
    removeSiteConfig,
  } = useSiteConfigBuffer(siteConfig);

  const isDirty =
    JSON.stringify(siteConfig) !== JSON.stringify(siteConfigBuffer);

  console.log({ isDirty, siteConfig, siteConfigBuffer });

  if (isDirty) {
    saveSiteConfig();
  }

  const [PinnedDirsAnchorEl, setPinnedDirsAnchorEl] = useState(null);
  const [isFrontmatterDialogOpen, setIsFrontmatterDialogOpen] = useState(false);
  const [
    isFrontmatterDelimiterEditorOpen,
    setIsFrontmatterDelimiterEditorOpen,
  ] = useState(false);

  return (
    <div id="setting-site">
      <Typography variant="h5">Settings</Typography>
      <Divider sx={{ marginBottom: "20px" }} />
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
                    //endAdornment: (
                    //  <Button onClick={() => setIsOpen(true)} ref={ref}>
                    //    <ArrowDropDown />
                    //  </Button>
                    //),
                  }}
                  onClick={() => setIsOpen(true)}
                  ref={ref}
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
                //endAdornment: (
                //  <Button
                //    onClick={() => setIsFrontmatterDelimiterEditorOpen(true)}
                //  >
                //    EDIT
                //  </Button>
                //),
              }}
              sx={{ color: "#999" }}
              value={siteConfigBuffer.frontmatterDelimiter}
              variant="filled"
              label="required"
              size="small"
              onClick={() => setIsFrontmatterDelimiterEditorOpen(true)}
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
      <Grid container spacing={6}>
        {/* Frontmatter */}
        <Grid item container spacing={1}>
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

          <FrontmatterList
            {...{
              isFrontmatterDialogOpen,
              setIsFrontmatterDialogOpen,
              saveFrontmatter,
              removeFrontmatter,
              reorderFrontmatter,
              metainfoList: siteConfigBuffer.frontmatter,
            }}
          />
        </Grid>

        {/* MediaDir TODO: prompt restart*/}
        <Grid item container spacing={1}>
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
        </Grid>
        {/* -MediaDir */}

        <Grid item container spacing={1} direction="column">
          <Grid item>
            <Typography variant="h6">Pinned Folders or Files</Typography>
          </Grid>
          <Grid
            item
            sx={{
              width: "100%", //important
            }}
          >
            <DragDropContext onDragEnd={reorderPinnedDirs}>
              <Droppable droppableId="pinnedDirs">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {siteConfigBuffer.pinnedDirs.map((df, i) => (
                      <Draggable
                        //key={matter.key}
                        draggableId={"pinnedDirs" + i}
                        index={i}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            style={{ ...provided.draggableProps.style }}
                            ref={provided.innerRef}
                            className="setting-draggable"
                            data-id={df.path}
                          >
                            {df.isDir ? (
                              <FolderOpenOutlinedIcon fontSize="small" />
                            ) : (
                              <DescriptionOutlinedIcon fontSize="small" />
                            )}
                            <p
                              className="dotdotdot"
                              style={{
                                paddingLeft: "5px",
                                width: "calc(100% - 100px)",
                              }}
                            >
                              {df.name}
                            </p>
                            <div
                              {...provided.dragHandleProps}
                              style={{ position: "absolute", right: "60px" }}
                            >
                              <DragHandleOutlinedIcon />
                            </div>
                            <MoreHorizIcon
                              sx={{ position: "absolute", right: "20px" }}
                              onClick={(e) => {
                                setPinnedDirsAnchorEl(e.currentTarget);
                                e.stopPropagation();
                              }}
                            />
                            <Menu
                              anchorEl={PinnedDirsAnchorEl}
                              open={
                                PinnedDirsAnchorEl?.parentNode.dataset.id ===
                                df.path
                              }
                              onClose={(e) => {
                                setPinnedDirsAnchorEl(null);
                                e.stopPropagation();
                              }}
                              //on Click menuitems
                              onClick={(e) => {
                                setPinnedDirsAnchorEl(null);
                                e.stopPropagation();
                              }}
                            >
                              <MenuItem
                                onClick={() =>
                                  removePinnedDir(df.path, df.isDir)
                                }
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
        </Grid>
        {/* pinned dirs */}

        <Grid item container spacing={1}>
          <Grid item container spacing={1} alignItems="center">
            <Grid item>
              <Typography variant="h6">Editor plugins</Typography>
            </Grid>
            <Grid item></Grid>
          </Grid>
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
              delete site
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Site;
