import express from "express";
import rawMaterialController from "../controllers/rawMaterialController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { uploadImage } from "../middlewares/uploadImage.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  uploadImage("rawMaterials").single("image"),
  rawMaterialController.createRawMaterial
);
router.get("/", verifyToken, rawMaterialController.getAllRawMaterials);
router.get("/:id", verifyToken, rawMaterialController.getRawMaterialById);
router.put(
  "/:id",
  verifyToken,
  uploadImage("rawMaterials").single("image"),
  rawMaterialController.updateRawMaterial
);
router.delete("/:id", verifyToken, rawMaterialController.deleteRawMaterial);

export default router;
