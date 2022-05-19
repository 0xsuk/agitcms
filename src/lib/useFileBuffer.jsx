import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

//useCodeMirror depends on useFileBuffer's updateDoc
//filePath is a only dependency.
function useFileBuffer(filePath) {
  const history = useHistory();
  const location = useLocation();
  const searchparams = new URLSearchParams(location.search);
  const fileName = searchparams.get("name");
  const [file, setFile] = useState({
    name: fileName,
    frontmatter: {},
    isRead: false,
  });

  const editName = (name) => {
    setFile((prev) => ({ ...prev, name }));
  };
  const editFrontmatter = (key, value) => {
    setFile((prev) => ({
      ...prev,
      frontmatter: { ...prev.frontmatter, [key]: value },
    }));
  };

  const readFile = async (tuieditor) => {
    const { err, doc, frontmatter } = await window.electronAPI.readFile(
      filePath
    );
    if (err) {
      alert(err.message);
      return;
    }
    //TODO: issues ctrl-z
    tuieditor.getInstance().setMarkdown(doc);
    setFile((prev) => ({ ...prev, frontmatter, isRead: true }));
    const isFrontmatterEmpty = JSON.stringify(frontmatter) === "{}";
    return isFrontmatterEmpty;
  };

  const renameFileAndNavigate = async () => {
    const { newFilePath, err } = await window.electronAPI.renameFile(
      filePath,
      file.name
    );
    if (err) {
      alert(err.message);
      return;
    }
    const to = "?path=" + newFilePath + "&isDir=false&fileName=" + file.name;
    history.replace(to);
  };

  const saveFile = async (tuieditor) => {
    if (!file.isRead) {
      return;
    }
    const { err } = await window.electronAPI.saveFile(
      tuieditor.getInstance().getMarkdown(),
      file.frontmatter,
      filePath
    );
    if (err) {
      alert(err.message);
      return;
    }
    console.log("saved");
    fileName !== file.name && renameFileAndNavigate();
  };

  return [file, { editName, editFrontmatter, readFile, saveFile }];
}

export default useFileBuffer;
