const getRawBody = require("raw-body");
const { updateCustomerByStripeCid } = require("./_db.js");
const stripe = require("./_stripe.js");

// Disable next.js body parsing (stripe needs the raw body to validate the event)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const headers = req.headers;

  try {
    const rawBody = await getRawBody(req);

    const stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log(`stripeEvent: ${stripeEvent.type}`);

    // Get the object from stripeEvent
    const object = stripeEvent.data.object;

    switch (stripeEvent.type) {
      case "checkout.session.completed":
        // Fetch subscription
        const subscription = await stripe.subscriptions.retrieve(
          object.subscription
        );

        // Update the current user
        await updateCustomerByStripeCid(object.customer, {
          stripe_subscription_id: subscription.id,
          // Store the Price ID for this subscription
          stripe_price_id: subscription.items.data[0].price.id,
          // Store the subscription status ("active" or "trialing")
          stripe_subscription_status: subscription.status,
        });

        break;

      case "invoice.paid":
        // If a payment succeeded we update stored subscription status to "active"
        // in case it was previously "trialing" or "past_due".
        // We skip if amount due is 0 as that's the case at start of trial period.
        if (object.amount_due > 0) {
          await updateCustomerByStripeCid(object.customer, {
            stripe_subscription_status: "active",
          });
        }

        break;

      case "invoice.payment_failed":
        // If a payment failed we update stored subscription status to "past_due"
        await updateCustomerByStripeCid(object.customer, {
          stripe_subscription_status: "past_due",
        });

        break;

      case "customer.subscription.updated":
        await updateCustomerByStripeCid(object.customer, {
          stripe_price_id: object.items.data[0].price.id,
          stripe_subscription_status: object.status,
        });

        // 💡 You could also read "cancel_at_period_end" if you'd like to email user and learn why they cancelled
        // or convince them to renew before their subscription is deleted at end of payment period.
        break;

      case "customer.subscription.deleted":
        // If a subscription was deleted update stored subscription status to "canceled".
        // Keep in mind this won't be called right away if "Cancel at end of billing period" is selected
        // in Billing Portal settings (https://dashboard.stripe.com/settings/billing/portal). Instead you'll
        // get a "customer.subscription.updated" event with a cancel_at_period_end value.
        await updateCustomerByStripeCid(object.customer, {
          stripe_subscription_status: "canceled",
        });

        break;

      case "customer.subscription.trial_will_end":
        // This event happens 3 days before a trial ends
        // 💡 You could email user letting them know their trial will end or you can have Stripe do that
        // automatically 7 days in advance: https://dashboard.stripe.com/settings/billing/automatic

        break;

      // no default
    }

    // Send success response
    res.send({ status: "success" });
  } catch (error) {
    console.log("stripe webhook error", error);

    // Send error response
    res.send({ status: "error", code: error.code, message: error.message });
  }
};
