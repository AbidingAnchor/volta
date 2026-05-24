const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { userId, plan } = JSON.parse(event.body);

    if (!userId || !plan) {
      return { statusCode: 400, body: 'Missing userId or plan' };
    }

    // Define prices based on plan
    const prices = {
      pro: 2900, // $29.00 in cents
      business: 7900 // $79.00 in cents
    };

    const price = prices[plan];
    if (!price) {
      return { statusCode: 400, body: 'Invalid plan' };
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan === 'pro' ? 'Volta Pro Plan' : 'Volta Business Plan',
              description: plan === 'pro' 
                ? 'Unlimited repurposes, advanced features' 
                : 'Everything in Pro plus team collaboration',
            },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/pricing`,
      customer_email: (await supabase.auth.admin.getUserById(userId)).data.user.email,
      metadata: {
        userId,
        plan,
      },
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
