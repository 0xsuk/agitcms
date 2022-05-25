import Editor from "@toast-ui/editor";
import ReactDOM from "react-dom";
import Switch from "@mui/material/Switch";
import { Grid, Typography } from "@mui/material";

function createButton(dom) {
  const el = document.createElement("div");
  ReactDOM.render(dom, el);
  return el;
}

function useTuiEditor(
  initialValue,
  update,
  showFrontmatter,
  setShowFrontmatter
) {
  const editor = new Editor({
    el: document.getElementById("editor-tab"),
    initialValue,
    frontMatter: true,
    height: "100%",
    previewStyle: "vertical",
    events: {
      change: () => update(editor),
    },
    toolbarItems: [
      ["heading", "bold", "italic", "strike"],
      ["hr", "quote"],
      ["ul", "ol", "task", "indent", "outdent"],
      ["table", "image", "link"],
      ["code", "codeblock"],
      [
        {
          el: createButton(
            <Grid container alignItems="center">
              <Grid item>
                <Typography>Frontmatter</Typography>
              </Grid>
              <Grid item>
                <Switch
                  size="small"
                  checked={showFrontmatter}
                  onChange={(e) => setShowFrontmatter(e.target.checked)}
                />
              </Grid>
            </Grid>
          ),
          command: "bold",
          tooltip: "Show Frontmatter in Editor",
        },
      ],
    ],
  });

  return editor;
}

export default useTuiEditor;
