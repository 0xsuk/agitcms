import "./App.scss";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { ArrowBackIosNew } from "@mui/icons-material";
import { Button } from "@mui/material";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import {} from "@codemirror/commands";

function App() {
  const loadConfig = async () => {
    const { config, err } = await window.electronAPI.loadConfig();
    if (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Wrapper />}>
          <Route path="" element={<Home></Home>}></Route>
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

function Home() {
  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}

function Settings() {
  return (
    <Fragment>
      <h1>Settings</h1>
    </Fragment>
  );
}

function Editor() {
  //setDoc doest not update refContainer, use editorView.dispatch to update text
  const [doc, setDoc] = useState("");
  const handleChange = useCallback((state) => {
    setDoc(state.doc.toString());
  }, []);
  const [refContainer, editorView] = useCodeMirror({
    initialDoc: doc,
    onChange: handleChange,
  });

  const saveFile = async () => {
    const { err, canceled } = await window.electronAPI.saveNewFile(doc);
    if (err) {
      alert(err.message)
    }
    if (!err & !canceled) {
      alert("Saved!")
    }
  };

  const openFile = async () => {
    const { content, err, canceled } = await window.electronAPI.openFile();
    if (!err && !canceled) {
      editorView.dispatch({changes: {from: 0, to:editorView.state.doc.length, insert: content}})
    }
  };

  return (
    <Fragment>
      <div id="editor">
        <h1>Editor</h1>
        <Button onClick={openFile} variant="contained">
          Open
        </Button>
        <Button onClick={saveFile} variant="contained">
          Save
        </Button>
        <div ref={refContainer}></div>
      </div>
    </Fragment>
  );
}

function SideBar() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  // useEffect(() => navigate("/edit"), []);
  return (
    <Fragment>
      <ArrowBackIosNew className="mui-icon" onClick={goBack} />
      <div>
        {_workspaces.map((workspace) => (
          <p>{workspace.name}</p>
        ))}
      </div>
      <div>
        <Link to="/">Home</Link>
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
  const { initialDoc, onChange } = props;

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
            onChange(update.state);
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: refContainer.current,
    });

    setEditorView(view);
  }, [refContainer]);

  return [refContainer, editorView];
};

export default App;
