import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import useFileManager from "../lib/useFileManager";
import useSiteConfig from "../lib/useSiteConfig";
import FrontmatterEditor from "./FrontmatterEditor";
import MarkdownEditor from "./MarkdownEditor";
import { configContext } from "../context/ConfigContext";

function EditorWrapper() {
  const location = useLocation();
  const searchparams = new URLSearchParams(location.search);

  //current working dir or filek
  const filePath = searchparams.get("path");
  const fileManager = useFileManager(filePath);
  const siteConfig = useSiteConfig();
  const { config } = useContext(configContext);

  const switchTab = (tab) => {
    const frontmatterEl = document.getElementById("editor-frontmatter-tab");
    const editorEl = document.getElementById("editor-markdown-tab");
    const frontmatterTabEl = document.querySelectorAll("#editor .tab")[0];
    const editorTabEl = document.querySelectorAll("#editor .tab")[1];
    const isFrontmatterVisible = frontmatterEl.style.display !== "none";

    const frontmatterOn = () => {
      editorEl.style.display = "none";
      //editorTabEl.style.backgroundColor = "#fff";
      frontmatterEl.style.display = "block";
      //frontmatterTabEl.style.backgroundColor = "#89b8e640";
    };

    const editorOn = () => {
      editorEl.style.display = "block";
      //editorTabEl.style.backgroundColor = "#89b8e640";
      frontmatterEl.style.display = "none";
      //frontmatterTabEl.style.backgroundColor = "#fff";
    };

    switch (tab) {
      case undefined:
        if (isFrontmatterVisible) {
          editorOn();
        } else {
          frontmatterOn();
        }
        break;
      case "editor":
        editorOn();
        break;
      case "frontmatter":
        frontmatterOn();
        break;
    }
  };

  const handleSave = () => {
    fileManager.saveFile().then((err) => {
      if (err) {
        alert(err);
        return;
      }
    });
    console.log("saved");
    fileManager.saveFile();
  };

  useEffect(() => {
    if (siteConfig.media.staticPath === "") return;
    window.electronAPI.startMediaServer(
      siteConfig.media.staticPath,
      siteConfig.media.publicPath
    );
  }, [siteConfig.media.staticPath, siteConfig.media.publicPath]);

  if (fileManager.file.isRead && config.autosave === "always") {
    handleSave();
  }

  return (
    <>
      <button onClick={() => switchTab()}>tab</button>
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
