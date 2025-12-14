export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("raw_materials", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      uom: {
        type: Sequelize.ENUM("pcs", "gram", "ml", "kg", "liter"),
        allowNull: false,
      },
      minimumStock: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("raw_materials");
  },
};
