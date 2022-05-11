import { useState } from "react";
import { useHistory } from "react-router-dom";

//useCodeMirror depends on useFileBuffer's updateDoc
//filePath is a only dependency.
function useFileBuffer(filePath) {
  const params = null;
  const history = useHistory();
  const fileName = params.get("name");
  const [file, setFile] = useState({
    name: fileName,
    frontmatter: {},
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
    console.log("frontmatter:", frontmatter);
    setFile((prev) => ({ ...prev, frontmatter }));
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
    history.push(to);
  };

  const saveFile = async (tuieditor) => {
    const { err } = await window.electronAPI.saveFile(
      tuieditor.getInstance().getMarkdown(),
      file.frontmatter,
      filePath
    );
    if (err) {
      alert(err.message);
      return;
    }
    alert("Saved!");
    fileName !== file.name && renameFileAndNavigate();
  };

  return [file, { editName, editFrontmatter, readFile, saveFile }];
}

export default useFileBuffer;
