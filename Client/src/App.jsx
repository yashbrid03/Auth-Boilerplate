import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import { Verify } from "./pages/Verify.jsx";
import { Register } from "./pages/Register.jsx";
import { ForgetPass } from "./pages/ForgetPass.jsx";
import { useState } from "react";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register/>}/>
      <Route path="/verify-email/:token" element={<Verify />} />
      <Route path="/forget-password/:token" element={<ForgetPass/>}/>
      <Route exact path="/" element={<PrivateRoute />}>
        <Route exact path="/dashboard" element={<Dashboard />} />
      </Route>
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default App;
