import user from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const createUser = async (userObj) => {
  const emailExists = await user.findOne({ email: userObj.email });
  if (emailExists) {
    throw new Error("Email already exists");
  } else {
    return await user
      .create(userObj)
      .then(async (data) => {
        await data.save();
        return data;
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }
};

export const getUser = async (id) => {
  return await user
    .findById(id)
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("User not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const getAllUsers = async () => {
  return await user
    .find()
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const updateUser = async (id, userObj) => {
  return await user
    .findByIdAndUpdate(id, userObj, { new: true })
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("User not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const deleteUser = async (id) => {
  return await user
    .findByIdAndDelete(id)
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("User not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const loginUser = async (email, password) => {
  return await user
    .findOne({ email })
    .then((data) => {
      if (data) {
        if (bcrypt.compareSync(password, data.password)) {
          const accessToken = jwt.sign(
            {
              _id: data._id,
              email: data.email,
              role: "user",
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

export const verifyUser = async (token) => {
  return jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      throw new Error("Invalid token");
    } else {
      return decoded;
    }
  });
};

export default {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
  loginUser,
  verifyUser,
};
