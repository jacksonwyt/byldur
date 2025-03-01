const express = require('express');
const router = express.Router();
const axios = require('axios');
const { isAuthenticated } = require('../middleware/auth');
const User = require('../models/User');
const AIUsage = require('../models/AIUsage');

// ========== AI SUBSCRIPTION STATUS ==========

/**
 * @route GET /api/ai/usage
 * @desc Get current user's AI usage and subscription status
 * @access Private
 */
router.get('/usage', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user with subscription details
    const user = await User.findById(userId).select('subscription aiCredits');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Get AI usage history
    const usageHistory = await AIUsage.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);
    
    // Check if user has active subscription
    const hasActiveSubscription = user.subscription && 
      user.subscription.status === 'active' && 
      user.subscription.plan && 
      (user.subscription.plan === 'basic_ai' || user.subscription.plan === 'pro_ai') &&
      new Date(user.subscription.currentPeriodEnd) > new Date();
    
    // Calculate available credits
    const availableCredits = hasActiveSubscription ? 
      (user.aiCredits + (user.subscription.plan === 'basic_ai' ? 100 : 300)) : 
      user.aiCredits;
    
    return res.json({
      success: true,
      hasActiveSubscription,
      subscriptionPlan: user.subscription?.plan || null,
      subscriptionStatus: user.subscription?.status || null,
      currentPeriodEnd: user.subscription?.currentPeriodEnd || null,
      baseCredits: hasActiveSubscription ? 
        (user.subscription.plan === 'basic_ai' ? 100 : 300) : 0,
      purchasedCredits: user.aiCredits || 0,
      availableCredits,
      usageHistory
    });
  } catch (error) {
    console.error('Error getting AI usage:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ========== AI TEXT GENERATION ==========

/**
 * @route POST /api/ai/generate/text
 * @desc Generate text using Claude API
 * @access Private
 */
router.post('/generate/text', isAuthenticated, async (req, res) => {
  try {
    const { prompt, maxTokens = 1000 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }
    
    const userId = req.user.id;
    
    // Get user with subscription details
    const user = await User.findById(userId).select('subscription aiCredits');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has active subscription or credits
    const hasActiveSubscription = user.subscription && 
      user.subscription.status === 'active' && 
      user.subscription.plan && 
      (user.subscription.plan === 'basic_ai' || user.subscription.plan === 'pro_ai') &&
      new Date(user.subscription.currentPeriodEnd) > new Date();
    
    // Calculate available credits
    const subscriptionCredits = hasActiveSubscription ? 
      (user.subscription.plan === 'basic_ai' ? 100 : 300) : 0;
    
    const availableCredits = user.aiCredits + subscriptionCredits;
    
    // Check if user has enough credits
    if (availableCredits <= 0) {
      return res.status(402).json({
        message: 'Insufficient AI credits. Please purchase credits or subscribe to a plan.'
      });
    }
    
    // Call Claude API
    const claudeResponse = await callClaudeAPI(prompt, maxTokens);
    
    // Calculate token usage and cost (simplified calculation)
    const tokensUsed = Math.min(claudeResponse.usage.output_tokens, maxTokens);
    const creditsUsed = Math.ceil(tokensUsed / 1000); // 1 credit per 1000 tokens
    
    // Deduct credits from purchased credits first, then subscription
    let remainingCreditsToDeduct = creditsUsed;
    let purchasedCreditsUsed = 0;
    let subscriptionCreditsUsed = 0;
    
    if (user.aiCredits > 0) {
      purchasedCreditsUsed = Math.min(user.aiCredits, remainingCreditsToDeduct);
      remainingCreditsToDeduct -= purchasedCreditsUsed;
      user.aiCredits -= purchasedCreditsUsed;
    }
    
    // The rest comes from subscription
    subscriptionCreditsUsed = remainingCreditsToDeduct;
    
    // Save updated user credits
    await user.save();
    
    // Record usage
    await AIUsage.create({
      userId,
      operation: 'text_generation',
      promptTokens: claudeResponse.usage.input_tokens,
      completionTokens: claudeResponse.usage.output_tokens,
      totalTokens: claudeResponse.usage.input_tokens + claudeResponse.usage.output_tokens,
      creditsUsed,
      purchasedCreditsUsed,
      subscriptionCreditsUsed
    });
    
    return res.json({
      success: true,
      result: claudeResponse.content[0].text,
      creditsUsed,
      creditsRemaining: user.aiCredits + subscriptionCredits - creditsUsed,
      usage: claudeResponse.usage
    });
  } catch (error) {
    console.error('Error generating text with Claude:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route POST /api/ai/generate/component
 * @desc Generate a component using Claude API
 * @access Private
 */
router.post('/generate/component', isAuthenticated, async (req, res) => {
  try {
    const { description, componentType, style } = req.body;
    
    if (!description) {
      return res.status(400).json({ message: 'Component description is required' });
    }
    
    const userId = req.user.id;
    
    // Get user with subscription details
    const user = await User.findById(userId).select('subscription aiCredits');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has active subscription or credits
    const hasActiveSubscription = user.subscription && 
      user.subscription.status === 'active' && 
      user.subscription.plan && 
      (user.subscription.plan === 'basic_ai' || user.subscription.plan === 'pro_ai') &&
      new Date(user.subscription.currentPeriodEnd) > new Date();
    
    // Calculate available credits
    const subscriptionCredits = hasActiveSubscription ? 
      (user.subscription.plan === 'basic_ai' ? 100 : 300) : 0;
    
    const availableCredits = user.aiCredits + subscriptionCredits;
    
    // Check if user has enough credits
    if (availableCredits <= 0) {
      return res.status(402).json({
        message: 'Insufficient AI credits. Please purchase credits or subscribe to a plan.'
      });
    }
    
    // Construct prompt based on component type and style
    let prompt = `Generate HTML and CSS for a ${componentType || 'web component'} that ${description}. `;
    
    if (style) {
      prompt += `The design style should be ${style}. `;
    }
    
    prompt += `Return ONLY the HTML and CSS code with no explanations. HTML should go first, followed by CSS wrapped in <style> tags. 
    The HTML should be clean, semantic and accessible. 
    The CSS should use modern best practices.`;
    
    // Call Claude API with high max tokens for components
    const maxTokens = 4000;
    const claudeResponse = await callClaudeAPI(prompt, maxTokens);
    
    // Calculate token usage and cost
    const tokensUsed = Math.min(claudeResponse.usage.output_tokens, maxTokens);
    const creditsUsed = Math.ceil(tokensUsed / 1000) + 1; // Component generation costs more
    
    // Deduct credits from purchased credits first, then subscription
    let remainingCreditsToDeduct = creditsUsed;
    let purchasedCreditsUsed = 0;
    let subscriptionCreditsUsed = 0;
    
    if (user.aiCredits > 0) {
      purchasedCreditsUsed = Math.min(user.aiCredits, remainingCreditsToDeduct);
      remainingCreditsToDeduct -= purchasedCreditsUsed;
      user.aiCredits -= purchasedCreditsUsed;
    }
    
    // The rest comes from subscription
    subscriptionCreditsUsed = remainingCreditsToDeduct;
    
    // Save updated user credits
    await user.save();
    
    // Record usage
    await AIUsage.create({
      userId,
      operation: 'component_generation',
      promptTokens: claudeResponse.usage.input_tokens,
      completionTokens: claudeResponse.usage.output_tokens,
      totalTokens: claudeResponse.usage.input_tokens + claudeResponse.usage.output_tokens,
      creditsUsed,
      purchasedCreditsUsed,
      subscriptionCreditsUsed
    });
    
    // Parse response to separate HTML and CSS
    const response = claudeResponse.content[0].text;
    let html = '', css = '';
    
    // Extract HTML and CSS from response
    const styleTagMatch = response.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    
    if (styleTagMatch) {
      css = styleTagMatch[1].trim();
      html = response.replace(styleTagMatch[0], '').trim();
    } else {
      // If no style tags, try to separate based on content
      const htmlCssArray = response.split('```css');
      
      if (htmlCssArray.length > 1) {
        html = htmlCssArray[0].replace('```html', '').replace('```', '').trim();
        css = htmlCssArray[1].replace('```', '').trim();
      } else {
        html = response;
      }
    }
    
    return res.json({
      success: true,
      html,
      css,
      creditsUsed,
      creditsRemaining: user.aiCredits + subscriptionCredits - creditsUsed
    });
  } catch (error) {
    console.error('Error generating component with Claude:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * @route POST /api/ai/improve
 * @desc Improve existing component using Claude API
 * @access Private
 */
router.post('/improve', isAuthenticated, async (req, res) => {
  try {
    const { html, css, instructions } = req.body;
    
    if (!html || !instructions) {
      return res.status(400).json({ message: 'HTML and improvement instructions are required' });
    }
    
    const userId = req.user.id;
    
    // Get user with subscription details
    const user = await User.findById(userId).select('subscription aiCredits');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has active subscription or credits
    const hasActiveSubscription = user.subscription && 
      user.subscription.status === 'active' && 
      user.subscription.plan && 
      (user.subscription.plan === 'basic_ai' || user.subscription.plan === 'pro_ai') &&
      new Date(user.subscription.currentPeriodEnd) > new Date();
    
    // Calculate available credits
    const subscriptionCredits = hasActiveSubscription ? 
      (user.subscription.plan === 'basic_ai' ? 100 : 300) : 0;
    
    const availableCredits = user.aiCredits + subscriptionCredits;
    
    // Check if user has enough credits
    if (availableCredits <= 0) {
      return res.status(402).json({
        message: 'Insufficient AI credits. Please purchase credits or subscribe to a plan.'
      });
    }
    
    // Construct prompt
    let prompt = `Improve the following web component according to these instructions: ${instructions}\n\n`;
    prompt += `HTML:\n${html}\n\n`;
    
    if (css) {
      prompt += `CSS:\n${css}\n\n`;
    }
    
    prompt += `Return ONLY the improved HTML and CSS code with no explanations. HTML should go first, followed by CSS wrapped in <style> tags.
    The HTML should be clean, semantic and accessible.
    The CSS should use modern best practices.`;
    
    // Call Claude API
    const maxTokens = 4000;
    const claudeResponse = await callClaudeAPI(prompt, maxTokens);
    
    // Calculate token usage and cost
    const tokensUsed = Math.min(claudeResponse.usage.output_tokens, maxTokens);
    const creditsUsed = Math.ceil(tokensUsed / 1000) + 1; // Improvement costs more
    
    // Deduct credits from purchased credits first, then subscription
    let remainingCreditsToDeduct = creditsUsed;
    let purchasedCreditsUsed = 0;
    let subscriptionCreditsUsed = 0;
    
    if (user.aiCredits > 0) {
      purchasedCreditsUsed = Math.min(user.aiCredits, remainingCreditsToDeduct);
      remainingCreditsToDeduct -= purchasedCreditsUsed;
      user.aiCredits -= purchasedCreditsUsed;
    }
    
    // The rest comes from subscription
    subscriptionCreditsUsed = remainingCreditsToDeduct;
    
    // Save updated user credits
    await user.save();
    
    // Record usage
    await AIUsage.create({
      userId,
      operation: 'component_improvement',
      promptTokens: claudeResponse.usage.input_tokens,
      completionTokens: claudeResponse.usage.output_tokens,
      totalTokens: claudeResponse.usage.input_tokens + claudeResponse.usage.output_tokens,
      creditsUsed,
      purchasedCreditsUsed,
      subscriptionCreditsUsed
    });
    
    // Parse response to separate HTML and CSS
    const response = claudeResponse.content[0].text;
    let improvedHtml = '', improvedCss = '';
    
    // Extract HTML and CSS from response
    const styleTagMatch = response.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    
    if (styleTagMatch) {
      improvedCss = styleTagMatch[1].trim();
      improvedHtml = response.replace(styleTagMatch[0], '').trim();
    } else {
      // If no style tags, try to separate based on content
      const htmlCssArray = response.split('```css');
      
      if (htmlCssArray.length > 1) {
        improvedHtml = htmlCssArray[0].replace('```html', '').replace('```', '').trim();
        improvedCss = htmlCssArray[1].replace('```', '').trim();
      } else {
        improvedHtml = response;
      }
    }
    
    return res.json({
      success: true,
      html: improvedHtml,
      css: improvedCss,
      creditsUsed,
      creditsRemaining: user.aiCredits + subscriptionCredits - creditsUsed
    });
  } catch (error) {
    console.error('Error improving component with Claude:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ========== CLAUDE API HELPER ==========

/**
 * Helper function to call Claude API
 * @param {string} prompt - The prompt to send to Claude
 * @param {number} maxTokens - Maximum tokens to generate
 * @returns {Promise<Object>} - Claude API response
 */
async function callClaudeAPI(prompt, maxTokens = 1000) {
  try {
    const apiKey = process.env.CLAUDE_API_KEY;
    
    if (!apiKey) {
      throw new Error('Claude API key is not configured');
    }
    
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-sonnet-20240229',
        max_tokens: maxTokens,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        }
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Claude API call failed:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error?.message || 'Claude API call failed');
  }
}

module.exports = router; 