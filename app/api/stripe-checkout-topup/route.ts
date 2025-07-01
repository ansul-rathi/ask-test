import stripe from "@/app/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { customerId, domain, locale, emailId, amount = 100 } = await req.json();
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Credits Top-up",
              description: `Purchase ${amount} credits for your account`,
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      customer: customerId,
      success_url: `${domain}/${locale}/payment-success`,
      cancel_url: `${domain}/${locale}/payment-cancel`,
      metadata: {
        userId: emailId,
        amount: amount.toString(), // Store the amount in metadata
        plan: "100_TOPUP"
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
