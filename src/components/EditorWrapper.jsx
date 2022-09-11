import { useContext } from "react";
import { useLocation } from "react-router-dom";
import { configContext } from "../context/ConfigContext";
import { copyMediaFilePath } from "../lib/copyMediaFilePath";
import { switchTab } from "../lib/switchEditorTab";
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
  const { config } = useContext(configContext);

  if (fileManager.file.path !== filePath) {
    //wait until fileManager updates
    return <></>;
  }

  if (!fileManager.file.isRead) {
    fileManager.readFile().then((err) => {
      if (err) {
        alert(err);
      }
    });
    return <></>;
  }

  if (fileManager.file.isRead && config.autosave === "always") {
    fileManager.saveFile().then((err) => {
      if (err) {
        alert(err);
        return;
      }
    });
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
