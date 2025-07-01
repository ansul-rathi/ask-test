import { dynamo } from "@/app/lib/dynamoDB";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

import { NextResponse } from "next/server";

export async function GET(request: Request, context: {params: {email: string}}) {
    const emailId = String(context.params.email);

    if (!emailId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const params = {
        TableName: 'HippaContract',
        Key: { emailId },
    };

    try {
        const response = await dynamo.send(new GetCommand(params));
        if (!response.Item) {
            return NextResponse.json({ message: 'Item not found', hasData: false }, { status: 404 });
        }
        const item = response.Item;

        
        return NextResponse.json({item, hasData: true});
    } catch (error) {
        console.error('Error fetching from DynamoDB:', error);
        return NextResponse.json({ message: 'Failed to fetch facility', error: (error as Error).message }, { status: 500 });
    }
}
