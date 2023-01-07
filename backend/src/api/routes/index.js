import adminController from "../controllers/Admin.controller";
import userController from "../controllers/User.controller";
import protect from "../middleware/Auth.middleware";

const routes = (app) => {
  //Admin Routes
  app.post("/admin/login", adminController.loginAdmin);
  app.post("/admin", protect.adminProtect, adminController.createAdmin);
  app.get("/admin", protect.adminProtect, adminController.getAllAdmins);
  app.get("/admin/:id", protect.adminProtect, adminController.getAdmin);
  app.put("/admin/:id", protect.adminProtect, adminController.updateAdmin);
  app.delete("/admin/:id", protect.adminProtect, adminController.deleteAdmin);
  app.post("/admin/verify", protect.adminProtect, adminController.verifyAdmin);

  //User Routes
  app.post("/user/login", userController.loginUser);
  app.post("/user", userController.createUser);
  app.get("/user", protect.adminAndUserProtect, userController.getAllUsers);
  app.get("/user/:id", protect.adminAndUserProtect, userController.getUser);
  app.put("/user/:id", protect.adminAndUserProtect, userController.updateUser);
  app.delete(
    "/user/:id",
    protect.adminAndUserProtect,
    userController.deleteUser
  );
  app.post(
    "/user/verify",
    protect.adminAndUserProtect,
    userController.verifyUser
  );
};

export default routes;
