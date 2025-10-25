
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  PaymentID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  BillingID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  Amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  PaymentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  PaymentMethod: {
    type: DataTypes.ENUM('Cash', 'Card', 'UPI', 'Insurance'),
    allowNull: false
  },
  TransactionID: {
    type: DataTypes.STRING
  },
  Notes: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'Payments',
  timestamps: true
});

module.exports = Payment;
