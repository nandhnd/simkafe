import { toWIB } from "../../helpers/timeHelper.js";

export default (sequelize, DataTypes) => {
  const Menu = sequelize.define(
    "Menu",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
      },
      imageUrl: {
        type: DataTypes.STRING,
      },
      isAvailable: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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
    { tableName: "Menus" }
  );

  return Menu;
};
