import "./App.scss";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";
import { Fragment } from "react";
import { ArrowBackIosNew } from "@mui/icons-material";

function App() {
  return (
    <Fragment>
      <Routes>
        <Route path="/" element={<Wrapper />}>
          <Route path="settings" element={<Settings />} />
          <Route path="edit" element={<Editor/>} />
        </Route>
      </Routes>
    </Fragment>
  );
}

function Wrapper() {
  return (
    // list of workspace
    <div className="flex">
      <SideBar />
      <Outlet />
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
  return (
    <Fragment>
      <div id="editor">editor</div>
    </Fragment>
  );
}

function SideBar() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return (
    <Fragment>
      <div id="sidebar">
        <ArrowBackIosNew className="mui-icon" onClick={goBack} />
        <div>
          {_workspaces.map((workspace) => (
            <p>{workspace.name}</p>
          ))}
        </div>
        <Link to="/settings">Settings</Link>
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

export default App;
