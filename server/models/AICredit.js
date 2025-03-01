const mongoose = require('mongoose');

const AICreditSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
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
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Static method to process a completed payment
AICreditSchema.statics.processCompletedPayment = async function(paymentId, User) {
  const creditPurchase = await this.findOne({ paymentId });
  
  if (!creditPurchase) {
    throw new Error('Credit purchase not found');
  }
  
  if (creditPurchase.status === 'completed') {
    return { success: true, alreadyProcessed: true };
  }
  
  // Find the user and add credits
  const user = await User.findById(creditPurchase.userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Update the credit purchase status
  creditPurchase.status = 'completed';
  await creditPurchase.save();
  
  // Add credits to the user
  await user.addAICredits(creditPurchase.amount);
  
  return { success: true, credits: creditPurchase.amount };
};

module.exports = mongoose.model('AICredit', AICreditSchema); 