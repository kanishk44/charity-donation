const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Charity = require("./charity");

const Donation = sequelize.define("Donation", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "completed", "failed"),
    defaultValue: "pending",
  },
  receiptNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  receiptUrl: {
    type: DataTypes.STRING,
  },
});

// Set up associations
User.hasMany(Donation);
Donation.belongsTo(User);
Charity.hasMany(Donation);
Donation.belongsTo(Charity);

module.exports = Donation;
