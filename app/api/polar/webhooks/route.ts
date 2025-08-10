import { Webhooks } from '@polar-sh/nextjs';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client to modify user data
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper function to update user subscription data in Supabase
async function updateUserSubscription(subscription: any, customer: any) {
  console.log("updateUserSubscription: Received subscription:", subscription);
  console.log("updateUserSubscription: Received customer:", customer);

  const { data: user, error } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('email', customer.email)
    .single();

  if (error || !user) {
    console.error(`updateUserSubscription Error: User with email ${customer.email} not found.`, error);
    return; // The Webhooks helper will still send a 200 OK to Polar
  }
  console.log("updateUserSubscription: Found user with ID:", user.id);

  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({
      plan: 'pro',
      polar_customer_id: customer.id,
      polar_subscription_id: subscription.id,
      polar_subscription_status: subscription.status,
      subscription_expires_at: subscription.currentPeriodEnd
        ? new Date(subscription.currentPeriodEnd).toISOString()
        : null,
    })
    .eq('id', user.id);

  if (updateError) {
    console.error(`updateUserSubscription Error: Failed to update user ${user.id}`, updateError);
  } else {
    console.log(`updateUserSubscription: Successfully updated subscription for user ${user.id}.`);
  }
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

  onPayload: async (payload) => {
    console.log(`Received Polar event: ${payload.type}`);

    switch (payload.type) {
      case 'subscription.created':
      case 'subscription.updated': {
        const subscription = payload.data;
        const customer = payload.data.customer;

        if (subscription && customer) {
          await updateUserSubscription(subscription, customer);
        } else {
          console.error('Webhook Error: Missing subscription or customer data in payload.');
        }
        break;
      }
      case 'subscription.canceled': {
        const subscription = payload.data;
        await supabaseAdmin
          .from('users')
          .update({
            plan: 'free',
            polar_subscription_status: subscription.status,
          })
          .eq('polar_subscription_id', subscription.id);
        break;
      }
      default:
        console.log(`Unhandled Polar event type: ${payload.type}`);
    }
  },
});
