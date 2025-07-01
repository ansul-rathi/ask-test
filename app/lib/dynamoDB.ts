// lib/dynamoDB.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error("AWS credentials are not defined");
}

const client = new DynamoDBClient({ 
  region: process.env.AWS_REGION, 
  credentials: {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID as string, 
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string 
  } 
});
const dynamo = DynamoDBDocumentClient.from(client);

export { dynamo, client };
