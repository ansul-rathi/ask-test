import { NextResponse } from "next/server";
import { resetPassword } from "@/app/services/auth";

export async function POST(request: Request) {
  const { email, confirmationCode, newPassword } = await request.json();

  console.log("Received registration data:", {
    email,
    confirmationCode,
    newPassword
  });
  try {
    const response = await resetPassword(email, confirmationCode, newPassword);
    return NextResponse.json(response);
  } catch (err: any) {
    console.error("reset password error:", err);
    return NextResponse.json({ message: err.message}, {status: 500});
  }
}
