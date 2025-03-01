const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  subscription: {
    status: {
      type: String,
      enum: ['none', 'active', 'canceled', 'expired'],
      default: 'none'
    },
    plan: {
      type: String,
      enum: ['free', 'basic', 'pro', 'basic_ai', 'pro_ai'],
      default: 'free'
    },
    stripeCustomerId: {
      type: String
    },
    stripeSubscriptionId: {
      type: String
    },
    currentPeriodStart: {
      type: Date
    },
    currentPeriodEnd: {
      type: Date
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false
    }
  },
  // AI credits are stored separately from subscription
  aiCredits: {
    type: Number,
    default: 0
  },
  // Array of payment history
  paymentHistory: [{
    stripePaymentId: String,
    amount: Number,
    currency: String,
    status: String,
    description: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password validity
UserSchema.methods.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Method to check if user has active AI subscription
UserSchema.methods.hasActiveAISubscription = function() {
  const now = new Date();
  return (
    this.subscription.status === 'active' &&
    (this.subscription.plan === 'basic_ai' || this.subscription.plan === 'pro_ai') &&
    this.subscription.currentPeriodEnd > now
  );
};

// Method to calculate total available AI credits
UserSchema.methods.getAvailableAICredits = function() {
  let baseCredits = 0;
  
  // Add credits from subscription
  if (this.hasActiveAISubscription()) {
    baseCredits = this.subscription.plan === 'basic_ai' ? 100 : 300;
  }
  
  // Add purchased credits
  return baseCredits + this.aiCredits;
};

// Method to add AI credits (purchased)
UserSchema.methods.addAICredits = function(amount) {
  this.aiCredits += amount;
  return this.save();
};

// Method to record a payment
UserSchema.methods.addPaymentRecord = function(paymentData) {
  this.paymentHistory.push({
    stripePaymentId: paymentData.id,
    amount: paymentData.amount / 100, // Convert from cents
    currency: paymentData.currency,
    status: paymentData.status,
    description: paymentData.description
  });
  
  return this.save();
};

// Generate safe user object to return to client (removes sensitive data)
UserSchema.methods.toSafeObject = function() {
  const obj = this.toObject();
  
  // Remove sensitive information
  delete obj.password;
  delete obj.subscription.stripeCustomerId;
  delete obj.subscription.stripeSubscriptionId;
  
  // Calculate subscription status and credits for easy client use
  obj.hasActiveSubscription = this.hasActiveAISubscription();
  obj.availableAICredits = this.getAvailableAICredits();
  
  return obj;
};

module.exports = mongoose.model('User', UserSchema);