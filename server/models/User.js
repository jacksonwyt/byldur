// server/models/User.js - Updated with GitHub fields
const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

class User extends Model {
  // Instance method to check password validity
  async isValidPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Method to check if user has active AI subscription
  hasActiveAISubscription() {
    const now = new Date();
    return (
      this.subscription?.status === 'active' &&
      (this.subscription?.plan === 'basic_ai' || this.subscription?.plan === 'pro_ai') &&
      this.subscription?.currentPeriodEnd > now
    );
  }

  // Method to add AI credits (purchased)
  async addAICredits(amount) {
    this.aiCredits += amount;
    return this.save();
  }

  // Generate safe user object to return to client (removes sensitive data)
  toSafeObject() {
    const obj = this.toJSON();
    
    // Remove sensitive information
    delete obj.password;
    delete obj.stripeCustomerId;
    // Comment out GitHub token since it's not in the database yet
    // delete obj.githubToken; // Don't expose GitHub token
    
    return obj;
  }
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  stripeCustomerId: {
    type: DataTypes.STRING
  },
  aiCredits: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lastLogin: {
    type: DataTypes.DATE
  },
  // Comment out GitHub-related fields
  /*
  githubToken: {
    type: DataTypes.STRING
  },
  githubConnected: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  githubUsername: {
    type: DataTypes.STRING
  },
  */
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'user',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
});

// Hook for password hashing
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

module.exports = User;