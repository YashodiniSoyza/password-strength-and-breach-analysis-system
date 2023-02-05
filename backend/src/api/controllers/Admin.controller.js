import adminService from "../services/Admin.service";
import emailService from "../services/Email.service";
import Admin from "../models/Admin.model";
import bcrypt from "bcryptjs";
import generator from "generate-password";

export const createAdmin = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const password = generator.generate({
    length: 10,
    numbers: true,
  });
  const hashedPassword = await bcrypt.hash(password, salt);

  const admin = new Admin({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  await adminService
    .createAdmin(admin)
    .then((data) => {
      emailService.sendPassword(req.body.email, password);
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getAdmin = async (req, res, next) => {
  await adminService
    .getAdmin(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const getAllAdmins = async (req, res, next) => {
  await adminService
    .getAllAdmins()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const updateAdmin = async (req, res, next) => {
  await adminService
    .updateAdmin(req.params.id, req.body)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const deleteAdmin = async (req, res, next) => {
  await adminService
    .deleteAdmin(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const loginAdmin = async (req, res, next) => {
  await adminService
    .loginAdmin(req.body.email, req.body.password)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const verifyAdmin = async (req, res, next) => {
  await adminService
    .verifyAdmin(req.body.token)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

//change password
export const changePassword = async (req, res, next) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const password = {
    currentPassword: req.body.currentPassword,
    newPassword: hashedPassword,
  };

  await adminService
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
  createAdmin,
  getAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  verifyAdmin,
  changePassword,
};
