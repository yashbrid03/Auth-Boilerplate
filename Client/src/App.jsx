import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { Verify } from "./pages/Verify.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/verify-email/:token" element={<Verify />} />
      <Route exact path="/" element={<PrivateRoute />}>
        <Route exact path="/dashboard" element={<Dashboard />} />
      </Route>
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default App;
