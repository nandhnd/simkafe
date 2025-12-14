import { toWIB } from "../../helpers/timeHelper.js";

export default (sequelize, DataTypes) => {
  const Transaction = sequelize.define(
    "Transaction",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      trx_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      cashier_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      customer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tax: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      total: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.ENUM("cash", "qris"),
        allowNull: false,
      },
      payment_amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      change: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: DataTypes.DATE,
        get() {
          return toWIB(this.getDataValue("createdAt"));
        },
      },
      updatedAt: {
        type: DataTypes.DATE,
        get() {
          return toWIB(this.getDataValue("updatedAt"));
        },
      },
    },
    { tableName: "transactions" }
  );

  Transaction.associate = function (models) {
    Transaction.hasMany(models.TransactionItem, {
      foreignKey: "transaction_id",
      as: "items",
    });
  };

  return Transaction;
};
