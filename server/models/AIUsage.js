const mongoose = require('mongoose');

/**
 * AI Usage Model
 * 
 * Tracks individual AI usage events by users
 */
const AIUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  operation: {
    type: String,
    required: true,
    enum: ['text_generation', 'component_generation', 'component_improvement'],
    index: true
  },
  promptTokens: {
    type: Number,
    required: true,
    default: 0
  },
  completionTokens: {
    type: Number,
    required: true,
    default: 0
  },
  totalTokens: {
    type: Number,
    required: true,
    default: 0
  },
  creditsUsed: {
    type: Number,
    required: true,
    default: 1
  },
  purchasedCreditsUsed: {
    type: Number,
    required: true,
    default: 0
  },
  subscriptionCreditsUsed: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Add method to get total usage for a user in a time period
AIUsageSchema.statics.getUserUsage = async function(userId, startDate, endDate) {
  const query = { userId };
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = startDate;
    if (endDate) query.createdAt.$lte = endDate;
  }
  
  const result = await this.aggregate([
    { $match: query },
    { $group: {
      _id: null,
      totalPromptTokens: { $sum: '$promptTokens' },
      totalCompletionTokens: { $sum: '$completionTokens' },
      totalTokens: { $sum: '$totalTokens' },
      totalCreditsUsed: { $sum: '$creditsUsed' },
      totalPurchasedCreditsUsed: { $sum: '$purchasedCreditsUsed' },
      totalSubscriptionCreditsUsed: { $sum: '$subscriptionCreditsUsed' },
      usageCount: { $sum: 1 }
    }}
  ]);
  
  return result[0] || {
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    totalTokens: 0,
    totalCreditsUsed: 0,
    totalPurchasedCreditsUsed: 0,
    totalSubscriptionCreditsUsed: 0,
    usageCount: 0
  };
};

// Add method to get usage breakdown by operation type
AIUsageSchema.statics.getUserUsageByOperation = async function(userId, startDate, endDate) {
  const query = { userId };
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = startDate;
    if (endDate) query.createdAt.$lte = endDate;
  }
  
  return this.aggregate([
    { $match: query },
    { $group: {
      _id: '$operation',
      totalPromptTokens: { $sum: '$promptTokens' },
      totalCompletionTokens: { $sum: '$completionTokens' },
      totalTokens: { $sum: '$totalTokens' },
      totalCreditsUsed: { $sum: '$creditsUsed' },
      usageCount: { $sum: 1 }
    }},
    { $project: {
      operation: '$_id',
      totalPromptTokens: 1,
      totalCompletionTokens: 1,
      totalTokens: 1,
      totalCreditsUsed: 1,
      usageCount: 1,
      _id: 0
    }}
  ]);
};

// Add method to get daily usage for a specific period
AIUsageSchema.statics.getUserDailyUsage = async function(userId, startDate, endDate) {
  const query = { userId };
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = startDate;
    if (endDate) query.createdAt.$lte = endDate;
  }
  
  return this.aggregate([
    { $match: query },
    { $group: {
      _id: { 
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
        day: { $dayOfMonth: '$createdAt' }
      },
      totalTokens: { $sum: '$totalTokens' },
      totalCreditsUsed: { $sum: '$creditsUsed' },
      usageCount: { $sum: 1 }
    }},
    { $project: {
      date: {
        $dateFromParts: {
          year: '$_id.year',
          month: '$_id.month',
          day: '$_id.day'
        }
      },
      totalTokens: 1,
      totalCreditsUsed: 1,
      usageCount: 1,
      _id: 0
    }},
    { $sort: { date: 1 } }
  ]);
};

module.exports = mongoose.model('AIUsage', AIUsageSchema); 