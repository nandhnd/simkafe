/** @type {import('sequelize-cli').Migration} */

import bcrypt from "bcrypt";

export async function up(queryInterface, Sequelize) {
  const hashedPassword = await bcrypt.hash("owner123", 10);

  return queryInterface.bulkInsert("Users", [
    {
      name: "Owner",
      email: "owner@simkafe.com",
      phone: "081234567890",
      role: "owner",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(queryInterface, Sequelize) {
  return queryInterface.bulkDelete("Users", { email: "owner@simkafe.com" });
}
