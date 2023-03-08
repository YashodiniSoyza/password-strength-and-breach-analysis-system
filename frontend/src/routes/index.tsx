import { AdminLogin, Home, UserLoginPage } from "../pages";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Logout } from "../components";
import AdminPrivateRoute from "./AdminPrivateRoute";
import UserPrivateRoute from "./UserPrivateRoute";
import {
  AdminDashboard,
  ManageUsers,
  ManageAdmins,
  AdminSettings,
  PasswordGeneratorPage,
  AESEncryptDecryptPage,
  ManageBreaches,
  UserSignUpPage,
  VaultPage,
  UserSettingsPage,
  IPCheck,
  UserForgotPasswordPage,
  AdminForgotPasswordPage,
} from "../pages";

const PageRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/forgot-password"
          element={<AdminForgotPasswordPage />}
        />
        <Route path="/login" element={<UserLoginPage />} />
        <Route path="/signup" element={<UserSignUpPage />} />
        <Route path="/password-generator" element={<PasswordGeneratorPage />} />
        <Route path="/ip-check" element={<IPCheck />} />
        <Route
          path="/user/forgot-password"
          element={<UserForgotPasswordPage />}
        />

        <Route path="/admin" element={<AdminPrivateRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/manage-users" element={<ManageUsers />} />
          <Route path="/admin/manage-admins" element={<ManageAdmins />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/manage-breaches" element={<ManageBreaches />} />
        </Route>

        <Route path="/user" element={<UserPrivateRoute />}>
          <Route path="/user/vault" element={<VaultPage />} />
          <Route path="/user/settings" element={<UserSettingsPage />} />
        </Route>
        <Route
          path="/encrypt-decrypt/aes"
          element={<AESEncryptDecryptPage />}
        />
      </Routes>
    </Router>
  );
};

export default PageRoutes;
