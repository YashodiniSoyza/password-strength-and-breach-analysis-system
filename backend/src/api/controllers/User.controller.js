import userService from "../services/User.service";
import vaultService from "../services/Vault.service.js";
import User from "../models/User.model";
import bcrypt from "bcryptjs";
import emailService from "../services/Email.service";
import generator from "generate-password";

export const createUser = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const password = generator.generate({
    length: 10,
    numbers: true,
  });
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
    dateOfBirth: req.body.dateOfBirth,
  });

  await userService
    .createUser(user)
    .then(async (data) => {
      emailService.sendPassword(req.body.email, password);

      const salt = await bcrypt.genSalt(64);
      const vaultObj = {
        userId: data._id,
        vault: "",
        salt: salt,
      };
      await vaultService.createVault(vaultObj);

      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

const signupUser = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
    dateOfBirth: req.body.dateOfBirth,
  });

  await userService
    .createUser(user)
    .then(async (data) => {
      const salt = await bcrypt.genSalt(64);
      const vaultObj = {
        userId: data._id,
        vault: "",
        salt: salt,
      };
      await vaultService.createVault(vaultObj);

      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getUser = async (req, res, next) => {
  await userService
    .getUser(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getAllUsers = async (req, res, next) => {
  await userService
    .getAllUsers()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const updateUser = async (req, res, next) => {
  await userService
    .updateUser(req.params.id, req.body)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const deleteUser = async (req, res, next) => {
  await userService
    .deleteUser(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const loginUser = async (req, res, next) => {
  await userService
    .loginUser(req.body.email, req.body.password)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const verifyUser = async (req, res, next) => {
  await userService
    .verifyUser(req.body.token)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const changePassword = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const password = {
    currentPassword: req.body.currentPassword,
    newPassword: hashedPassword,
  };

  await userService
    .changePassword(req.params.id, password)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};
module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  loginUser,
  verifyUser,
  signupUser,
  changePassword,
};
