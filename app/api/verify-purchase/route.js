// Vercel serverless API endpoint to verify Stripe purchases
import Stripe from 'stripe';

export async function GET(request) {
  // Get the session ID from the URL
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');
  
  // If no session ID provided, return error
  if (!sessionId) {
    return new Response(JSON.stringify({ 
      verified: false, 
      error: 'No session ID provided' 
    }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  
  try {
    // Initialize Stripe with your secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    // Verify the payment was successful
    const verified = session.payment_status === 'paid';
    
    return new Response(JSON.stringify({ 
      verified,
      status: session.payment_status,
      product: 'calc'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error verifying session:', error);
    
    return new Response(JSON.stringify({ 
      verified: false, 
      error: error.message 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}