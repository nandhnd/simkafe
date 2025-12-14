import express from "express";
import transactionController from "../controllers/transactionController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, transactionController.createTransaction);
router.get("/", verifyToken, transactionController.getAllTransactions);
router.get("/:id", verifyToken, transactionController.getTransactionById);
router.put("/:id", verifyToken, transactionController.updateTransaction);
router.delete("/:id", verifyToken, transactionController.deleteTransaction);

export default router;
