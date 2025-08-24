import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Register from "./users/register";
import Home from "./users/Home";
import AdminHome from "./admin/adminHome";
import Report from "./users/ReportUser";
import ProfileUser from "./users/ProfileUser";
import ReportAdmin from "./admin/ReportAdmin";
import Maintenance from "./admin/Maintenance";
import HistoryAdmin from "./admin/HistoryAdmin";
import Detail from "./components/Detail";
import DetailAdmin from "./components/DetailAdmin";

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
        <Route path="/report-admin" element={<ReportAdmin />}/>
        <Route path="/maintenance" element={<Maintenance />}/>
        <Route path="/history-admin" element={<HistoryAdmin />}/>
        <Route path="/detail/:id" element={<Detail />}/>
        <Route path="/detail-admin/:id" element={<DetailAdmin />}/>
      </Routes>
    </Router>
  );
}

export default App;
