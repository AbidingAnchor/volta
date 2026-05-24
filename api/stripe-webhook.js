const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return { statusCode: 400, body: 'Missing signature or webhook secret' };
  }

  try {
    const eventObject = stripe.webhooks.constructEvent(
      event.body,
      sig,
      webhookSecret
    );

    if (eventObject.type === 'checkout.session.completed') {
      const session = eventObject.data.object;
      const { userId, plan } = session.metadata;

      if (userId && plan) {
        // Update user's plan in Supabase
        await supabase
          .from('profiles')
          .update({
            plan: plan,
            repurpose_count: 0,
          })
          .eq('id', userId);

        console.log(`Updated user ${userId} to ${plan} plan`);
      }
    }

    return { statusCode: 200, body: 'Webhook received' };
  } catch (error) {
    console.error('Webhook error:', error);
    return { statusCode: 400, body: `Webhook Error: ${error.message}` };
  }
};
