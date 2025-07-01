import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { dynamo } from "@/app/lib/dynamoDB";
import { mgClient, mgDomain } from "@/app/lib/mailgun";
import { NextResponse } from "next/server";
import { CreateForm1 } from "./pdf";
import { deliverPdfTemplate } from "@/app/utils/htmlTemplate";
import QuestionnaireService from "@/app/services/questionnaire";
import { generateAdditionalText } from "./asaScore";

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const formId = searchParams.get("id");
  try {
    if (!formId) {
      return NextResponse.json(
        { message: "Form Id is missing", isSuccess: false },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch existing item from DynamoDB
    const existingFormData = await dynamo.send(
      new GetCommand({
        TableName: "Questionnaire",
        Key: { id: formId },
      })
    );

    console.log("existingFormData", existingFormData);

    if (existingFormData.Item && existingFormData.Item.submitted) {
      return NextResponse.json(
        { message: "Form has already been submitted", isSuccess: false },
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract data from the request body
    const body: any = await request.json();

    const pdf = await CreateForm1(body);
    const buffer = Buffer.from(pdf as any);
    const additionalText = generateAdditionalText(body);
    const htmlBody = deliverPdfTemplate(additionalText);

    // Send an email using Mailgun
    const mailgunRes = await mgClient.messages.create(mgDomain, {
      from: "Anesthesia Prescreening <support@askmedical.info>",
      to: existingFormData?.Item?.senderEmail,
      subject: "Submission form from ASK medical.",
      html: htmlBody,
      attachment: [
        {
          filename: `${body?.patient_information?.patient_name}.pdf`,
          data: buffer,
        },
      ],
    });

    console.log("Mailgun response:", mailgunRes);

    await QuestionnaireService.markAsSubmitted(formId);

    return NextResponse.json(
      {
        message: "Report has been generated and sent successfully",
        isSuccess: true,
      },
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating record:", error);
    return NextResponse.json(
      { message: "Internal Server Error", isSuccess: false },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
