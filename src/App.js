import logo from "./logo.svg";
import "./App.css";
import Books from "./pages/Books.jsx";
import Add from "./pages/Add";
//import "./style.css";
import "./style3.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Books />} />
          <Route path="/add" element={<Add />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
