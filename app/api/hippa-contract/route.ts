import { NextResponse } from 'next/server';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { dynamo } from '@/app/lib/dynamoDB';


export async function POST(request: Request) {
    const data = await request.json();
    const { emailId, name, facilityEmail, city, country, facilityName, acceptHippa,
        profileImage,
        signature } = data;

    // Validate required fields
    if (!emailId || !name || !facilityEmail || !city || !country || !facilityName || !acceptHippa) {
        return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    const params = {
        TableName: 'HippaContract',
        Item: { emailId, name, facilityEmail, city, country, facilityName, acceptHippa,
            profileImage: profileImage || null,
            signature: signature || null,
         },
    };

    try {
        await dynamo.send(new PutCommand(params));
        return NextResponse.json({ message: 'Facility added successfully' });
    } catch (error) {
        console.error('Error saving to DynamoDB:', error);
        return NextResponse.json({ message: 'Failed to add facility', error: (error as Error).message }, { status: 500 });
    }
}
