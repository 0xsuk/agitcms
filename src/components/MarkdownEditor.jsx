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

function MarkdownEditor({ fileManager, siteConfig }) {
  const [editorRef, editorView] = useCodemirror(fileManager);

  const action = () => {};

  const md = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeMathJax)
    .use(rehypeReact, { createElement, Fragment })
    .processSync(fileManager.file.content).result;

  console.log({ md });

  return (
    <>
      <button onClick={action}>Action</button>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ height: "100%", flex: "0 0 50%" }} ref={editorRef}></div>
        <div
          className="markdown-body"
          style={{
            height: "100%",
            flex: "0 0 50%",
            padding: "0 12px",
          }}
        >
          {md}
        </div>
      </div>
    </>
  );
}

export default MarkdownEditor;
