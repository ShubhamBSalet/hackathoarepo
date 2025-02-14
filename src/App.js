import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./components/SignUp";
import Login from "./components/Login";
import TokenGeneration from "./components/TokenGeneration";
import CastVote from "./components/CastVote";
import Forgot from "./components/Forgot";
import HomePage from "./components/HomePage";
import Unauthorized from "./components/Unauthorised";

// ProtectedRoute: Only accessible to logged-in users
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/unauthorized" />;
};

// PublicRoute: Only accessible to non-logged-in users
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return !token ? children : <Navigate to="/homepage" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/forgot" element={<PublicRoute><Forgot /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/homepage" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/token" element={<ProtectedRoute><TokenGeneration /></ProtectedRoute>} />
        <Route path="/vote" element={<ProtectedRoute><CastVote /></ProtectedRoute>} />

        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
