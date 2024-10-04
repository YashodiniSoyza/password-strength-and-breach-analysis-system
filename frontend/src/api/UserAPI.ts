import axios from "axios";
import requestConfig from "./config";
import requestConfigJson from "./configJson";

const BASE_URL = "http://localhost:8090";

class UserAPI {
  //User Login
  static userLogin = (email: string, password: string) => {
    let credentials = {
      email: email,
      password: password,
    };

    return axios.post(`${BASE_URL}/user/login`, credentials);
  };

  //User Login
  // static userOAuthLogin = async() => {
  //   return ;
  // };

  //user signup
  static userSignUp = (values: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: string;
  }) => {
    return axios.post(`${BASE_URL}/user/signup`, values, requestConfigJson);
  };

  //get all users
  static getUsers = () => {
    return axios.get(`${BASE_URL}/user`, requestConfig);
  };
  //add user
  static addUser = (values: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
  }) => {
    return axios.post(`${BASE_URL}/user`, values, requestConfigJson);
  };
  //delete user
  static deleteUser = (id: string) => {
    return axios.delete(`${BASE_URL}/user/${id}`, requestConfig);
  };
  //update user
  static editUser = (values: {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
  }) => {
    let user = {
      id: values.id,
      userId: values.userId,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      dateOfBirth: values.dateOfBirth,
    };
    return axios.put(`${BASE_URL}/user/${values.id}`, user, requestConfigJson);
  };

  //get vault by user id
  static getVaultByUserId = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const obj = {
      id: user._id,
    };

    return axios.post(`${BASE_URL}/vault`, obj, requestConfigJson);
  };

  //update vault
  static updateVault = (values: { id: string; vault: string }) => {
    const obj = {
      vault: values.vault,
    };
    return axios.put(`${BASE_URL}/vault/${values.id}`, obj, requestConfigJson);
  };

  //get home stats
  static getHomeStats = () => {
    return axios.get(`${BASE_URL}/stats/home`, requestConfig);
  };

  //change password
  static changeUserPassword(adminPassword: {
    id: string;
    currentPassword: string;
    password: string;
  }) {
    const password = {
      currentPassword: adminPassword.currentPassword,
      password: adminPassword.password,
    };
    return axios.put(
      `${BASE_URL}/user/password/${adminPassword.id}`,
      password,
      requestConfigJson
    );
  }

  //forgot password
  static forgotPassword = (email: string) => {
    const obj = {
      email: email,
    };
    return axios.post(
      `${BASE_URL}/user/forgot-password`,
      obj,
      requestConfigJson
    );
  };
}

export default UserAPI;
