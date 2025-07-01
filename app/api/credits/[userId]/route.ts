import { NextResponse } from "next/server";
import CREDITS_ACTIONS from "@/app/constants/credit-actions";
import { addFreeTrialCredits, deductCredits, getUserAttributes, handlePaymentFailed, handleSubscriptionCancellation, refreshCredits } from "./utils";

export async function GET(
  request: Request,
  context: { params: { userId: string } }
) {
  const userId = String(context.params.userId);
  try {
    const attributes = await getUserAttributes(userId);
    return NextResponse.json({
      credits: parseInt(attributes["custom:credits"] || "0"),
      subStatus: attributes["custom:subStatus"] || "inactive",
      stripeCustomerId: attributes['custom:stripeCustomerId'] || '',
      email: attributes['email'] || '',
      name: attributes['name'] || '',
    });
  } catch (err: any) {
    console.error("Sign-up error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  context: { params: { userId: string, plan: string } }
) {
  const userId = String(context.params.userId);
  const plan = String(context.params.plan);

  try {

    const body = await request.json();
    const { action, amount = 1 } = body;
    console.log("recieved credit request: ", {action, amount, userId, plan})
    switch (action) {
      case CREDITS_ACTIONS.DEDUCT_CREDITS:
        const deductResult = await deductCredits(
          userId,
          amount
        );
        return NextResponse.json(deductResult);

      case CREDITS_ACTIONS.REFRESH_CREDITS:
        const refreshResult = await refreshCredits(userId,plan);
        return NextResponse.json(refreshResult);

      case CREDITS_ACTIONS.CANCEL_SUBSCRIPTION:
        const cancelResult =
          await handleSubscriptionCancellation(userId);
        return NextResponse.json(cancelResult);

      case CREDITS_ACTIONS.HANDLE_PAYMENT_FAILED:
        const paymentFailedResult = await handlePaymentFailed(
          userId
        );
        return NextResponse.json(paymentFailedResult);

      case CREDITS_ACTIONS.ADD_FREE_TRIAL:
        const freeTrialResult = await addFreeTrialCredits(userId, 15);
        return NextResponse.json(freeTrialResult);

      default:
        return NextResponse.json(
          { message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (err: any) {
    console.error("Credits action error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
