import "./App.css";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import TokenGeneration from "./components/TokenGeneration";
import CastVote from "./components/CastVote";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Forgot from "./components/Forgot";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/token" element={<TokenGeneration />} />
          <Route path="/vote" element={<CastVote />} />
          <Route path="/forgot" element={<Forgot />} />
        </Routes>
      </Router>

    </>
  );
}

export default App;
