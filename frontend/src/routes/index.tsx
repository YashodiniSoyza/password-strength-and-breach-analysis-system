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
  EncryptDecryptPage,
  AESEncryptDecryptPage,
  ManageBreaches,
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
          <Route path="/admin/manage-breaches" element={<ManageBreaches />} />
        </Route>

        <Route path="/encrypt-decrypt" element={<EncryptDecryptPage />} />
        <Route
          path="/encrypt-decrypt/aes"
          element={<AESEncryptDecryptPage />}
        />
      </Routes>
    </Router>
  );
};

export default PageRoutes;
