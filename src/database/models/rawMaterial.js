import { toWIB } from "../../helpers/timeHelper.js";

export default (sequelize, DataTypes) => {
  const RawMaterial = sequelize.define(
    "RawMaterial",
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
      quantity: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      uom: {
        type: DataTypes.ENUM(
          "pcs",
          "gram",
          "ml",
          "kg",
          "liter",
          "unit",
          "pack"
        ),
        allowNull: false,
      },
      minimumStock: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
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
    { tableName: "raw_materials" }
  );

  return RawMaterial;
};
