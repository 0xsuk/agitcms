import { siteContext } from "@/context/SiteContext";
import { isURL } from "@/utils/constants";
import useCodemirror from "@/utils/useCodemirror";
import { IFileManager } from "@/utils/useFileManager";
import { EditorView } from "codemirror";
import "github-markdown-css/github-markdown-dark.css";
import {
  createElement,
  Fragment,
  MutableRefObject,
  ReactNode,
  useContext,
  useMemo,
  useRef,
} from "react";
import rehypeMathJaxSvg from "rehype-mathjax";
import rehypeReact from "rehype-react";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import MarkdownToolbar from "./MarkdownToolbar";

let treeData: any;
const captureTreePlugin = () => (tree: any) => {
  treeData = tree; //treeData length corresponds to editor-previewer's childNodes length
};
const mediaPlugin: any = (port: number) => () => (tree: any) => {
  if (port === undefined) return;
  tree.children = tree.children.map((child: any) => {
    if (
      child.type !== "element" ||
      child.tagName !== "p" ||
      child.children === undefined
    )
      return child;

    child.children = child.children.map((c: any) => {
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
//TODO this is immutable to scroll, should be used as unified plugin
const computeElemsOffsetTop = (editorView: EditorView) => {
  const previewElem = document.getElementById("editor-preview") as HTMLElement;
  const markdownChildNodesOffsetTopList: number[] = [];
  const previewChildNodesOffsetTopList: number[] = [];

  treeData.children.forEach((child: any, index: number) => {
    if (child.type !== "element" || child.position === undefined) return;

    const pos = child.position.start.offset;
    const lineInfo = editorView.lineBlockAt(pos);
    const offsetTop = lineInfo.top;
    markdownChildNodesOffsetTopList.push(offsetTop);
    previewChildNodesOffsetTopList.push(
      (previewElem.childNodes[index] as HTMLElement).offsetTop - //bottom of windowbar to the top of childnode, immutable to scroll
        previewElem.getBoundingClientRect().top - //top of window to the top of editor-preview, immutable to scroll
        10 //padding top of previewElem TODO
    );
  });

  return [markdownChildNodesOffsetTopList, previewChildNodesOffsetTopList];
};
const handleMdScroll = (
  mouseIsOn: MutableRefObject<string>,
  editorView: EditorView | null
) => {
  if (!editorView) return;
  const markdownElem = document.getElementById(
    "editor-markdown"
  ) as HTMLElement;
  const previewElem = document.getElementById("editor-preview") as HTMLElement;
  if (mouseIsOn.current !== "markdown") {
    return;
  }
  const [markdownChildNodesOffsetTopList, previewChildNodesOffsetTopList] =
    computeElemsOffsetTop(editorView);

  let scrollElemIndex = -1;
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
    previewElem.scrollTo({
      top: previewElem.scrollHeight - previewElem.clientHeight,
      behavior: "smooth",
    }); //scroll to the bottom
    return;
  }

  if (scrollElemIndex >= 0) {
    const ratio =
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

const handlePreviewScroll = (
  mouseIsOn: MutableRefObject<string>,
  editorView: EditorView | null
) => {
  if (!editorView) return;
  const markdownElem = document.getElementById(
    "editor-markdown"
  ) as HTMLElement;
  const previewElem = document.getElementById("editor-preview") as HTMLElement;
  if (mouseIsOn.current !== "preview") {
    return;
  }
  const [markdownChildNodesOffsetTopList, previewChildNodesOffsetTopList] =
    computeElemsOffsetTop(editorView);
  let scrollElemIndex = -1;
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
    const ratio =
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

function MarkdownEditor({ fileManager }: { fileManager: IFileManager }) {
  const { editorRef, editorView } = useCodemirror({ fileManager });
  const { state } = useContext(siteContext);
  const mouseIsOn = useRef<string>("");

  //TODO: takes 140 ms for 1000 lines of document
  const md = useMemo(() => {
    const res = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeMathJaxSvg)
      .use(rehypeReact, { createElement, Fragment })
      .use(captureTreePlugin)
      .use(mediaPlugin(state.media.port))
      .processSync(fileManager.file.doc).result;
    return res as ReactNode;
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
