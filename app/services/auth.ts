// import NextAuth, { getServerSession, AuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
'use server'
import { jwtDecode } from "jwt-decode";
import { cookies } from 'next/headers'
import {
  AdminGetUserCommand,
  AdminUpdateUserAttributesCommand,
  AdminUpdateUserAttributesCommandInput,
  CognitoIdentityProviderClient,
  ConfirmForgotPasswordCommand,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput,
  ConfirmSignUpCommandOutput,
  ForgotPasswordCommand,
  GlobalSignOutCommand,
  InitiateAuthCommand,
  ListUsersCommand,
  // RespondToAuthChallengeCommand,
  SignUpCommand,
  SignUpCommandInput,
  // UpdateUserAttributesCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";

const client = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

const generateSecretHash = (
  username: string,
  clientId: string,
  clientSecret: string
) => {
  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
};

export const authorize = async (credentials: any) => {
  console.log({credentials})
  const cookieStore = await cookies()
  if (!credentials) return null;
  const command = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    AuthParameters: {
      USERNAME: credentials.username,
      PASSWORD: credentials.password,
      SECRET_HASH: generateSecretHash(
        credentials.username,
        process.env.COGNITO_CLIENT_ID,
        process.env.COGNITO_CLIENT_SECRET
      ),
    },
    ClientId: process.env.COGNITO_CLIENT_ID,
  });

  try {
    const response = await client.send(command);
    console.log("response in authorize is---->", response);
    if (response.AuthenticationResult) {
      const { AccessToken, IdToken, RefreshToken } =
        response.AuthenticationResult;

      const decodedToken: any = jwtDecode(IdToken as string);

      const stripeCustomerId = decodedToken["custom:stripeCustomerId"];
      const credits = decodedToken["custom:credits"];

      const id = decodedToken["cognito:username"];
      const { name, email, email_verified } = decodedToken;

      cookieStore.set({
        name: 'auth_token',
        value: IdToken as string,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
      return {
        id,
        name,
        email,
        stripeCustomerId,
        credits,
        emailVerified: email_verified,
        accessToken: AccessToken,
        idToken: IdToken,
        refreshToken: RefreshToken,
      };
    }
    return null;
  } catch (error) {
    console.error("asdfasdgdf", error);
    throw error;
  }
};

// const authOptions: AuthOptions = {
//   callbacks: {
//     async jwt({ token, user, trigger, session }: any) {
//       console.log({user})
//       if (user) {
//         token.accessToken = user.accessToken;
//         token.idToken = user.idToken;
//         token.refreshToken = user.refreshToken;
//         token.stripeCustomerId = user.stripeCustomerId;
//         token.emailVerified = user.emailVerified;
//       }

//       // If session is updated, update the token
//       if (trigger === "update" && session) {
//         console.log("updateSession:", session)
//         token.stripeCustomerId = session.user.stripeCustomerId;
//         token.accessToken = session.accessToken;
//         token.idToken = session.idToken;
//       }
//       return token;
//     },
//     async session({ session, token }: any) {
//       session.accessToken = token.accessToken;
//       session.idToken = token.idToken;
//       session.refreshToken = token.refreshToken;
//       session.user.stripeCustomerId = token.stripeCustomerId;
//       session.user.emailVerified = token.emailVerified;
//       return session;
//     },
//   },
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       authorize,
//       credentials: {
//         username: { label: "Email", type: "text", placeholder: "Email" },
//         password: { label: "Password", type: "password" },
//       },
//     }),

//     // ...add more providers here
//   ],
// };

// const getSession = async () => {
//   const session = await getServerSession(authOptions);
//   return session;
// };

const signUp = async (name: string, email: string, password: string) => {
  const params: SignUpCommandInput = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    Password: password,
    SecretHash: generateSecretHash(
      email,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    ),
    UserAttributes: [
      {
        Name: "email", // Cognito standard attribute for email
        Value: email,
      },
      {
        Name: "name", // Cognito standard attribute for name
        Value: name,
      },
    ],
  };

  try {
    const command = new SignUpCommand(params);
    const response = await client.send(command);

    console.log("Sign-up successful:", response);
    return {
      message: "Sign-up successful",
      success: true,
      CodeDeliveryDetails: response?.CodeDeliveryDetails,
    };
  } catch (err) {
    console.error("Sign-up error:", err);
    return Promise.reject(err);
  }
};

const confirmSignUp = async (email: string, confirmationCode: string) => {
  console.log(
    "confirmation code response is-------->",
    email,
    confirmationCode
  );

  const params: ConfirmSignUpCommandInput = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    ConfirmationCode: confirmationCode,
    SecretHash: generateSecretHash(
      email,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    ),
  };

  try {
    const command = new ConfirmSignUpCommand(params);
    const response: ConfirmSignUpCommandOutput = await client.send(command);

    console.log("confirmation code response is-------->", response);
    return { message: "Sign-up confirmed", success: true };
  } catch (err) {
    console.error("Sign-up confirmation error:", err);
    return Promise.reject(err);
  }
};

const forgotPassword = async (email: string) => {
  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    SecretHash: generateSecretHash(
      email,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    ),
  };

  try {
    const command = new ForgotPasswordCommand(params);
    const response = await client.send(command);

    console.log("Forgot password initiation successful:", response);
    return response; // A confirmation code will be sent to the user’s email/phone
  } catch (error) {
    console.error("Forgot password error:", error);
    throw error;
  }
};

const resetPassword = async (
  email: string,
  confirmationCode: string,
  newPassword: string
) => {
  const params = {
    ClientId: process.env.COGNITO_CLIENT_ID,
    Username: email,
    ConfirmationCode: confirmationCode,
    Password: newPassword,
    SecretHash: generateSecretHash(
      email,
      process.env.COGNITO_CLIENT_ID,
      process.env.COGNITO_CLIENT_SECRET
    ),
  };

  try {
    const command = new ConfirmForgotPasswordCommand(params);
    const response = await client.send(command);

    console.log("Password reset successful:", response);
    return response;
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
};

const saveCustomerIdToCognito = async (
  email: string,
  stripeCustomerId: string
) => {
  try {
    const getUserCommand = new AdminGetUserCommand({
      UserPoolId: process.env.USER_POOL_ID,
      Username: email
    });
    const userResponse = await client.send(getUserCommand);

    const currentAttributes = userResponse.UserAttributes || [];

    const currentCredits = currentAttributes.find(
      attr => attr.Name === 'custom:credits'
    )?.Value || "0";

    const params: AdminUpdateUserAttributesCommandInput = {
      UserAttributes: [
        {
          Name: "custom:stripeCustomerId",
          Value: stripeCustomerId,
        },
        {
          Name: "custom:credits",
          Value: currentCredits
        },
        {
          Name: "custom:subStatus",
          Value: "inactive"
        }
      ],
      Username: email,
      UserPoolId: process.env.USER_POOL_ID,
    };
    const command = new AdminUpdateUserAttributesCommand(params);
    const response = await client.send(command);

    // After updating Cognito, get a new ID token with updated attributes
    // const res = await getSession()
    // console.log("Response from Cognito session:", res);
    // const authCommand = new InitiateAuthCommand({
    //   AuthFlow: "REFRESH_TOKEN_AUTH",
    //   AuthParameters: {
    //     REFRESH_TOKEN: (await getSession())?.refreshToken,
    //     SECRET_HASH: generateSecretHash(
    //       email,
    //       process.env.COGNITO_CLIENT_ID,
    //       process.env.COGNITO_CLIENT_SECRET
    //     ),
    //   },
    //   ClientId: process.env.COGNITO_CLIENT_ID,
    // });

    // const authResponse = await client.send(authCommand);
    // if (authResponse.AuthenticationResult) {
    //   // Update the session with new tokens
    //   const session = await getSession() as any;
    //   if (session) {
    //     session.accessToken = authResponse.AuthenticationResult.AccessToken;
    //     session.idToken = authResponse.AuthenticationResult.IdToken;
    //     session.user.stripeCustomerId = stripeCustomerId;
    //   }
    // }

    return {
      message: "Attribute updated successfully",
      success: true,
      response,
    };
  } catch (err) {
    console.error("saveCustomerIdToCognito error:", err);
    return Promise.reject(err);
  }
};

const getUserByStripeId = async (stripeCustomerId: string) => {
  try {
    const command = new ListUsersCommand({
      UserPoolId: process.env.USER_POOL_ID,
      Filter: `custom:stripeCustomerId = "${stripeCustomerId}"`,
    });

    const response = await client.send(command);
    if (response.Users && response.Users.length > 0) {
      return response.Users[0].Username; // This is the Cognito userId
    }
    return null;
  } catch (err) {
    console.error("Error getting user by stripe ID:", err);
    throw err;
  }
};

const getUserIdByEmail = async (email: string) => {
  try {
    const command = new ListUsersCommand({
      UserPoolId: process.env.USER_POOL_ID,
      Filter: `email = "${email}"`,
      Limit: 1,
    });
    
    const response = await client.send(command);
    
    if (response.Users && response.Users.length > 0) {
      return response.Users[0].Username;
    }
    
    throw new Error("User not found");
  } catch (error) {
    console.error("Error getting user ID by email:", error);
    throw error;
  }
};

// const logout = async () => {
//   try {
//     const session: any = await getSession();

//     if (session && session.accessToken) {
//       // Perform global sign-out with Cognito
//       const command = new GlobalSignOutCommand({
//         AccessToken: session.accessToken,
//       });
//       const response = await client.send(command);
//       console.log("Global sign-out successful");
//       return response;
//     }
//     return null;
//   } catch (error) {
//     console.error("Password reset error:", error);
//     throw error;
//   }
// };
const logout = async (accessToken: string) => {
  try {
    (await cookies()).delete('auth_token')
    const command = new GlobalSignOutCommand({
      AccessToken: accessToken,
    });

    const response = await client.send(command);
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    // throw error;
    return error
  }
};

export {
  signUp,
  confirmSignUp,
  forgotPassword,
  resetPassword,
  saveCustomerIdToCognito,
  getUserByStripeId,
  logout,
  getUserIdByEmail
};

// export default NextAuth(authOptions);
