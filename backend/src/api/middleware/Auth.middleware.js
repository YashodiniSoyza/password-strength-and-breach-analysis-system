import jwt from "jsonwebtoken";
import admin from "../models/Admin.model.js";

//Protect Admin routes
export const adminProtect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decoded.role !== "admin") {
        return res
          .status(401)
          .json({ message: "Not authorized to access this route" });
      } else {
        req.admin = await admin.findById(decoded._id).select("-password");
        next();
      }
    } catch (error) {
      res.status(401);
      req.handleResponse.unauthorizedRespond(res)(
        "Not authorized to access this route"
      );
    }
  }
  if (!token) {
    res.status(401);
    req.handleResponse.unauthorizedRespond(res)(
      "Not authorized to access this route"
    );
  }
};

module.exports = {
  adminProtect
};
