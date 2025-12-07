import db from "../database/models/index.js";
import bcrypt from "bcrypt";

const { User } = db;

export default {
  // GET ALL USERS
  async getAll(req, res) {
    try {
      const users = await User.findAll({
        attributes: [
          "id",
          "name",
          "email",
          "phone",
          "role",
          "isActive",
          "createdAt",
        ],
      });

      return res.status(200).json({ users });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server Error", error: err.message });
    }
  },

  // GET USER BY ID
  async getById(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id, {
        attributes: [
          "id",
          "name",
          "email",
          "phone",
          "role",
          "isActive",
          "createdAt",
        ],
      });

      if (!user) return res.status(404).json({ message: "User not found" });

      return res.status(200).json({ user });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server Error", error: err.message });
    }
  },

  // CREATE NEW STAFF USER
  async create(req, res) {
    try {
      const { name, email, phone, password, role } = req.body;

      if (!name || !email || !password) {
        return res
          .status(400)
          .json({ message: "Name, email, and password required" });
      }

      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail)
        return res.status(400).json({ message: "Email already used" });

      const existingPhone = await User.findOne({ where: { phone } });
      if (existingPhone)
        return res.status(400).json({ message: "Phone number already used" });

      const hash = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name,
        email,
        phone,
        password: hash,
        role: role || "staff",
      });

      return res.status(201).json({
        message: "User created",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server Error", error: err.message });
    }
  },

  // UPDATE USER
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, email, phone, password, role } = req.body;

      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      let hash = user.password;
      if (password) {
        hash = await bcrypt.hash(password, 10);
      }

      await user.update({
        name: name || user.name,
        email: email || user.email,
        phone: phone || user.phone,
        password: hash,
        role: role || user.role,
      });

      return res.status(200).json({ message: "User updated", user });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server Error", error: err.message });
    }
  },

  // DEACTIVATE USER (soft delete)
  async deactivate(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      await user.update({ isActive: false });

      return res.status(200).json({ message: "User deactivated" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server Error", error: err.message });
    }
  },

  // REACTIVATE USER
  async activate(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      await user.update({ isActive: true });

      return res.status(200).json({ message: "User activated" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server Error", error: err.message });
    }
  },
};
