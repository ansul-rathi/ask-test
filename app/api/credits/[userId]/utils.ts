import { getCognitoClient } from "@/app/lib/cognito";
import {
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export async function getUserAttributes(userId: string) {
  const cognitoClient = await getCognitoClient();

  const response = await cognitoClient.send(
    new AdminGetUserCommand({
      UserPoolId: process.env.USER_POOL_ID,
      Username: userId,
    })
  );
  const attributes: any = response.UserAttributes?.reduce((acc, attr) => {
    acc[attr.Name!] = attr.Value!;
    return acc;
  }, {} as Record<string, string>);

  return attributes
}

export async function deductCredits(userId: string, amount: number = 1) {
  try {
    const userAttributes = await getUserAttributes(userId);
    const currentCredits = parseInt(userAttributes["custom:credits"]) || 0;
    if (currentCredits < amount) {
      throw new Error("Insufficient credits");
    }
    const newCredits = currentCredits - amount;
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: userId,
      UserAttributes: [
        {
          Name: "custom:credits",
          Value: newCredits.toString(),
        },
      ],
    };
    const cognitoClient = await getCognitoClient();

    await cognitoClient.send(new AdminUpdateUserAttributesCommand(params));
    const result = { credits: newCredits };
    return result;
  } catch (error) {
    throw error;
  }
}

export async function refreshCredits(userId: string, plan: string) {
  try {
    const credits = plan === '300_SUBSCRIPTION' ? 300 : 100
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: userId,
      UserAttributes: [
        {
          Name: "custom:credits",
          Value: String(credits),
        },
        {
          Name: "custom:subStatus",
          Value: "active",
        },
      ],
    };
    const cognitoClient = await getCognitoClient();

    await cognitoClient.send(new AdminUpdateUserAttributesCommand(params));
    return { credits, subStatus: "active" };
  } catch (error) {
    console.error("Error refreshing credits:", error);
    throw error;
  }
}

export async function handleSubscriptionCancellation(userId: string) {
  try {
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: userId,
      UserAttributes: [
        {
          Name: "custom:subStatus",
          Value: "cancelled",
        },
        {
          Name: "custom:credits",
          Value: "0",
        },
      ],
    };
    const cognitoClient = await getCognitoClient();

    await cognitoClient.send(new AdminUpdateUserAttributesCommand(params));
    return { subStatus: "cancelled", credits: 0 };
  } catch (error) {
    console.error("Error handling subscription cancellation:", error);
    throw error;
  }
}

export async function handlePaymentFailed(userId: string) {
  try {
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: userId,
      UserAttributes: [
        {
          Name: "custom:subStatus",
          Value: "past_due",
        },
        {
          Name: "custom:credits",
          Value: "0",
        },
      ],
    };
    const cognitoClient = await getCognitoClient();

    await cognitoClient.send(new AdminUpdateUserAttributesCommand(params));
    return { subStatus: "past_due", credits: 0 };
  } catch (error) {
    console.error("Error handling payment failure:", error);
    throw error;
  }
}

export async function addFreeTrialCredits(userId: string, credits: number = 15) {
  try {
    const params = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: userId,
      UserAttributes: [
        {
          Name: "custom:credits",
          Value: String(credits),
        },
        {
          Name: "custom:subStatus",
          Value: "trial",
        },
      ],
    };
    const cognitoClient = await getCognitoClient();

    await cognitoClient.send(new AdminUpdateUserAttributesCommand(params));
    return { credits, subStatus: "trial" };
  } catch (error) {
    console.error("Error adding free trial credits:", error);
    throw error;
  }
}
