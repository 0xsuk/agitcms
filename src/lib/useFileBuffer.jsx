import TOML from "@iarna/toml";
import matter from "gray-matter";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import useSiteConfig from "./useSiteConfig";

//because matter.stringify always put \n at the end of output if doc does not end with \n, this function removes it
const matterStringify = (doc, data, options) => {
  let out = matter.stringify(doc, data, options);
  if (doc[doc.length - 1] !== "\n") out = out.substring(0, out.length - 1);
  return out;
};

//useCodeMirror depends on useFileBuffer's updateDoc
//filePath is a only dependency.
function useFileBuffer(filePath) {
  const history = useHistory();
  const location = useLocation();
  const searchparams = new URLSearchParams(location.search);
  const fileName = searchparams.get("name");
  const [file, setFile] = useState({
    name: fileName,
    content: "", //include frontmatter
    frontmatter: {},
    doc: "", //exclude frontmatter
    isRead: false,
    isFrontmatterEmpty: false,
    isModified: false,
  });
  const siteConfig = useSiteConfig();

  const matterOption = {
    engines: {
      toml: {
        parse: TOML.parse,
        stringify: TOML.stringify,
      },
    },
    language: siteConfig.frontmatterLanguage,
    delimiters: siteConfig.frontmatterDelimiter,
  };

  console.log("USE FILE BUFFER:", file, matterOption);

  const editName = (name) => {
    setFile((prev) => ({ ...prev, name }));
  };
  const editFrontmatter = (key, value) => {
    file.frontmatter[key] = value;
    const content = matterStringify(file.doc, file.frontmatter);
    setFile((prev) => ({
      ...prev,
      content,
      frontmatter: file.frontmatter,
      isModified: true,
    }));
  };
  const editDoc = (tuieditor) => {
    //const d = tuieditor.getMarkdown();
    //const { content: doc, data: frontmatter } = matter(d, matterOption); //ISSUE: if d contains uncompleted frontmatter edit, doc&frontmatter becomes empty, thus content becomes empty
    //file.frontmatter = { ...file.frontmatter, ...frontmatter };
    const doc = tuieditor.getMarkdown();
    const content = matterStringify(doc, file.frontmatter);
    setFile((prev) => ({
      ...prev,
      doc,
      content,
      isModified: true,
    }));
  };
  const editContent = (tuieditor) => {
    const content = tuieditor.getMarkdown();
    const { content: doc, data: frontmatter } = matter(content, matterOption);
    setFile((prev) => ({
      ...prev,
      content,
      doc,
      frontmatter,
      isModified: true,
    }));
  };

  const readFile = async () => {
    const { content, err } = await window.electronAPI.readFile(filePath);
    if (err) {
      console.warn(err.message);
      return;
    }
    const { content: doc, data: frontmatter } = matter(content, matterOption);
    const isFrontmatterEmpty = Object.keys(frontmatter).length === 0;

    console.log("readFile", { content, frontmatter, isFrontmatterEmpty });
    setFile((prev) => ({
      ...prev,
      content,
      doc,
      frontmatter,
      isRead: true,
      isFrontmatterEmpty,
    }));

    return isFrontmatterEmpty;
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

  const saveFile = async () => {
    if (!file.isRead || !file.isModified) {
      return;
    }
    const { err } = await window.electronAPI.saveFile(filePath, file.content);
    if (err) {
      console.warn(err.message);
      return;
    }
    fileName !== file.name && renameFileAndNavigate();
    //console.log("saved", file);
    console.log("saved"); //somehow executed twice
  };

  return [
    file,
    { editName, editFrontmatter, editDoc, editContent, readFile, saveFile },
  ];
}

export default useFileBuffer;
