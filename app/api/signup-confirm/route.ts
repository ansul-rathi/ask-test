import { NextResponse } from "next/server";
import { confirmSignUp, getUserIdByEmail } from "@/app/services/auth";
// import { verifyUserCredits } from "@/app/utils/verifyCredits";
import CreditsService from "@/app/services/credits-service";

export async function POST(request: Request) {
  const { email, confirmationCode } = await request.json();

  console.log("Received registration data:", {
    email,
    confirmationCode
  });
  
  try {
    const response = await confirmSignUp(email, confirmationCode);
    
    // Add free trial credits after confirmation
    try {
      const userId = await getUserIdByEmail(email);
      if (userId) {
        // Always add the free trial credits after confirmation
        await CreditsService.addFreeTrial(userId);
        console.log("Free trial credits added for user:", userId);
      }
    } catch (verifyError) {
      console.error("Adding free trial credits failed:", verifyError);
      // Don't fail the signup process if adding credits fails
    }
    
    return NextResponse.json(response);
  } catch (err: any) {
    console.error("Sign-up error:", err);
    return NextResponse.json({ message: err.message }, {status: 500});
  }
}
