import * as stateModule from "@codemirror/state";
import * as viewModule from "@codemirror/view";
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
    (plugin) => plugin instanceof ToolbarItem
  );

  if (toolbarItems.length === 0) {
    return <></>;
  }
  const sortedToolbarItems = toolbarItems.sort((a, b) => a.weight - b.weight); //Ascending order

  return (
    <div id="editor-markdown-toolbar">
      {sortedToolbarItems.map((tool) => (
        <>
          <Tooltip title={tool.tooltip}>
            <p
              onClick={() =>
                tool.run(editorView, siteConfig, stateModule, viewModule)
              }
            >
              {tool.initialChar}
            </p>
          </Tooltip>
        </>
      ))}
    </div>
  );
}

export default MarkdownToolbar;
