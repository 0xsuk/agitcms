import { useEffect } from "react";
import useFileManager from "../lib/useFileManager";
import useSiteConfig from "../lib/useSiteConfig";
import FrontmatterEditor from "./FrontmatterEditor";
import MarkdownEditor from "./MarkdownEditor";

function EditorWrapper({ filePath }) {
  const fileManager = useFileManager(filePath);
  const siteConfig = useSiteConfig();

  useEffect(() => {
    if (siteConfig.media.staticPath === "") return;
    window.electronAPI.startMediaServer(
      siteConfig.media.staticPath,
      siteConfig.media.publicPath
    );
  }, [siteConfig.media.staticPath, siteConfig.media.publicPath]);

  return (
    <div style={{ height: "100%" }}>
      <button onClick={fileManager.saveFile()}>save</button>
      <MarkdownEditor fileManager={fileManager} siteConfig={siteConfig} />
      <FrontmatterEditor fileManager={fileManager} siteConfig={siteConfig} />
    </div>
  );
}

export default EditorWrapper;
