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
    const markdownEl = document.getElementById("editor-markdown-tab");
    const markdownTabEl = document.querySelectorAll(
      "#editor-navigator > .tab"
    )[0];
    const frontmatterTabEl = document.querySelectorAll(
      "#editor-navigator .tab"
    )[1];
    const isFrontmatterVisible = frontmatterEl.style.display !== "none";

    const frontmatterOn = () => {
      markdownEl.style.display = "none";
      markdownTabEl.style.borderBottom = "none";
      frontmatterEl.style.display = "block";
      frontmatterTabEl.style.borderBottom = "solid 1px red";
    };

    const markdownOn = () => {
      markdownEl.style.display = "block";
      markdownTabEl.style.borderBottom = "solid 1px red";
      frontmatterEl.style.display = "none";
      frontmatterTabEl.style.borderBottom = "none";
    };

    switch (tab) {
      case undefined:
        if (isFrontmatterVisible) {
          markdownOn();
        } else {
          frontmatterOn();
        }
        break;
      case "markdown":
        markdownOn();
        break;
      case "frontmatter":
        frontmatterOn();
        break;
    }
  };

  const copyMediaFilePath = async () => {
    if (siteConfig.media.staticPath === "") {
      alert("please set media folder path");
      return;
    }
    const { err, filePath, canceled } = await window.electronAPI.getMediaFile(
      siteConfig.media.staticPath,
      siteConfig.media.publicPath
    );
    if (canceled) return;
    if (err !== null) {
      alert(err);
      return;
    }

    const buf = document.createElement("input");
    document.body.appendChild(buf);
    buf.value = filePath;
    buf.select();
    document.execCommand("copy");
    document.body.removeChild(buf);
  };

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
      <div id="editor-navigator">
        <div className="tab" onClick={() => switchTab("markdown")}>
          Markdown
        </div>
        <div className="tab" onClick={() => switchTab("frontmatter")}>
          Frontmatter
        </div>
        <div className="tab" onClick={copyMediaFilePath}>
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
