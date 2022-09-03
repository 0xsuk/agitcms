import { Tooltip } from "@mui/material";
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
          <Tooltip title={tool.tooltip}>
            <p onClick={() => tool.run(editorView, siteConfig)}>
              {tool.initialChar}
            </p>
          </Tooltip>
        </>
      ))}
    </div>
  );
}

export default MarkdownToolbar;
