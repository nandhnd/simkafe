import jwt from "jsonwebtoken";
import db from "../database/models/index.js";

const { User } = db;

export const verifyToken = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];

    if (!header) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Cek apakah user masih aktif
    const user = await User.findByPk(decoded.id);

    if (!user || user.isActive === false) {
      return res.status(403).json({ message: "Account disabled" });
    }

    req.user = user; // menyimpan data user untuk digunakan di controller

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: err.message,
    });
  }
};
