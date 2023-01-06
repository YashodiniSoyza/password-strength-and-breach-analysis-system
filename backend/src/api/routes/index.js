import adminController from "../controllers/Admin.controller";
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
};

export default routes;
