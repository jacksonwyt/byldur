const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class PaymentHistory extends Model {}

PaymentHistory.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  stripePaymentId: {
    type: DataTypes.STRING
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  sequelize,
  modelName: 'payment_history',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false
});

module.exports = PaymentHistory; 