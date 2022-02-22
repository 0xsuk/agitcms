import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import { Fragment, useEffect, useState } from "react";

function App() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  return (
    <Fragment>
      <button onClick={goBack}>Go Back</button>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/settings" element={<Settings />}></Route>
      </Routes>
    </Fragment>
  );
}

function Home() {
  return (
    // list of workspace
    <div>
      <h1>WorkSpaces</h1>
      <SideBar />
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
function SideBar() {
  return (
    <Fragment>
      <div>
        {_workspaces.map((workspace) => (
          <p>{workspace.name}</p>
        ))}
      </div>
      <Link to="/settings">Settings</Link>
    </Fragment>
  );
}

export default App;
