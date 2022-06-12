import { createElement, Fragment } from "react";
import useCodemirror from "../lib/useCodemirror";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeReact from "rehype-react";
import remarkMath from "remark-math";
import rehypeMathJax from "rehype-mathjax";
import "github-markdown-css/github-markdown.css";
let treeData;

const isURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

function MarkdownEditor({ fileManager, siteConfig }) {
  const [editorRef, editorView] = useCodemirror(fileManager);

  const defaultPlugin = () => (tree) => {
    treeData = tree; //treeData length corresponds to editor-previewer's childNodes length
    tree.children = tree.children.map((child) => {
      if (
        child.type !== "element" ||
        child.tagName !== "p" ||
        child.children === undefined
      )
        return child;

      child.children = child.children.map((c) => {
        if (c.type !== "element" || c.tagName !== "img") return c;
        if (isURL(c.properties.src)) return c;
        c.properties.src = new URL(
          c.properties.src,
          "http://localhost:3001"
        ).href; //TODO
        return c;
      });
      return child;
    });
    return tree;
  };
  const editor_markdown = document.querySelector("#editor-markdown");
  const editor_preview = document.getElementById("editor-preview");

  const action = () => {
    console.log(editorView.lineBlockAt(1));
  };

  const handleScroll = () => {
    let editorElemRelativeTopList = [];
    let previewElemsAbsTopList = [];
    treeData.children.forEach((child, index) => {
      if (child.type !== "element" || child.position === undefined) return;

      const pos = child.position.start.offset;
      const lineInfo = editorView.lineBlockAt(pos);
      const offsetTop = lineInfo.top;
      editorElemRelativeTopList.push(offsetTop);
      previewElemsAbsTopList.push(
        editor_preview.childNodes[index].offsetTop //absolute from window top
      );
    });
    let scrollElementIndex;
    for (let i = 0; editorElemRelativeTopList.length > i; i++) {
      if (editor_markdown.scrollTop < editorElemRelativeTopList[i]) {
        scrollElementIndex = i - 1;
        break;
      }
    }

    if (
      editor_markdown.scrollTop >=
      editor_markdown.scrollHeight - editor_markdown.clientHeight //true when scroll reached the bottom
    ) {
      editor_preview.scrollTop =
        editor_preview.scrollHeight - editor_preview.clientHeight; //? scroll to the bottom
      return;
    }

    if (scrollElementIndex >= 0) {
      let ratio =
        (editor_markdown.scrollTop -
          editorElemRelativeTopList[scrollElementIndex]) /
        (editorElemRelativeTopList[scrollElementIndex + 1] -
          editorElemRelativeTopList[scrollElementIndex]);
      editor_preview.scrollTop =
        ratio *
          (previewElemsAbsTopList[scrollElementIndex + 1] -
            previewElemsAbsTopList[scrollElementIndex]) +
        previewElemsAbsTopList[scrollElementIndex] -
        editor_preview.getBoundingClientRect().top;
    }
  };

  const md = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeMathJax)
    .use(defaultPlugin)
    .use(rehypeReact, { createElement, Fragment })
    .processSync(fileManager.file.doc).result;

  return (
    <>
      <button onClick={action}>Action</button>
      <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
        <div id="editor-markdown" ref={editorRef} onScroll={handleScroll}></div>
        <div id="editor-preview" className="markdown-body">
          {md}
        </div>
      </div>
    </>
  );
}

export default MarkdownEditor;
