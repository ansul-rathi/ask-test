// Helper function to verify a user's credits after registration
import { getUserAttributes } from "../api/credits/[userId]/utils";

export async function verifyUserCredits(userId: string) {
  try {
    // Get the user's attributes
    const attributes = await getUserAttributes(userId);
    
    // Check if credits and subscription status were set correctly
    const credits = parseInt(attributes["custom:credits"] || "0");
    const subStatus = attributes["custom:subStatus"] || "";
    
    // Log the verification results
    console.log("Credit verification for user:", userId);
    console.log("Credits:", credits);
    console.log("Subscription status:", subStatus);
    
    // Return whether the credits were set correctly
    return {
      success: credits === 15 && subStatus === "trial",
      credits,
      subStatus
    };
  } catch (error: any) {
    console.error("Error verifying user credits:", error);
    return { 
      success: false,
      error: error.message
    };
  }
}
