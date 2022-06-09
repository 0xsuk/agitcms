import useCodemirror from "../lib/useCodemirror";

function MarkdownEditor({ fileManager, siteConfig }) {
  const [editorRef, editorView] = useCodemirror(fileManager);

  const action = () => {};

  return (
    <>
      <button onClick={action}>Action</button>
      <div style={{ display: "flex", height: "100%" }}>
        <div style={{ height: "100%", flex: "0 0 50%" }} ref={editorRef}></div>
        <div style={{ height: "100%", flex: "0 0 50%" }}>
          {fileManager.file.content}
        </div>
      </div>
    </>
  );
}

export default MarkdownEditor;
