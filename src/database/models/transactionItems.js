import { toWIB } from "../../helpers/timeHelper.js";

export default (sequelize, DataTypes) => {
  const TransactionItem = sequelize.define(
    "TransactionItem",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "transactions",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      menu_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "menus",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    {
      tableName: "transaction_items",
    }
  );

  TransactionItem.associate = function (models) {
    TransactionItem.belongsTo(models.Transaction, {
      foreignKey: "transaction_id",
      as: "transaction",
    });
    TransactionItem.belongsTo(models.Menu, {
      foreignKey: "menu_id",
      as: "menu",
    });
  };

  return TransactionItem;
};
