import { defaultTools } from "../lib/toolbar";

function MarkdownToolbar({ editorView }) {
  if (!editorView) {
    return <></>;
  }
  return (
    <div id="editor-markdown-toolbar">
      {defaultTools.map((tool) => (
        <>
          <p onClick={() => tool.action(editorView, "arg1", "arg2")}>
            {tool.initialChar}
          </p>
        </>
      ))}
    </div>
  );
}

export default MarkdownToolbar;
