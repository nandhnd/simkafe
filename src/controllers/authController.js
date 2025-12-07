import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import db from "../database/models/index.js";

const User = db.User;

export default {
  // REGISTER (khusus owner membuat staff)
  register: async (req, res) => {
    try {
      const { name, email, phone, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          message: "Name, email, and password are required",
        });
      }

      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already used" });
      }

      const existingPhone = await User.findOne({ where: { phone } });
      if (existingPhone) {
        return res.status(400).json({ message: "Phone number already used" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: role || "staff",
      });

      return res.status(201).json({
        message: "User Registered",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  },

  // LOGIN
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Wrong password" });
      }

      const token = generateToken(user);

      return res.status(200).json({
        message: "Login success",
        token,
        user: {
          id: user.id,
          name: user.name,
          role: user.role,
          email: user.email,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: "Server Error", error });
    }
  },
};
