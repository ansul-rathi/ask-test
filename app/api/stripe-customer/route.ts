import stripe from "@/app/lib/stripe";
import { saveCustomerIdToCognito } from "@/app/services/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("Received registration data for create customer stripe:", req);
    const { email, name } = await req.json();

    // First, search for existing customers with this email
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1
    });

    let customer;
    
    if (existingCustomers.data.length > 0) {
      // Use the existing customer
      customer = existingCustomers.data[0];
      console.log('Using existing customer:', customer.id);
    } else {
      // Create new customer only if none exists
      customer = await stripe.customers.create({
        email,
        name,
      });
      console.log('Created new customer:', customer.id);
    }

    // Save/Update the customer ID in Cognito
    await saveCustomerIdToCognito(email, customer.id);

    return NextResponse.json({ customer });
  } catch (error) {
    console.error('Error in stripe-customer route:', error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return new NextResponse(JSON.stringify({ error: errorMessage }), {
      status: 500,
    });
  }
}
