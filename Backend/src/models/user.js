const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Role: {
    type: DataTypes.ENUM('admin', 'doctor', 'staff', 'patient'),
    allowNull: false,
    defaultValue: 'patient'
  },
  RefID: {
    type: DataTypes.INTEGER,
    comment: 'References PatientID, DoctorID, or StaffID'
  },
  IsActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  LastLogin: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'Users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.Password) {
        user.Password = await bcrypt.hash(user.Password, 10);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('Password')) {
        user.Password = await bcrypt.hash(user.Password, 10);
      }
    }
  }
});

User.prototype.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.Password);
};

User.prototype.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this.UserID, role: this.Role, refId: this.RefID },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

module.exports = User;