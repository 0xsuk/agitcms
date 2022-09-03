import { defaultTools } from "../lib/toolbar";
import useSiteConfig from "../lib/useSiteConfig";

function MarkdownToolbar({ editorView }) {
  const siteConfig = useSiteConfig();
  if (!editorView) {
    return <></>;
  }
  return (
    <div id="editor-markdown-toolbar">
      {defaultTools.map((tool) => (
        <>
          <p onClick={() => tool.run(editorView, siteConfig)}>
            {tool.initialChar}
          </p>
        </>
      ))}
    </div>
  );
}

export default MarkdownToolbar;
