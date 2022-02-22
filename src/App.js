import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/varfile" element={<Varfile />}></Route>
      </Routes>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <Link to={"/about"}>About</Link>
      <Link to={"/varfile"}>Varfile</Link>
      <h1>Home</h1>
    </div>
  );
}

function About() {
  return (
    <div>
      <Link to="/">Home</Link>
      <h1>About</h1>
    </div>
  );
}

function Varfile() {
  const [data, setData] = useState({});

  useEffect(async () => {
    const res = await window.electronAPI.loadConfig();
    setData(res);
    console.log(res);
  }, []);

  return (
    <div>
      {Object.keys(data).map((k) => (
        <p>{data[k]}</p>
      ))}
    </div>
  );
}

export default App;
