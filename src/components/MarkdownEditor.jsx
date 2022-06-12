import { createElement, Fragment, useRef } from "react";
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
  const mouseIsOn = useRef(null);

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

  const computeElemsOffsetTop = () => {
    let editorElemOffsetTopList = [];
    let previewElemsOffsetTopList = [];

    treeData.children.forEach((child, index) => {
      if (child.type !== "element" || child.position === undefined) return;

      const pos = child.position.start.offset;
      const lineInfo = editorView.lineBlockAt(pos);
      const offsetTop = lineInfo.top;
      editorElemOffsetTopList.push(offsetTop);
      previewElemsOffsetTopList.push(
        editor_preview.childNodes[index].offsetTop -
          editor_preview.getBoundingClientRect().top //offsetTop from the top of editor_preview
      );
    });

    return [editorElemOffsetTopList, previewElemsOffsetTopList];
  };
  const handleMdScroll = () => {
    console.log(mouseIsOn.current);
    if (mouseIsOn.current !== "markdown") {
      return;
    }
    const [editorElemOffsetTopList, previewElemsOffsetTopList] =
      computeElemsOffsetTop();
    let scrollElemIndex;
    for (let i = 0; editorElemOffsetTopList.length > i; i++) {
      if (editor_markdown.scrollTop < editorElemOffsetTopList[i]) {
        scrollElemIndex = i - 1;
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

    if (scrollElemIndex >= 0) {
      let ratio =
        (editor_markdown.scrollTop - editorElemOffsetTopList[scrollElemIndex]) /
        (editorElemOffsetTopList[scrollElemIndex + 1] -
          editorElemOffsetTopList[scrollElemIndex]);
      editor_preview.scrollTop =
        ratio *
          (previewElemsOffsetTopList[scrollElemIndex + 1] -
            previewElemsOffsetTopList[scrollElemIndex]) +
        previewElemsOffsetTopList[scrollElemIndex];
    }
  };

  const handlePreviewScroll = () => {
    if (mouseIsOn.current !== "preview") {
      return;
    }
    const [editorElemOffsetTopList, previewElemsOffsetTopList] =
      computeElemsOffsetTop();
    let scrollElemIndex;
    for (let i = 0; previewElemsOffsetTopList.length > i; i++) {
      if (editor_preview.scrollTop < previewElemsOffsetTopList[i]) {
        scrollElemIndex = i - 1;
        break;
      }
    }

    if (scrollElemIndex >= 0) {
      let ratio =
        (editor_preview.scrollTop -
          previewElemsOffsetTopList[scrollElemIndex]) /
        (previewElemsOffsetTopList[scrollElemIndex + 1] -
          previewElemsOffsetTopList[scrollElemIndex]);
      editor_markdown.scrollTop =
        ratio *
          (editorElemOffsetTopList[scrollElemIndex + 1] -
            editorElemOffsetTopList[scrollElemIndex]) +
        editorElemOffsetTopList[scrollElemIndex];
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
      <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
        <div
          id="editor-markdown"
          ref={editorRef}
          onScroll={handleMdScroll}
          onMouseEnter={() => (mouseIsOn.current = "markdown")}
        ></div>
        <div
          id="editor-preview"
          className="markdown-body"
          onScroll={handlePreviewScroll}
          onMouseEnter={() => (mouseIsOn.current = "preview")}
        >
          {md}
        </div>
      </div>
    </>
  );
}

export default MarkdownEditor;
