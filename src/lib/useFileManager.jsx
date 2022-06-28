import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { genContent, parseContent } from "./frontmatterInterface";
import useSiteConfig from "./useSiteConfig";
import { updateFrontmatterJson } from "./frontmatterInterface";

//useCodeMirror depends on useFileBuffer's updateDoc
//filePath is a only dependency.
function useFileManager(filePath) {
  const history = useHistory();
  const location = useLocation();
  const searchparams = new URLSearchParams(location.search);
  const fileName = searchparams.get("name");
  const [file, setFile] = useState({
    name: fileName,
    path: filePath,
    content: "", //include frontmatter
    frontmatter: {},
    doc: "", //exclude frontmatter
    isRead: false,
    isModified: false,
    isFrontmatterEmpty: true,
  });
  const siteConfig = useSiteConfig();

  const editName = (name) => {
    setFile((prev) => ({ ...prev, name }));
  };
  const updateFrontmatter = (name, value, parentNames) => {
    const newFrontmatter = updateFrontmatterJson(
      file.frontmatter,
      value,
      name,
      parentNames
    );
    const content = genContent(siteConfig, file.doc, newFrontmatter);

    setFile((prev) => ({
      ...prev,
      content,
      frontmatter: newFrontmatter,
      isModified: true,
    }));
  };
  const setDoc = (doc) => {
    const content = genContent(siteConfig, doc, file.frontmatter);
    setFile((prev) => ({
      ...prev,
      content,
      doc,
      isModified: true,
    }));
  };

  const readFile = async () => {
    const { content, err } = await window.electronAPI.readFile(filePath);
    if (err) {
      return { err };
    }
    const { doc, frontmatter } = parseContent(siteConfig, content);
    const isFrontmatterEmpty = Object.keys(frontmatter).length === 0;
    setFile((prev) => ({
      ...prev,
      content,
      doc,
      frontmatter,
      isRead: true,
      isModified: false,
      isFrontmatterEmpty,
    }));

    return { content, doc, frontmatter, err };
  };

  const saveFile = async () => {
    if (!file.isRead || !file.isModified) {
      return;
    }
    const { err } = await window.electronAPI.saveFile(filePath, file.content);
    if (!err) console.log("saved", file);
    return err;
  };

  const renameFileAndNavigate = async () => {
    const { newFilePath, err } = await window.electronAPI.renameFile(
      filePath,
      file.name
    );
    if (err) {
      console.warn(err.message);
      return;
    }
    const to = "?path=" + newFilePath + "&isDir=false&fileName=" + file.name;
    history.replace(to);
  };

  return {
    file,
    editName,
    updateFrontmatter,
    setDoc,
    readFile,
    saveFile,
  };
}

export default useFileManager;
