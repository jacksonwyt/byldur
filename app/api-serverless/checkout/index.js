// Vercel serverless function for Stripe checkout
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

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Initialize Stripe with your secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Calc - Command-Line Style Calculator',
              description: 'A sleek, terminal-inspired calculator for your everyday calculations.',
            },
            unit_amount: 500, // $5.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_URL}/products/download-calc.html?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/products/calc.html`,
    });
    
    // Return the session ID
    res.status(200).json({ id: session.id });
  } catch (error) {
    // Handle any errors
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
};