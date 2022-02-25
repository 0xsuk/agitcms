import "./App.scss";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { ArrowBackIosNew } from "@mui/icons-material";
import { Button } from "@mui/material";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import {} from "@codemirror/commands";

function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Wrapper />}>
          <Route path="settings" element={<Settings />}></Route>
          <Route path="edit" element={<Editor />}></Route>
        </Route>
      </Routes>
    </Fragment>
  );
}

function Wrapper() {
  return (
    // list of workspace
    <div className="flex">
      <div id="side">
        <SideBar />
      </div>
      <div id="main">
        <Outlet />
      </div>
    </div>
  );
}

function Settings() {
  return (
    <Fragment>
      <h1>Settings</h1>
    </Fragment>
  );
}

function Editor() {
  const [doc, setDoc] = useState("Initial Doc");
  const handleChange = (state) => {
    // console.log("handleChange: state.doc", state.doc.toString());
    setDoc(state.doc.toString());
  };
  const [refContainer, editorView] = useCodeMirror({
    initialDoc: doc,
    onChange: handleChange,
  });
  console.log("importing refContainer", refContainer.current);
  console.log("current doc", doc);

  const saveFile = async () => {
    const err = await window.electronAPI.saveNewFile(doc);
    if (err) console.log(err.message)
  };

  return (
    <Fragment>
      <div id="editor">
        <h1>Editor</h1>
        <div ref={refContainer}></div>
        <Button onClick={saveFile} variant="contained">
          Save
        </Button>
      </div>
    </Fragment>
  );
}

function SideBar() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  useEffect(() => navigate("/edit"), []);
  return (
    <Fragment>
      <ArrowBackIosNew className="mui-icon" onClick={goBack} />
      <div>
        {_workspaces.map((workspace) => (
          <p>{workspace.name}</p>
        ))}
      </div>
      <div>
        <Link to="/settings">Settings</Link>
      </div>
      <div>
        <Link to="/edit">edit</Link>
      </div>
    </Fragment>
  );
}
const _workspaces = [
  {
    key: "agitlanding",
    name: "agitlanding",
    source: {
      type: "folder",
      path: "/home/null/go/src/github.com/0xsuk/agitlanding",
    },
  },
  {
    key: "agitdocs",
    name: "agitdocs",
    source: {
      type: "folder",
      path: "/home/null/go/src/github.com/0xsuk/agitdocs",
    },
  },
];

const useCodeMirror = (props) => {
  const refContainer = useRef(null);
  const [editorView, setEditorView] = useState();
  const { onChange, initialDoc } = props;

  useEffect(() => {
    if (!refContainer.current) {
      console.log("refContainer is null");
      return;
    }

    const startState = EditorState.create({
      doc: initialDoc,
      extensions: [
        EditorView.updateListener.of((update) => {
          if (update.changes) {
            console.log("update.state", update.state);
            onChange && onChange(update.state);
          }
        }),
      ],
    });

    console.log("setting refContainer");
    const view = new EditorView({
      state: startState,
      parent: refContainer.current,
    });

    setEditorView(view);
  }, [refContainer]);

  return [refContainer, editorView];
};

export default App;
