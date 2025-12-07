import { Router } from "express";
import userController from "../controllers/userController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isOwner } from "../middlewares/roleMiddleware.js";

const router = Router();

router.get("/", verifyToken, isOwner, userController.getAll);
router.get("/:id", verifyToken, isOwner, userController.getById);
router.post("/", verifyToken, isOwner, userController.create);
router.put("/:id", verifyToken, isOwner, userController.update);
router.put("/:id/deactivate", verifyToken, isOwner, userController.deactivate);
router.put("/:id/activate", verifyToken, isOwner, userController.activate);

export default router;
