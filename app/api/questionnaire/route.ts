import { dynamo } from "@/app/lib/dynamoDB";
import {
  DeleteCommand,
  GetCommand,
  UpdateCommand,
  UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const formId = searchParams.get("id");
  if (!formId) {
    return NextResponse.json(
      { message: "Form Id is required" },
      { status: 400 }
    );
  }

  const params = {
    TableName: "Questionnaire",
    Key: { id: formId },
  };

  try {
    const response = await dynamo.send(new GetCommand(params));
    console.log({ response });
    if (!response.Item) {
      return NextResponse.json(
        { message: "Item not found", hasData: false },
        { status: 404 }
      );
    }
    const item = response.Item;

    return NextResponse.json({ item, hasData: true });
  } catch (error) {
    console.error("Error fetching from DynamoDB:", error);
    return NextResponse.json(
      { message: "Failed to fetch facility", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const formId = searchParams.get("id");
  if (!formId) {
    return NextResponse.json(
      { message: "Form Id is required" },
      { status: 400 }
    );
  }

  const params: UpdateCommandInput = {
    TableName: "Questionnaire",
    Key: { id: formId },
    UpdateExpression: "set submitted = :submitted",
    ExpressionAttributeValues: {
      ":submitted": true,
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const response = await dynamo.send(new UpdateCommand(params));
    if (!response.Attributes) {
      return NextResponse.json(
        { message: "Item not found", hasData: false },
        { status: 404 }
      );
    }
    const updatedItem = response.Attributes;

    return NextResponse.json({ item: updatedItem, hasData: true });
  } catch (error) {
    console.error("Error updating DynamoDB:", error);
    return NextResponse.json(
      { message: "Failed to update item", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, {}: {}) {
  try {
    const { searchParams } = new URL(request.url);
    const formId = searchParams.get("id");
    const deleteParams = {
      TableName: "Questionnaire",
      Key: { id: formId },
    };

    await dynamo.send(new DeleteCommand(deleteParams))

    return NextResponse.json(
      { message: "Questionnaire deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting questionnaire:", error);
    return NextResponse.json(
      { error: "Failed to delete questionnaire" },
      { status: 500 }
    );
  }
}
