const logout = () => {
  localStorage.removeItem("admin");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  window.location.href = "/";
};

const Logout: React.FC = () => {
  logout();
  return <div />;
};

export default Logout;
