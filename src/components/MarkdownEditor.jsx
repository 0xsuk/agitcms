import {
  createElement,
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeMathJaxSvg from "rehype-mathjax";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { configContext } from "../context/ConfigContext";
import useCodemirror from "../lib/useCodemirror";
let treeData;
const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;

const isURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

function MarkdownEditor({ fileManager, siteConfig }) {
  useEffect(() => {
    console.log("MarkdownEditor");
  }, []);

  const { config } = useContext(configContext);
  if (config.theme === "dark") {
    import(
      /* webpackMode: "eager" */ "github-markdown-css/github-markdown-dark.css"
    );
  } else {
    import(
      /* webpackMode: "eager" */ "github-markdown-css/github-markdown-light.css"
    );
  }

  const [editorRef, editorView] = useCodemirror({ fileManager });
  const mouseIsOn = useRef(null);

  const defaultPlugin = useCallback(
    () => (tree) => {
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
          ).href; //TODO -> port configuration
          return c;
        });
        return child;
      });
      return tree;
    },
    []
  );
  const markdownElem = document.getElementById("editor-markdown");
  const previewElem = document.getElementById("editor-preview");

  const computeElemsOffsetTop = useCallback(() => {
    let markdownChildNodesOffsetTopList = [];
    let previewChildNodesOffsetTopList = [];

    treeData.children.forEach((child, index) => {
      if (child.type !== "element" || child.position === undefined) return;

      const pos = child.position.start.offset;
      const lineInfo = editorView.lineBlockAt(pos);
      const offsetTop = lineInfo.top;
      markdownChildNodesOffsetTopList.push(offsetTop);
      previewChildNodesOffsetTopList.push(
        previewElem.childNodes[index].offsetTop +
          (isMac ? 22 : 30) - //Window titlebar height
          previewElem.getBoundingClientRect().top //offsetTop from the top of editor_preview
      );
    });

    return [markdownChildNodesOffsetTopList, previewChildNodesOffsetTopList];
  }, [editorView]);
  const handleMdScroll = useCallback(() => {
    if (mouseIsOn.current !== "markdown") {
      return;
    }
    const [markdownChildNodesOffsetTopList, previewChildNodesOffsetTopList] =
      computeElemsOffsetTop();

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
      previewElem.scrollTop =
        previewElem.scrollHeight - previewElem.clientHeight; //? scroll to the bottom
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
  }, [editorView]);

  const handlePreviewScroll = useCallback(() => {
    if (mouseIsOn.current !== "preview") {
      return;
    }
    const [markdownChildNodesOffsetTopList, previewChildNodesOffsetTopList] =
      computeElemsOffsetTop();
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
  }, [editorView]);

  const md = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeMathJaxSvg)
    .use(rehypeReact, { createElement, Fragment })
    .use(defaultPlugin)
    .processSync(fileManager.file.doc).result;

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <div
          id="editor-markdown"
          ref={editorRef}
          onScroll={handleMdScroll}
          onMouseEnter={() => (mouseIsOn.current = "markdown")}
          onMouseOver={() => (mouseIsOn.current = "markdown")} //in case mouse is above the element at the beginning
        ></div>
        <div
          id="editor-preview"
          className="markdown-body"
          onScroll={handlePreviewScroll}
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
