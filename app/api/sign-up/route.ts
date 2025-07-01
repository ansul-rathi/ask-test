import { NextResponse } from "next/server";
import { signUp } from "@/app/services/auth";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  console.log("Received registration data:", {
    name,
    email,
    password,
  });
  try {
    const response = await signUp(name, email, password);
    return NextResponse.json(response);
  } catch (err: any) {
    console.error("Sign-up error:", err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
