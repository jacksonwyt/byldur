// Vercel serverless function to verify Stripe purchases
const Stripe = require('stripe');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Get the session ID from the URL query parameters
  const { session_id } = req.query;
  
  // If no session ID provided, return error
  if (!session_id) {
    res.status(400).json({ 
      verified: false, 
      error: 'No session ID provided' 
    });
    return;
  }
  
  try {
    // Initialize Stripe with your secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(session_id);
    
    // Verify the payment was successful
    const verified = session.payment_status === 'paid';
    
    res.status(200).json({ 
      verified,
      status: session.payment_status,
      product: 'calc'
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    
    res.status(500).json({ 
      verified: false, 
      error: error.message 
    });
  }
};