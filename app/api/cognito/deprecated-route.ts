// import { client } from "@/app/lib/cognito";
// console.log("cognito route")
// import { 
//     AdminGetUserCommand,  // To get user details
//     AdminUpdateUserAttributesCommand  // To update user attributes
//   } from "@aws-sdk/client-cognito-identity-provider";
  
//   // Example usage:
//   async function getUser(userId: string) {
//     const command = new AdminGetUserCommand({
//       UserPoolId: process.env.USER_POOL_ID,
//       Username: userId,
//     });
//     return await client.send(command);
//   }
  
//   async function updateUserCredits(userId: string, credits: number) {
//     const command = new AdminUpdateUserAttributesCommand({
//       UserPoolId: process.env.USER_POOL_ID,
//       Username: userId,
//       UserAttributes: [
//         {
//           Name: "custom:credits",
//           Value: credits.toString()
//         }
//       ]
//     });
//     return await client.send(command);
//   }