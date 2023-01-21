import { AdminLogin, Home } from "../pages";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Logout } from "../components";

const PageRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
};

export default PageRoutes;
