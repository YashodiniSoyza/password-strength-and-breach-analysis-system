import { AdminLogin, Home } from "../pages";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Logout } from "../components";
import AdminPrivateRoute from "./AdminPrivateRoute";
import {
  AdminDashboard,
  ManageUsers,
  ManageAdmins,
  AdminSettings,
  PasswordGeneratorPage,
} from "../pages";

const PageRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/password-generator" element={<PasswordGeneratorPage />} />

        <Route path="/admin" element={<AdminPrivateRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/manage-admins" element={<ManageAdmins />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default PageRoutes;
