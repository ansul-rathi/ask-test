import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "@/app/lib/dynamoDB";
import { NextResponse } from "next/server";
import { getServerSession } from "@/app/utils/serverAuth";

export async function GET(request: Request) {
  // const session = await getServerSession(authOptions);
  const session = await getServerSession();
  if (!session?.isAuthenticated) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "10");
  const lastEvaluatedKey = searchParams.get("lastEvaluatedKey");


  const params = {
    TableName: "Questionnaire",
    IndexName: "senderEmail-createdAt-index",
    KeyConditionExpression: "senderEmail = :email",
    ExpressionAttributeValues: {
      ":email": session.user?.email,
    },
    ScanIndexForward: false,
    Limit: limit,
    ...(lastEvaluatedKey && {
      ExclusiveStartKey: JSON.parse(lastEvaluatedKey),
    }),
  };

  try {
    const { Items, LastEvaluatedKey } = await dynamo.send(
      new QueryCommand(params)
    );

    return NextResponse.json({
      items: Items || [],
      lastEvaluatedKey: LastEvaluatedKey
        ? JSON.stringify(LastEvaluatedKey)
        : null,
      hasData: (Items?.length || 0) > 0,
    });
  } catch (error) {
    console.error("Error listing from DynamoDB:", error);
    return NextResponse.json(
      {
        message: "Failed to list questionnaires",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
