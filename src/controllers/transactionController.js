import db from "../database/models/index.js";
import { sequelize } from "../database/models/index.js";
import { toWIB } from "../helpers/timeHelper.js";

const { Transaction, TransactionItem, Menu } = db;

export default {
  // CREATE
  async createTransaction(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const {
        cashier_id,
        customer,
        tax,
        total,
        payment_method,
        payment_amount,
        items, // array of items: [{menu_id, quantity, price}]
      } = req.body;

      // Validasi data yang diperlukan
      if (
        !cashier_id ||
        !customer ||
        !total ||
        !payment_method ||
        !payment_amount ||
        !items ||
        !Array.isArray(items)
      ) {
        return res.status(400).json({
          error: true,
          message: "Missing required fields or items must be an array",
        });
      }

      // Generate transaction ID (bisa disesuaikan dengan format yang diinginkan)
      const trx_id = `TRX-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

      // Hitung kembalian
      const change = Math.max(0, payment_amount - total);

      // Create main transaction
      const newTransaction = await Transaction.create(
        {
          trx_id,
          cashier_id,
          customer,
          tax: tax || 0,
          total,
          payment_method,
          payment_amount,
          change,
        },
        { transaction }
      );

      // Create transaction items
      const transactionItems = [];

      for (const item of items) {
        // Validasi setiap item
        if (!item.menu_id || !item.quantity || item.quantity <= 0) {
          await transaction.rollback();
          return res.status(400).json({
            error: true,
            message:
              "Invalid item data. Each item must have menu_id and quantity > 0",
          });
        }

        // Cek apakah menu exists dan dapatkan harga jika tidak disediakan
        let itemPrice = item.price;
        if (!itemPrice) {
          const menu = await Menu.findByPk(item.menu_id, { transaction });
          if (!menu) {
            await transaction.rollback();
            return res.status(404).json({
              error: true,
              message: `Menu with id ${item.menu_id} not found`,
            });
          }
          itemPrice = menu.price;
        }

        const transactionItem = await TransactionItem.create(
          {
            transaction_id: newTransaction.id,
            menu_id: item.menu_id,
            price: itemPrice,
            quantity: item.quantity,
          },
          { transaction }
        );

        transactionItems.push(transactionItem);
      }

      // Commit transaction
      await transaction.commit();

      // Get transaction with items for response
      const completeTransaction = await Transaction.findOne({
        where: { id: newTransaction.id },
        include: [
          {
            model: TransactionItem,
            as: "items",
            include: [
              {
                model: Menu,
                as: "menu",
              },
            ],
          },
        ],
      });

      return res.status(201).json({
        status: "success",
        message: "Transaction created successfully",
        data: completeTransaction,
      });
    } catch (error) {
      // Rollback transaction jika ada error
      if (transaction.finished !== "commit") {
        await transaction.rollback();
      }

      console.error("Error creating transaction:", error);

      return res.status(500).json({
        error: true,
        message: error.message || "Failed to create transaction",
      });
    }
  },

  // READ ALL
  async getAllTransactions(req, res) {
    try {
      const transactions = await Transaction.findAll({
        include: [
          {
            model: TransactionItem,
            as: "items",
            include: [
              {
                model: Menu,
                as: "menu",
              },
            ],
          },
        ],
      });
      res.json({ data: transactions });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // READ ONE
  async getTransactionById(req, res) {
    try {
      const { id } = req.params;
      const transaction = await Transaction.findByPk(id);

      if (!transaction)
        return res.status(404).json({ message: "Transaction tidak ditemukan" });

      res.json({ data: transaction });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // UPDATE
  async updateTransaction(req, res) {
    try {
      const { name, description, price, category, isAvailable } = req.body;
      const { id } = req.params;

      const Transaction = await Transaction.findByPk(id);
      if (!Transaction)
        return res.status(404).json({ message: "Transaction tidak ditemukan" });

      let imageUrl = Transaction.imageUrl;

      await Transaction.update({
        name,
        description,
        price,
        category,
        imageUrl,
        isAvailable,
      });

      res.json({
        message: "Transaction berhasil diperbarui",
        data: Transaction,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // DELETE
  async deleteTransaction(req, res) {
    try {
      const { id } = req.params;

      const Transaction = await Transaction.findByPk(id);
      if (!Transaction)
        return res.status(404).json({ message: "Transaction tidak ditemukan" });

      await Transaction.destroy();

      res.json({
        message: "Transaction berhasil dihapus",
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
