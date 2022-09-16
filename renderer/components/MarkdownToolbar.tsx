import { siteContext } from "@/context/SiteContext";
import { ToolbarItem } from "@/utils/plugin";
import useSiteConfig from "@/utils/useSiteConfig";
import * as stateModule from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { Tooltip } from "@mui/material";
import { ISiteConfig } from "@shared/types/config";
import { useContext } from "react";

function MarkdownToolbar({ editorView }: { editorView: EditorView }) {
  const siteConfig = useSiteConfig() as ISiteConfig;
  const { state } = useContext(siteContext);

  if (!editorView) {
    return <></>;
  }

  const toolbarItems = state.plugins.filter(
    (plugin) => plugin instanceof ToolbarItem && !plugin.isImplicit
  ) as ToolbarItem[];

  if (toolbarItems.length === 0) {
    return <></>;
  }
  const sortedToolbarItems = toolbarItems.sort((a, b) => a.weight - b.weight); //Ascending order

  return (
    <div id="editor-markdown-toolbar">
      {sortedToolbarItems.map((tool) => (
        <>
          <Tooltip title={tool.tooltip}>
            <p onClick={() => tool.run(editorView, siteConfig, stateModule)}>
              {tool.initialChar}
            </p>
          </Tooltip>
        </>
      ))}
    </div>
  );
}

export default MarkdownToolbar;
