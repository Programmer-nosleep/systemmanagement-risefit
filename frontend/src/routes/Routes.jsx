import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";
import Login from "../views/Login";
import Register from "../views/Register";
import Profile from "../views/Profile";
import AdminPanel from "../views/admin/AdminPanel";
import DashboardUser from "../views/pelanggan/DashboardUser";
import ViewInventory from "../views/pelanggan/ViewInventory";
import BookingClass from "../views/pelanggan/BookingClass";
import HistoryUser from "../views/pelanggan/HistoryUser";
import Dashboard from "../views/backoffice/Dashboard";
import AdminFinance from "../views/backoffice/AdminFinance";
import Purchasing from "../views/backoffice/Purchasing";
import Marketing from "../views/backoffice/Marketing";
import ManageClass from "../views/backoffice/ManageKelas";
import Acounting from "../views/backoffice/Acounting";
import Inventory from "../views/backoffice/Inventory";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<ProtectedRoute element={<AdminPanel />} requiredRole={["admin"]} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} requiredRole={["admin", "backoffice"]} />} />
        <Route path="/admin-finance" element={<ProtectedRoute element={<AdminFinance />} requiredRole={["admin", "backoffice"]} />} />
        <Route path="/purchasing" element={<ProtectedRoute element={<Purchasing />} requiredRole={["admin", "backoffice"]} />} />
        <Route path="/marketing-sales" element={<ProtectedRoute element={<Marketing />} requiredRole={["admin", "backoffice"]} />} />
        <Route path="/manage-class" element={<ProtectedRoute element={<ManageClass />} requiredRole={["admin", "backoffice"]} />} />
        <Route path="/acounting" element={<ProtectedRoute element={<Acounting />} requiredRole={["admin", "backoffice"]} />} />
        <Route path="/inventory" element={<ProtectedRoute element={<Inventory />} requiredRole={["admin", "backoffice"]} />} />
        <Route path="/dashboard-user" element={<ProtectedRoute element={<DashboardUser />} requiredRole={["admin", "user"]} />} />
        <Route path="/dashboard-user/profile" element={<ProtectedRoute element={<Profile />} requiredRole={["admin", "user"]} />} />
        <Route path="/lihat-barang" element={<ProtectedRoute element={<ViewInventory />} requiredRole={["admin", "user"]} />} />
        <Route path="/booking-kelas" element={<ProtectedRoute element={<BookingClass />} requiredRole={["admin", "user"]}/>}/>
        <Route path="/riwayat" element={<ProtectedRoute element={<HistoryUser />} requiredRole={["admin", "user"]}/>}></Route>
      </Routes>
    </Router>
  );
};

export default AppRoutes;
