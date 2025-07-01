import stripe from "@/app/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { customerId, domain, locale, emailId } = await req.json();
  try {
    // Check if customer has any previous subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 1
    });

    const hasPreviousSubscription = subscriptions.data.length > 0;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID as string,
          quantity: 1,
        },
      ],
      customer: customerId,
      // Only include trial period for first-time subscribers
      ...(hasPreviousSubscription ? {} : {
        subscription_data: {
          trial_period_days: 30,
        },
      }),
      success_url: `${domain}/${locale}/payment-success`,
      cancel_url: `${domain}/${locale}/payment-cancel`,
      metadata: {
        userId: emailId,
        plan: "300_SUBSCRIPTION",
        isFirstTime: (!hasPreviousSubscription).toString()
      }
    });

    return NextResponse.json({ session });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
