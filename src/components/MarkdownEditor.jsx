import { createElement, Fragment, useContext, useMemo, useRef } from "react";
import rehypeMathJaxSvg from "rehype-mathjax";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { siteContext } from "../context/SiteContext";
import { isMac, isURL } from "../lib/constants";
import useCodemirror from "../lib/useCodemirror";
import MarkdownToolbar from "./MarkdownToolbar";

let treeData;
const captureTreePlugin = () => (tree) => {
  treeData = tree; //treeData length corresponds to editor-previewer's childNodes length
};
const mediaPlugin = (port) => () => (tree) => {
  if (port === undefined) return;
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
        "http://localhost:" + port
      ).href;
      return c;
    });
    return child;
  });
  return tree;
};
const computeElemsOffsetTop = (editorView) => {
  const previewElem = document.getElementById("editor-preview");
  const markdownChildNodesOffsetTopList = [];
  const previewChildNodesOffsetTopList = [];

  treeData.children.forEach((child, index) => {
    if (child.type !== "element" || child.position === undefined) return;

    const pos = child.position.start.offset;
    const lineInfo = editorView.lineBlockAt(pos);
    const offsetTop = lineInfo.top;
    markdownChildNodesOffsetTopList.push(offsetTop);
    previewChildNodesOffsetTopList.push(
      previewElem.childNodes[index].offsetTop + //bottom of windowbar to the top of childnode, immutable to scroll
        (isMac ? 22 : 30) - //Window titlebar height
        previewElem.getBoundingClientRect().top - //top of window to the top of editor-preview
        10 //padding top of previewElem TODO
    );
  });

  return [markdownChildNodesOffsetTopList, previewChildNodesOffsetTopList];
};
const handleMdScroll = (mouseIsOn, editorView) => {
  const markdownElem = document.getElementById("editor-markdown");
  const previewElem = document.getElementById("editor-preview");
  if (mouseIsOn.current !== "markdown") {
    return;
  }
  const [markdownChildNodesOffsetTopList, previewChildNodesOffsetTopList] =
    computeElemsOffsetTop(editorView);

  let scrollElemIndex;
  for (let i = 0; markdownChildNodesOffsetTopList.length > i; i++) {
    if (markdownElem.scrollTop < markdownChildNodesOffsetTopList[i]) {
      scrollElemIndex = i - 1;
      break;
    }
  }

  if (
    markdownElem.scrollTop >=
    markdownElem.scrollHeight - markdownElem.clientHeight //true when scroll reached the bottom
  ) {
    previewElem.scrollTop = previewElem.scrollHeight - previewElem.clientHeight; //? scroll to the bottom
    return;
  }

  if (scrollElemIndex >= 0) {
    let ratio =
      (markdownElem.scrollTop -
        markdownChildNodesOffsetTopList[scrollElemIndex]) /
      (markdownChildNodesOffsetTopList[scrollElemIndex + 1] -
        markdownChildNodesOffsetTopList[scrollElemIndex]);
    previewElem.scrollTop =
      ratio *
        (previewChildNodesOffsetTopList[scrollElemIndex + 1] -
          previewChildNodesOffsetTopList[scrollElemIndex]) +
      previewChildNodesOffsetTopList[scrollElemIndex];
  }
};

const handlePreviewScroll = (mouseIsOn, editorView) => {
  const markdownElem = document.getElementById("editor-markdown");
  const previewElem = document.getElementById("editor-preview");
  if (mouseIsOn.current !== "preview") {
    return;
  }
  const [markdownChildNodesOffsetTopList, previewChildNodesOffsetTopList] =
    computeElemsOffsetTop(editorView);
  let scrollElemIndex;
  for (let i = 0; previewChildNodesOffsetTopList.length > i; i++) {
    if (previewElem.scrollTop < previewChildNodesOffsetTopList[i]) {
      scrollElemIndex = i - 1;
      break;
    }
  }

  if (
    previewElem.scrollTop >=
    previewElem.scrollHeight - previewElem.clientHeight //true when scroll reached the bottom
  ) {
    markdownElem.scrollTop =
      markdownElem.scrollHeight - markdownElem.clientHeight; //? scroll to the bottom
    return;
  }
  if (scrollElemIndex >= 0) {
    let ratio =
      (previewElem.scrollTop -
        previewChildNodesOffsetTopList[scrollElemIndex]) /
      (previewChildNodesOffsetTopList[scrollElemIndex + 1] -
        previewChildNodesOffsetTopList[scrollElemIndex]);
    markdownElem.scrollTop =
      ratio *
        (markdownChildNodesOffsetTopList[scrollElemIndex + 1] -
          markdownChildNodesOffsetTopList[scrollElemIndex]) +
      markdownChildNodesOffsetTopList[scrollElemIndex];
  }
};

function MarkdownEditor({ fileManager }) {
  const [editorRef, editorView] = useCodemirror({ fileManager });
  const { state } = useContext(siteContext);
  const mouseIsOn = useRef(null);

  const md = useMemo(() => {
    return unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeMathJaxSvg)
      .use(rehypeReact, { createElement, Fragment })
      .use(captureTreePlugin)
      .use(mediaPlugin(state.media.port))
      .processSync(fileManager.file.doc).result;
  }, [state.media.port, fileManager.file.doc]);

  return (
    <>
      {editorView && <MarkdownToolbar editorView={editorView} />}
      <div id="editor-markdown-wrapper">
        <div
          id="editor-markdown"
          ref={editorRef}
          onScroll={() => handleMdScroll(mouseIsOn, editorView)}
          onMouseEnter={() => (mouseIsOn.current = "markdown")}
          onMouseOver={() => (mouseIsOn.current = "markdown")} //in case mouse is above the element at the beginning
        ></div>
        <div
          id="editor-preview"
          className="markdown-body"
          onScroll={() => handlePreviewScroll(mouseIsOn, editorView)}
          onMouseEnter={() => (mouseIsOn.current = "preview")}
          onMouseOver={() => (mouseIsOn.current = "preview")}
        >
          {md}
        </div>
      </div>
    </>
  );
}

export default MarkdownEditor;
