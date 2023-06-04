const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const Expense = sequelize.define("expense", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  amount: Sequelize.STRING,
  description: {
    type: Sequelize.STRING,
  },
  categoru: {
    type: Sequelize.STRING,
  },
});

module.exports = Expense;
