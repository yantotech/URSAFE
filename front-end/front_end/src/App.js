import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./users/register";
import Home from "./users/Home";
import AdminHome from "./admin/adminHome";
import Report from "./users/ReportUser";
import ProfileUser from "./users/ProfileUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/report" element={<Report />}/>
        <Route path="/profile" element={<ProfileUser />}/>
      </Routes>
    </Router>
  );
}

export default App;
