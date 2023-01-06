import admin from "../models/Admin.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const createAdmin = async (adminObj) => {
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
  return await admin
    .find()
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
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

export default {
  createAdmin,
  getAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
  loginAdmin,
  verifyAdmin,
};
