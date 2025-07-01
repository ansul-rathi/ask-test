import stripe from "@/app/lib/stripe";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const plans = await stripe.plans.list({
      active: true,
    });

    return NextResponse.json({ plans: plans.data, hasData: true });
  } catch (error) {
    console.error("Error fetching customer subscription:", error);
    return NextResponse.json(
      { message: "Failed to fetch facility", error: (error as Error).message },
      { status: 500 }
    );
  }
}
