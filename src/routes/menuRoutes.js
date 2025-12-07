import express from "express";
import menuController from "../controllers/menuController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { uploadImage } from "../middlewares/uploadImage.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  uploadImage("menus").single("image"),
  menuController.createMenu
);
router.get("/", verifyToken, menuController.getAllMenus);
router.get("/:id", verifyToken, menuController.getMenuById);
router.put(
  "/:id",
  verifyToken,
  uploadImage("menus").single("image"),
  menuController.updateMenu
);
router.delete("/:id", verifyToken, menuController.deleteMenu);

export default router;
