'use server'

import {
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";

// Create a function that returns the client instead of exporting it directly
export async function getCognitoClient() {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error("AWS credentials are not defined");
  }

  const credentials = {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    },
  };

  return new CognitoIdentityProviderClient(credentials);
}