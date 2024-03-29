import { configContext } from "@/context/ConfigContext";
import { switchTab } from "@/utils/switchEditorTab";
import useFileManager from "@/utils/useFileManager";
import useSiteConfig from "@/utils/useSiteConfig";
import { ISiteConfig } from "@shared/types/config";
import { useContext } from "react";
import { useLocation } from "react-router-dom";
import FrontmatterEditor from "./FrontmatterEditor";
import MarkdownEditor from "./MarkdownEditor";
import MediaExplorer from "./MediaExplorer";

function EditorWrapper() {
  const location = useLocation();
  const searchparams = new URLSearchParams(location.search);

  //current working dir or filek
  const filePath = searchparams.get("path") as string;
  const fileManager = useFileManager(filePath);
  const siteConfig = useSiteConfig() as ISiteConfig;
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
    fileManager.saveFile().then((err) => err && alert(err));
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
        <div className="tab" onClick={() => switchTab("media")}>
          Media
        </div>
      </div>
      <div id="editor-wrapper">
        <div id="editor-markdown-tab">
          <MarkdownEditor fileManager={fileManager} />
        </div>
        <div id="editor-frontmatter-tab">
          <FrontmatterEditor
            fileManager={fileManager}
            siteConfig={siteConfig}
          />
        </div>
        <div id="editor-media-tab">
          <MediaExplorer />
        </div>
      </div>
    </>
  );
}

export default EditorWrapper;
