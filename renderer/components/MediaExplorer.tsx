import { siteContext } from "@/context/SiteContext";
import { mediaExtensions } from "@/utils/constants";
import { copyString } from "@/utils/copyMediaFilePath";
import { socketClient } from "@/utils/socketClient";
import useSiteConfig from "@/utils/useSiteConfig";
import { warnError } from "@/utils/warnError";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import { Button, Tooltip } from "@mui/material";
import { IFilesAndFolders } from "@shared/types/api";
import { ISiteConfig } from "@shared/types/config";
import * as path from "path";
import { useContext, useEffect, useState } from "react";
import FolderNavigator from "./FolderNavigator";

function MediaExplorer() {
  const port = useContext(siteContext).state.media.port as number;
  const siteConfig = useSiteConfig() as ISiteConfig;
  const [cwd, setCwd] = useState(siteConfig.media.staticPath);
  const [mediasAndFolders, setMediasAndFolders] = useState<IFilesAndFolders>(
    []
  );

  useEffect(() => {
    if (!cwd) return;
    socketClient.getFilesAndFolders(cwd).then(({ filesAndFolders, err }) => {
      if (err !== null) {
        warnError(err);
        return;
      }

      const mediasAndFolders = filesAndFolders.filter(
        (df) =>
          df.isDir ||
          mediaExtensions.includes(df.extension.split("").slice(1).join(""))
      );

      setMediasAndFolders(mediasAndFolders);
    });
  }, [cwd]);

  if (!cwd || !siteConfig.media.staticPath || !siteConfig.media.publicPath) {
    return (
      <>Set media folder path and media public path to display media contents</>
    );
  }

  return (
    <>
      <FolderNavigator
        cwdf={cwd}
        root={siteConfig.media.staticPath}
        onClickNewPath={(folderPath) => setCwd(folderPath)}
      />
      <div className="container">
        {mediasAndFolders.map((dm) => {
          if (dm.isDir) {
            return (
              <div
                className="item hpointer"
                onClick={() => setCwd(path.join(cwd, dm.name))}
              >
                <FolderOpenOutlinedIcon fontSize="inherit" />
                <div className="desc">
                  <p className="line-clamp3">{dm.name}</p>
                </div>
              </div>
            );
          } else {
            const imagePath = path.join(cwd, dm.name);
            const imageRelativePath = path.relative(
              siteConfig.media.staticPath as string,
              imagePath
            );
            const imagePublicPath = encodeURI(
              path.join(
                "/",
                siteConfig.media.publicPath as string,
                imageRelativePath
              )
            );
            return (
              <div className="item">
                <img src={"http://localhost:" + port + imagePublicPath} />
                <div className="desc">
                  <Tooltip title={dm.name} placement="top" arrow>
                    <p className="line-clamp2">{dm.name}</p>
                  </Tooltip>
                  <p className="copy hpointer">
                    <Button onClick={() => copyString(imagePublicPath)}>
                      COPY
                    </Button>
                  </p>
                </div>
              </div>
            );
          }
        })}
      </div>
    </>
  );
}

export default MediaExplorer;
