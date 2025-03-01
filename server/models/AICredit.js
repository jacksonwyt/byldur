const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class AICredit extends Model {
  // Static method to process a completed payment
  static async processCompletedPayment(paymentId, userId) {
    // Find the credit purchase
    const creditPurchase = await this.findOne({ 
      where: { paymentId }
    });
    
    if (!creditPurchase) {
      throw new Error('Credit purchase not found');
    }
    
    if (creditPurchase.status === 'completed') {
      return { success: true, alreadyProcessed: true };
    }
    
    // Transaction will be handled in the controller
    const User = require('./User');
    
    // Find the user
    const user = await User.findByPk(creditPurchase.userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Update the credit purchase status
    creditPurchase.status = 'completed';
    await creditPurchase.save();
    
    // Add credits to the user
    await user.addAICredits(creditPurchase.amount);
    
    return { success: true, credits: creditPurchase.amount };
  }
}

AICredit.init({
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
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  priceInCents: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  paymentId: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'completed', 'failed', 'refunded']]
    }
  }
}, {
  sequelize,
  modelName: 'ai_credit',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false
});

module.exports = AICredit; 