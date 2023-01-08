import { Home } from "../pages";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const PageRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default PageRoutes;

