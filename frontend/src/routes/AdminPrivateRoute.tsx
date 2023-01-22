import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const admin = JSON.parse(localStorage.getItem("admin") || "{}");
  const accessToken = admin.accessToken;
  return accessToken ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default PrivateRoute;
