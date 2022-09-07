import { Tooltip } from "@mui/material";
import { useContext } from "react";
import { siteContext } from "../context/SiteContext";
import { ToolbarItem } from "../lib/plugin";
import useSiteConfig from "../lib/useSiteConfig";

function MarkdownToolbar({ editorView }) {
  const siteConfig = useSiteConfig();
  const { state } = useContext(siteContext);

  if (!editorView) {
    return <></>;
  }

  const toolbarItems = state.plugins.filter(
    (plugin) => plugin instanceof ToolbarItem && plugin.isActive
  );
  const sortedToolbarItems = toolbarItems.sort((a, b) => a.weight - b.weight); //Ascending order

  return (
    <div id="editor-markdown-toolbar">
      {sortedToolbarItems.map((tool) => (
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
