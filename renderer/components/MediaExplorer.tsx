import { siteContext } from "@/context/SiteContext";
import { mediaExtensions } from "@/utils/constants";
import { socketClient } from "@/utils/socketClient";
import useSiteConfig from "@/utils/useSiteConfig";
import { warnError } from "@/utils/warnError";
import { IFilesAndFolders } from "@shared/types/api";
import { ISiteConfig } from "@shared/types/config";
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
      <div>
        {mediasAndFolders.map((dm) => {
          if (dm.isDir) {
            return <p>{dm.name}</p>;
          } else {
            return (
              <img
                style={{ width: "50px", height: "50px" }}
                src={
                  "http://localhost:" +
                  port +
                  "/" +
                  siteConfig.media.publicPath +
                  "/" +
                  dm.name
                }
              />
            );
          }
        })}
      </div>
    </>
  );
}

export default MediaExplorer;
