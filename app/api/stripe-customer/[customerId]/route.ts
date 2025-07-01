import stripe from "@/app/lib/stripe";
import { getServerSession } from "@/app/utils/serverAuth";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { customerId: string } }
) {
  const session = await getServerSession();
    if (!session?.isAuthenticated) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  console.log("api hitttttt")
  const customerId = String(context.params.customerId);
  console.log("customer IDD: ", customerId)
  if (!customerId) {
    return NextResponse.json(
      { message: "Customer Id is required" },
      { status: 400 }
    );
  }

  try {
    console.log({customerId})

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "all",
    });
    return NextResponse.json({ subscriptions: subscriptions?.data, hasData: true });
  } catch (error) {
    console.error("Error fetching customer subscription:", error);
    return NextResponse.json(
      { message: "Failed to fetch facility", error: (error as Error).message },
      { status: 500 }
    );
  }
}
