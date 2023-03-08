import admin from "../models/Admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const createAdmin = async (adminObj) => {
  const lastAdmin = await admin.findOne().sort({ _id: -1 });
  if (lastAdmin) {
    const lastAdminId = lastAdmin.adminId;
    const lastAdminIdNumber = parseInt(lastAdminId.slice(6, 9));
    const newAdminIdNumber = lastAdminIdNumber + 1;
    const newAdminId = "ADMIN" + newAdminIdNumber.toString().padStart(3, "0");
    adminObj.adminId = newAdminId;
  } else {
    adminObj.adminId = "ADMIN001";
  }

  const emailExists = await admin.findOne({ email: adminObj.email });
  if (emailExists) {
    throw new Error("Email already exists");
  } else {
    return await admin
      .create(adminObj)
      .then(async (data) => {
        await data.save();
        return data;
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }
};

export const getAdmin = async (id) => {
  return await admin
    .findById(id)
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Admin not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const getAllAdmins = async () => {
  //exclude password from the response
  return await admin.find({}, { password: 0 }).then((data) => {
    if (data) {
      return data;
    } else {
      throw new Error("No Admins found");
    }
  });
};

export const updateAdmin = async (id, adminObj) => {
  return await admin
    .findByIdAndUpdate(id, adminObj, { new: true })
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Admin not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const deleteAdmin = async (id) => {
  return await admin
    .findByIdAndDelete(id)
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Admin not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const loginAdmin = async (email, password) => {
  return await admin
    .findOne({ email })
    .then((data) => {
      if (data) {
        if (bcrypt.compareSync(password, data.password)) {
          const accessToken = jwt.sign(
            {
              _id: data._id,
              email: data.email,
              role: "admin",
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "1d",
            }
          );
          //create response object
          const responseObj = {
            _id: data._id,
            name: data.name,
            email: data.email,
            accessToken: accessToken,
          };
          return responseObj;
        } else {
          throw new Error("Invalid Login Credentials");
        }
      } else {
        throw new Error("Invalid Login Credentials");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const verifyAdmin = async (token) => {
  return jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      throw new Error("Invalid token");
    } else {
      return decoded;
    }
  });
};

//change password
export const changePassword = async (id, password) => {
  const adminObj = await admin.findById(id);
  if (bcrypt.compareSync(password.currentPassword, adminObj.password)) {
    return await admin
      .findByIdAndUpdate(id, { password: password.newPassword }, { new: true })
      .then((data) => {
        if (data) {
          return data;
        } else {
          throw new Error("Admin not found");
        }
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  } else {
    throw new Error("Invalid current password");
  }
};

export const checkEmail = async (email) => {
  return await admin
    .findOne({ email: email })
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Email not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export default {
  createAdmin,
  getAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  verifyAdmin,
  changePassword,
  checkEmail,
};
