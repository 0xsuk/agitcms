import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

//useCodeMirror depends on useFileBuffer's updateDoc
//filePath is a only dependency.
function useFileBuffer(filePath) {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const fileName = params.get("fileName");
  const [file, setFile] = useState({
    name: fileName,
    doc: "",
    frontmatter: {},
  });

  const editDoc = (doc) => {
    console.log("editing!,", doc);
    setFile((prev) => ({ ...prev, doc }));
  };
  const editName = (name) => {
    setFile((prev) => ({ ...prev, name }));
  };
  const editFrontmatter = (key, value, i) => {
    if (i !== undefined) {
      value = file.frontmatter[key].map((v, ii) => {
        if (ii === i) return value;
        return v;
      });
    }

    setFile((prev) => ({
      ...prev,
      frontmatter: { ...prev.frontmatter, [key]: value },
    }));
  };

  const readFile = async (editorView) => {
    const { err, doc, frontmatter } = await window.electronAPI.readFile(
      filePath
    );
    if (err) {
      alert(err.message);
      return;
    }
    console.log("reading file:", editorView);
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: doc,
      },
    });

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
    navigate(to);
  };

  const saveFile = async () => {
    console.log(file);
    const { err } = await window.electronAPI.saveFile(
      file.doc,
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

  return [file, { editDoc, editName, editFrontmatter, readFile, saveFile }];
}

export default useFileBuffer;
