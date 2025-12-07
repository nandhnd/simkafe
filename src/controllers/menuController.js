import fs from "fs";
import path from "path";
import db from "../database/models/index.js";

const { Menu } = db;

export default {
  // CREATE
  async createMenu(req, res) {
    try {
      const { name, description, price, category } = req.body;

      const imageUrl = req.file
        ? "/" + req.file.path.replace(/\\/g, "/")
        : null;

      const newMenu = await Menu.create({
        name,
        description,
        price,
        category,
        imageUrl,
      });

      res.status(201).json({
        message: "Menu berhasil dibuat",
        data: newMenu,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // READ ALL
  async getAllMenus(req, res) {
    try {
      const menus = await Menu.findAll();
      res.json({ data: menus });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // READ ONE
  async getMenuById(req, res) {
    try {
      const { id } = req.params;
      const menu = await Menu.findByPk(id);

      if (!menu)
        return res.status(404).json({ message: "Menu tidak ditemukan" });

      res.json({ data: menu });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // UPDATE
  async updateMenu(req, res) {
    try {
      const { name, description, price, category } = req.body;
      const { id } = req.params;

      const menu = await Menu.findByPk(id);
      if (!menu)
        return res.status(404).json({ message: "Menu tidak ditemukan" });

      let imageUrl = menu.imageUrl;

      if (req.file) {
        // Hapus gambar lama jika ada
        if (menu.imageUrl) {
          const oldImagePath = path.join(process.cwd(), menu.imageUrl); // full path
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Gagal menghapus gambar lama:", err);
          });
        }

        // Set image baru
        imageUrl = "/" + req.file.path.replace(/\\/g, "/");
      }

      await menu.update({
        name,
        description,
        price,
        category,
        imageUrl,
      });

      res.json({
        message: "Menu berhasil diperbarui",
        data: menu,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // DELETE
  async deleteMenu(req, res) {
    try {
      const { id } = req.params;

      const menu = await Menu.findByPk(id);
      if (!menu)
        return res.status(404).json({ message: "Menu tidak ditemukan" });

      await menu.destroy();

      res.json({
        message: "Menu berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
