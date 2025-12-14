export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("transaction_items", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    transaction_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "transactions",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    menu_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "menus",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    price: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("transaction_items");
}
