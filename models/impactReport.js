const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Charity = require("./charity");

const ImpactReport = sequelize.define("ImpactReport", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  period: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  beneficiariesCount: {
    type: DataTypes.INTEGER,
  },
  achievements: {
    type: DataTypes.JSON,
  },
  images: {
    type: DataTypes.JSON,
  },
});

// Set up association with proper foreign key
ImpactReport.belongsTo(Charity, {
  foreignKey: {
    name: "CharityId",
    allowNull: false,
  },
});

Charity.hasMany(ImpactReport, {
  foreignKey: "CharityId",
});

module.exports = ImpactReport;
