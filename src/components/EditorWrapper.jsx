import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import useFileManager from "../lib/useFileManager";
import useSiteConfig from "../lib/useSiteConfig";
import FrontmatterEditor from "./FrontmatterEditor";
import MarkdownEditor from "./MarkdownEditor";
import { configContext } from "../context/ConfigContext";
import { switchTab } from "../lib/switchEditorTab";
import { copyMediaFilePath } from "../lib/copyMediaFilePath";
import { editorSetup } from "../lib/editorSetup";
import { stateContext } from "../context/StateContext";

function EditorWrapper() {
  const location = useLocation();
  const searchparams = new URLSearchParams(location.search);

  //current working dir or filek
  const filePath = searchparams.get("path");
  const fileManager = useFileManager(filePath);
  const siteConfig = useSiteConfig();
  const { config } = useContext(configContext);
  const { setMediaPort } = useContext(stateContext);

  const handleSave = () => {
    fileManager.saveFile().then((err) => {
      if (err) {
        alert(err);
        return;
      }
    });
  };

  useEffect(() => {
    if (siteConfig.media.staticPath === "") return;
    editorSetup({
      setMediaPort,
      mediaStaticPath: siteConfig.media.staticPath,
      mediaPublicPath: siteConfig.media.publicPath,
    });
  }, [siteConfig.media.staticPath, siteConfig.media.publicPath]);

  if (fileManager.file.isRead && config.autosave === "always") {
    handleSave();
  }

  return (
    <>
      <div id="editor-navigator">
        <div className="tab" onClick={() => switchTab("markdown")}>
          Markdown
        </div>
        <div className="tab" onClick={() => switchTab("frontmatter")}>
          Frontmatter
        </div>
        <div className="tab" onClick={() => copyMediaFilePath(siteConfig)}>
          Media
        </div>
      </div>
      <div id="editor-wrapper">
        <div id="editor-markdown-tab">
          <MarkdownEditor fileManager={fileManager} siteConfig={siteConfig} />
        </div>
        <div id="editor-frontmatter-tab">
          <FrontmatterEditor
            fileManager={fileManager}
            siteConfig={siteConfig}
          />
        </div>
      </div>
    </>
  );
}

export default EditorWrapper;
