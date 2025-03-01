const { User, AIUsage, AICredit, Subscription } = require('../models');
const withTransaction = require('../utils/transactionWrapper');
const { Op } = require('sequelize');

// Get the AI usage for the current user
exports.getAIUsage = async (req, res) => {
  try {
    const aiUsage = await AIUsage.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 30 // Last 30 operations
    });
    
    // Get total tokens used
    const totalTokens = await AIUsage.sum('tokens', {
      where: { userId: req.user.id }
    });
    
    // Get total cost
    const totalCost = await AIUsage.sum('cost', {
      where: { userId: req.user.id }
    });
    
    res.json({
      aiUsage,
      statistics: {
        totalTokens: totalTokens || 0,
        totalCost: totalCost || 0
      }
    });
  } catch (error) {
    console.error('Get AI usage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Record a new AI usage
exports.recordUsage = withTransaction(async (req, res, transaction) => {
  try {
    const { operation, model, prompt, completion, tokens, cost } = req.body;
    
    // Verify if user has enough credits
    const user = await User.findByPk(req.user.id, {
      include: [Subscription],
      transaction
    });
    
    // Check if user has an active subscription
    const hasActiveSubscription = user.Subscription && 
      user.Subscription.status === 'active' && 
      !user.Subscription.cancelAtPeriodEnd;
    
    // If no active subscription, check if user has enough AI credits
    if (!hasActiveSubscription) {
      // Get available credits
      const totalCredits = await AICredit.sum('amount', {
        where: { 
          userId: req.user.id,
          status: 'completed'
        },
        transaction
      }) || 0;
      
      // Get total usage
      const totalUsage = await AIUsage.sum('cost', {
        where: { userId: req.user.id },
        transaction
      }) || 0;
      
      // Calculate remaining credits
      const remainingCredits = totalCredits - totalUsage;
      
      if (remainingCredits < cost) {
        return res.status(402).json({
          message: 'Insufficient AI credits',
          remainingCredits
        });
      }
    }
    
    // Record the usage
    const aiUsage = await AIUsage.create({
      userId: req.user.id,
      operation,
      model,
      prompt,
      completion,
      tokens,
      cost
    }, { transaction });
    
    res.status(201).json({ aiUsage });
  } catch (error) {
    console.error('Record AI usage error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get AI credits for the current user
exports.getAICredits = async (req, res) => {
  try {
    // Get all completed credit purchases
    const credits = await AICredit.findAll({
      where: { 
        userId: req.user.id,
        status: 'completed'
      },
      order: [['createdAt', 'DESC']]
    });
    
    // Get total credits purchased
    const totalCredits = await AICredit.sum('amount', {
      where: { 
        userId: req.user.id,
        status: 'completed'
      }
    }) || 0;
    
    // Get total usage cost
    const totalUsage = await AIUsage.sum('cost', {
      where: { userId: req.user.id }
    }) || 0;
    
    // Calculate remaining credits
    const remainingCredits = totalCredits - totalUsage;
    
    res.json({
      credits,
      statistics: {
        totalCredits,
        totalUsage,
        remainingCredits
      }
    });
  } catch (error) {
    console.error('Get AI credits error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Purchase AI credits
exports.purchaseCredits = withTransaction(async (req, res, transaction) => {
  try {
    const { amount, paymentMethodId } = req.body;
    
    // Validate amount
    const creditAmount = parseInt(amount, 10);
    if (!creditAmount || creditAmount <= 0) {
      return res.status(400).json({ message: 'Valid credit amount is required' });
    }
    
    // Create a new credit purchase record
    const aiCredit = await AICredit.create({
      userId: req.user.id,
      amount: creditAmount,
      priceInCents: creditAmount * 50, // $0.50 per credit
      status: 'pending'
    }, { transaction });
    
    // In a real implementation, you would process the payment with Stripe here
    // and update the status based on the payment result
    
    // For now, we'll just assume payment is successful
    aiCredit.status = 'completed';
    await aiCredit.save({ transaction });
    
    res.status(201).json({ 
      credit: aiCredit,
      message: 'AI credits purchased successfully'
    });
  } catch (error) {
    console.error('Purchase AI credits error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}); 