import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const accessToken = user.accessToken;
  return accessToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
