import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { isOwner } from "../middlewares/roleMiddleware.js";
import authController from "../controllers/authController.js";

const router = Router();

router.post("/register", verifyToken, isOwner, authController.register);
router.post("/login", authController.login);

export default router;
