import { toWIB } from "../../helpers/timeHelper.js";

export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      phone: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.ENUM("owner", "staff"), defaultValue: "staff" },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
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
      tableName: "Users",
    }
  );

  return User;
};
