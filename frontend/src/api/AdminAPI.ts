import axios from "axios";
import requestConfig from "./config";
import requestConfigJson from "./configJson";

const BASE_URL = "http://localhost:8090";

class AdminAPI {
  //!Admin Login
  // Authenticates a user
  static adminLogin = (email: string, password: string) => {
    let credentials = {
      email: email,
      password: password,
    };

    return axios.post(`${BASE_URL}/admin/login`, credentials);
  };

  //!get all admins
  // Retrieves a list of users
  static getAdmins = () => {
    return axios.get(`${BASE_URL}/admin`, requestConfig);
  };
  //!add admin
  // Creates a new user
  static addAdmin = (values: { name: string; email: string }) => {
    return axios.post(`${BASE_URL}/admin`, values, requestConfigJson);
  };
  //!delete admin
  // Deletes a user by ID
  static deleteAdmin = (id: string) => {
    return axios.delete(`${BASE_URL}/admin/${id}`, requestConfig);
  };
  //!update admin
  // Updates user information
  static editAdmin = (values: { id: string; name: string; email: string }) => {
    let admin = {
      name: values.name,
      email: values.email,
    };
    return axios.put(
      `${BASE_URL}/admin/${values.id}`,
      admin,
      requestConfigJson
    );
  };
  //!update admin password
  // Changes user password
  static changeAdminPassword(adminPassword: {
    id: string;
    currentPassword: string;
    password: string;
  }) {
    const password = {
      currentPassword: adminPassword.currentPassword,
      password: adminPassword.password,
    };
    return axios.put(
      `${BASE_URL}/admin/password/${adminPassword.id}`,
      password,
      requestConfigJson
    );
  }

  //!get admin dashboard stats
  // Fetches system statistics
  static getAdminDashboardStats = () => {
    return axios.get(`${BASE_URL}/stats/admin`, requestConfig);
  };

  //!forgot password
  // Initiates password recovery
  static forgotPassword = (email: string) => {
    const emailObj = {
      email: email,
    };
    return axios.post(
      `${BASE_URL}/admin/forgot-password`,
      emailObj,
      requestConfigJson
    );
  };
}

export default AdminAPI;
