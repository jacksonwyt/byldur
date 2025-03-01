const { DataTypes, Model, Op } = require('sequelize');
const sequelize = require('../config/database');

class Subscription extends Model {
  // Static method to find active subscription for a user
  static async findActiveForUser(userId) {
    const now = new Date();
    return await this.findOne({
      where: {
        userId,
        status: 'active',
        currentPeriodEnd: {
          [Op.gt]: now
        }
      }
    });
  }

  // Static method to cancel a subscription
  static async cancelSubscription(subscriptionId) {
    const subscription = await this.findByPk(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }
    
    subscription.status = 'canceled';
    subscription.autoRenew = false;
    return await subscription.save();
  }
}

Subscription.init({
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
  planType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['basic', 'pro', 'basic_ai', 'pro_ai', 'free']]
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'canceled', 'expired']]
    }
  },
  stripeSubscriptionId: {
    type: DataTypes.STRING
  },
  currentPeriodStart: {
    type: DataTypes.DATE
  },
  currentPeriodEnd: {
    type: DataTypes.DATE
  },
  cancelAtPeriodEnd: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  autoRenew: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'subscription',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

module.exports = Subscription; 