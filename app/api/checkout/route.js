// Vercel serverless API endpoint for Stripe checkout
import Stripe from 'stripe';

export async function POST(request) {
  // Initialize Stripe with your secret key (stored in environment variables)
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
  try {
    // Parse the request body
    const data = await request.json();
    
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
              images: [`${process.env.NEXT_PUBLIC_URL}/products/calc-preview.png`], // Optional preview image
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
    return new Response(JSON.stringify({ id: session.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Handle any errors
    console.error('Error creating checkout session:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}