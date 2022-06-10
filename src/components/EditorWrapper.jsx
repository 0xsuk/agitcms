import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useFileManager from "../lib/useFileManager";
import useSiteConfig from "../lib/useSiteConfig";
import FrontmatterEditor from "./FrontmatterEditor";
import MarkdownEditor from "./MarkdownEditor";

function EditorWrapper() {
  const location = useLocation();
  const searchparams = new URLSearchParams(location.search);

  //current working dir or filek
  const filePath = searchparams.get("path");
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
    <div id="editor-wrapper">
      <button onClick={() => fileManager.saveFile()}>save</button>
      <MarkdownEditor fileManager={fileManager} siteConfig={siteConfig} />
      <FrontmatterEditor fileManager={fileManager} siteConfig={siteConfig} />
    </div>
  );
}

export default EditorWrapper;
