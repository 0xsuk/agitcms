import { FrontmatterTypes } from "@/utils/frontmatterInterface";
import useSiteConfig, { FrontmatterLanguages } from "@/utils/useSiteConfig";
import useSiteConfigBuffer from "@/utils/useSiteConfigBuffer";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import DragHandleOutlinedIcon from "@mui/icons-material/DragHandleOutlined";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { IFrontmatterConfig, ISiteConfig } from "@shared/types/config";
import { randomid } from "@shared/utils/randomid";
import { Dispatch, SetStateAction, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import CustomSelect from "./CustomSelect";
import FolderPicker from "./FolderPicker";
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
}: {
  isFrontmatterDialogOpen: boolean;
  setIsFrontmatterDialogOpen: Dispatch<SetStateAction<boolean>>;
  saveFrontmatter: (
    newChildMetainfo: IFrontmatterConfig,
    parentKeys: string[]
  ) => void;
  removeFrontmatter: (key: string, parentKeys: string[]) => void;
  reorderFrontmatter: (result: any, parentKeys: string[]) => void;
  metainfoList: IFrontmatterConfig[];
  parentMetainfoKeys?: string[];
}) {
  const [FrontmatterAnchorEl, setFrontmatterAnchorEl] =
    useState<SVGSVGElement | null>(null);
  const [isChildFrontmatterDialogOpen, setIsChildFrontmatterDialogOpen] =
    useState(false);

  const droppableId = randomid();

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
                            open={(() => {
                              if (
                                FrontmatterAnchorEl?.parentNode &&
                                (FrontmatterAnchorEl.parentNode as any).dataset
                              ) {
                                return (
                                  (FrontmatterAnchorEl.parentNode as any)
                                    .dataset.key === metainfo.key
                                );
                              }
                              return false;
                            })()}
                            onClose={(e: any) => {
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

function SiteSettings() {
  const initialSiteConfig = useSiteConfig() as ISiteConfig;
  const {
    siteConfig,
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
  } = useSiteConfigBuffer(initialSiteConfig);

  const isDirty =
    JSON.stringify(initialSiteConfig) !== JSON.stringify(siteConfig);

  if (isDirty) {
    saveSiteConfig();
  }

  const [PinnedDirsAnchorEl, setPinnedDirsAnchorEl] =
    useState<SVGSVGElement | null>(null);
  const [isFrontmatterDialogOpen, setIsFrontmatterDialogOpen] = useState(false);
  const [
    isFrontmatterDelimiterEditorOpen,
    setIsFrontmatterDelimiterEditorOpen,
  ] = useState(false);
  const [isMediaStaticFolderDialogOpen, setIsMediaStaticFolderDialogOpen] =
    useState(false);

  return (
    <>
      <Dialog
        open={isMediaStaticFolderDialogOpen}
        onClose={() => setIsMediaStaticFolderDialogOpen(false)}
      >
        <DialogTitle>Select media static folder</DialogTitle>
        <DialogContent sx={{ width: "500px", height: "500px" }}>
          <FolderPicker
            onPickFolder={(folderPath) => {
              editMediaStaticPath(folderPath);
              setIsMediaStaticFolderDialogOpen(false);
            }}
            root={siteConfig.path}
          />
        </DialogContent>
      </Dialog>
      <div id="setting-site">
        <Typography variant="h5">Settings</Typography>
        <Divider sx={{ marginBottom: "20px" }} />
        <Grid container spacing={2}>
          <Grid item container spacing={1} alignItems="center">
            <Grid item>
              <Typography>Name:</Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ color: "#999" }}>{siteConfig.name}</Typography>
            </Grid>
          </Grid>
          <Grid item container spacing={1} alignItems="center">
            <Grid item>
              <Typography>Path:</Typography>
            </Grid>
            <Grid item>
              <Typography sx={{ color: "#999" }}>{siteConfig.path}</Typography>
            </Grid>
          </Grid>
          <Grid item container spacing={1} alignItems="center">
            <Grid item>Frontmatter Language:</Grid>
            <Grid item xs={4}>
              <CustomSelect
                isSelected={(item: string) =>
                  item === siteConfig.frontmatterLanguage
                }
                onChange={(newValue: string) => {
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
                    value={siteConfig.frontmatterLanguage}
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
                value={siteConfig.frontmatterDelimiter}
                variant="filled"
                label="required"
                size="small"
                onClick={() => setIsFrontmatterDelimiterEditorOpen(true)}
              ></TextField>
              <TextDialog
                initialValue={siteConfig.frontmatterDelimiter}
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
                metainfoList: siteConfig.frontmatter,
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
                  {siteConfig.media.staticPath === ""
                    ? "select media folder path"
                    : siteConfig.media.staticPath}
                </Typography>
              </Grid>
              <Grid item>
                <Button onClick={() => setIsMediaStaticFolderDialogOpen(true)}>
                  <DriveFolderUploadOutlinedIcon />
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
                  value={siteConfig.media.publicPath}
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
                      {siteConfig.pinnedDirs.map((df, i) => (
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
                                open={(() => {
                                  if (
                                    PinnedDirsAnchorEl?.parentNode &&
                                    (PinnedDirsAnchorEl.parentNode as any)
                                      .dataset
                                  ) {
                                    return (
                                      (PinnedDirsAnchorEl?.parentNode as any)
                                        .dataset.id === df.path
                                    );
                                  }
                                  return false;
                                })()}
                                onClose={(e: any) => {
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

          <Grid
            item
            container
            spacing={1}
            alignItems="center"
            justifyContent="center"
            sx={{ marginTop: "20px" }}
          >
            <Grid item>
              <Button onClick={() => removeSiteConfig(siteConfig.key)}>
                delete site
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
}

export default SiteSettings;
