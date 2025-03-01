const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planType: {
    type: String,
    enum: ['basic', 'pro'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'canceled', 'expired'],
    default: 'active'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  priceInCents: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true
  },
  paymentId: {
    type: String
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware to update the updatedAt field
SubscriptionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Static method to find active subscription for a user
SubscriptionSchema.statics.findActiveForUser = function(userId) {
  return this.findOne({
    userId,
    status: 'active',
    endDate: { $gt: new Date() }
  });
};

// Static method to cancel a subscription
SubscriptionSchema.statics.cancelSubscription = async function(subscriptionId) {
  const subscription = await this.findById(subscriptionId);
  if (!subscription) {
    throw new Error('Subscription not found');
  }
  
  subscription.status = 'canceled';
  subscription.autoRenew = false;
  return subscription.save();
};

module.exports = mongoose.model('Subscription', SubscriptionSchema); 