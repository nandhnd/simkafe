import fs from "fs";
import path from "path";
import db from "../database/models/index.js";

const { RawMaterial } = db;

export default {
  // CREATE
  async createRawMaterial(req, res) {
    try {
      const { name, quantity, uom, minimumStock } = req.body;

      let imageUrl = null;

      if (req.file) {
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        imageUrl = `${baseUrl}/uploads/rawMaterials/${req.file.filename}`;
      }

      const newRawMaterial = await RawMaterial.create({
        name,
        quantity,
        uom,
        minimumStock,
        imageUrl,
      });

      res.status(201).json({
        message: "Bahan Baku berhasil dibuat",
        data: newRawMaterial,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // READ ALL
  async getAllRawMaterials(req, res) {
    try {
      const rawMaterials = await RawMaterial.findAll();
      res.json({ data: rawMaterials });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // READ ONE
  async getRawMaterialById(req, res) {
    try {
      const { id } = req.params;
      const rawMaterial = await RawMaterial.findByPk(id);

      if (!rawMaterial)
        return res.status(404).json({ message: "Bahan baku tidak ditemukan" });

      res.json({ data: rawMaterial });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // UPDATE
  async updateRawMaterial(req, res) {
    try {
      const { name, quantity, uom, minimumStock } = req.body;
      const { id } = req.params;

      const rawMaterial = await RawMaterial.findByPk(id);
      if (!rawMaterial)
        return res.status(404).json({ message: "Bahan baku tidak ditemukan" });

      let imageUrl = rawMaterial.imageUrl;

      if (req.file) {
        // Hapus gambar lama jika ada
        if (rawMaterial.imageUrl) {
          const oldImagePath = path.join(process.cwd(), rawMaterial.imageUrl); // full path
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Gagal menghapus gambar lama:", err);
          });
        }

        const baseUrl = `${req.protocol}://${req.get("host")}`;
        imageUrl = `${baseUrl}/uploads/rawMaterials/${req.file.filename}`;
      }

      await rawMaterial.update({
        name,
        quantity,
        uom,
        minimumStock,
        imageUrl,
      });

      res.json({
        message: "Bahan baku berhasil diperbarui",
        data: rawMaterial,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // DELETE
  async deleteRawMaterial(req, res) {
    try {
      const { id } = req.params;

      const rawMaterial = await RawMaterial.findByPk(id);
      if (!rawMaterial)
        return res.status(404).json({ message: "Bahan baku tidak ditemukan" });

      await rawMaterial.destroy();

      res.json({
        message: "Bahan baku berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
