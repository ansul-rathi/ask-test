import { NextResponse } from "next/server";
import { forgotPassword } from "@/app/services/auth";

export async function POST(request: Request) {
  const { email } = await request.json();

  console.log("Received registration data:", {
    email,
  });
  try {
    const response = await forgotPassword(email);
    return NextResponse.json(response);
  } catch (err: any) {
    console.error("Sign-up error:", err);
    return NextResponse.json({ message: err.message }, {status: 500});
  }
}
