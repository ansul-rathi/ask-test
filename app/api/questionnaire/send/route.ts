import { v4 as uuidv4 } from "uuid";
import { registerFormTemp } from "@/app/utils/htmlTemplate";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "@/app/lib/dynamoDB";
import { mgClient, mgDomain } from "@/app/lib/mailgun";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Extract data from the request body
    const {
      firstName,
      lastName,
      senderEmail,
      receiverEmail,
      message,
      subject,
      consent = false,
      images = false,
      locale,
      submitted = false,
    }: any = await request.json();

    const id = uuidv4();

    // Insert the data into DynamoDB
    const result = await dynamo.send(
      new PutCommand({
        TableName: "Questionnaire", // DynamoDB table name
        Item: {
          id,
          senderEmail,
          receiverEmail,
          message,
          consent,
          images,
          // password: "password",
          createdAt: new Date().toISOString(), // Adding a timestamp for when the record was created
          submitted,
        },
      })
    );

    // Generate the URL for the form
    const proto = request.headers.get("x-forwarded-proto");
    const host = request.headers.get("host");
    const href = `${proto}://${host}/${locale}/patient/${id}`;
    console.log("href", href);

    const htmlBody = registerFormTemp(href, firstName, lastName, message);

    // Send an email using Mailgun
    const mailgunRes = await mgClient.messages.create(mgDomain, {
      // from: "support@askmedical.info",
      from: "Anesthesia Prescreening <support@askmedical.info>",
      to: receiverEmail,
      subject: subject ?? "ASK form",
      html: htmlBody,
    });

    console.log("Mailgun response:", mailgunRes);

    return NextResponse.json({message: "Success", isSuccess: true })
  } catch (error) {
    console.error("Error creating record:", error);
    return NextResponse.json({message: "Internal Server Error", isSuccess: false })

  }
}
