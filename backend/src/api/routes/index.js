import adminController from "../controllers/Admin.controller";
import userController from "../controllers/User.controller";
import breachController from "../controllers/Breach.controller";
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
  app.put(
    "/admin/password/:id",
    protect.adminProtect,
    adminController.changePassword
  );

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

  //Breach Routes
  app.post("/breach", protect.adminProtect, breachController.createBreach);
  app.get(
    "/breach",
    protect.adminAndUserProtect,
    breachController.getAllBreaches
  );
  app.get(
    "/breach/:id",
    protect.adminAndUserProtect,
    breachController.getBreach
  );
  app.put("/breach/:id", protect.adminProtect, breachController.updateBreach);
  app.delete(
    "/breach/:id",
    protect.adminProtect,
    breachController.deleteBreach
  );
  app.post(
    "/breach/import/:id",
    protect.adminProtect,
    breachController.importBreaches
  );
  app.get(
    "/breach/leakedData/:id",
    protect.adminAndUserProtect,
    breachController.getLeakedDataByBreachId
  );
  app.post(
    "/breach/leakedData/password",
    breachController.checkForBreachesWithPassword
  );
  app.post(
    "/breach/leakedData/email",
    breachController.checkForBreachesWithEmail
  );
  app.post(
    "/breach/leakedData/username",
    breachController.checkForBreachesWithUsername
  );
  app.post(
    "/breach/leakedData/phone",
    breachController.checkForBreachesWithPhone
  );
  app.post("/breach/getByIds", breachController.getBreachesByIds);
};

export default routes;
