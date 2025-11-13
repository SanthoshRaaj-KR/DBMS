
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Billing = sequelize.define('Billing', {
  BillingID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  InvoiceNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  PatientID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  AppointmentID: {
    type: DataTypes.INTEGER
  },
  BillingDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  TotalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  DiscountAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  TaxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  NetAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  Status: {
    type: DataTypes.ENUM('Pending', 'Partial', 'Paid', 'Cancelled'),
    defaultValue: 'Pending'
  },
  Items: {
    type: DataTypes.JSONB,
    comment: 'Array of billing items: consultation, tests, procedures'
  }
}, {
  tableName: 'Billing',
  timestamps: true,
  hooks: {
    beforeCreate: (bill) => {
      if (!bill.InvoiceNumber) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        // Add more entropy with microseconds from performance API if available
        const extraRandom = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        bill.InvoiceNumber = `INV${timestamp}${random}${extraRandom}`;
      }
    }
  }
});

module.exports = Billing;
