const { DataTypes, Model, Op } = require('sequelize');
const sequelize = require('../config/database');

class AIUsage extends Model {}

AIUsage.init({
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
  operation: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['text_generation', 'component_generation', 'component_improvement']]
    }
  },
  promptTokens: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  completionTokens: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  totalTokens: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  creditsUsed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  purchasedCreditsUsed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  subscriptionCreditsUsed: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'ai_usage',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false
});

module.exports = AIUsage; 