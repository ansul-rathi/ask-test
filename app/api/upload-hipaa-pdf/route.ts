// app/api/upload-hipaa-pdf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Server-side S3 client (uses private environment variables)
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

const bucketName = process.env.S3_BUCKET_NAME || '';

interface HippaFormData {
  name: string;
  facilityEmail: string;
  city: string;
  country: string;
  facilityName: string;
  profileImage?: string;
  signature?: string;
  emailId: string;
}

async function generateHippaPDF(formData: HippaFormData): Promise<Buffer> {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();

    // Embed fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let yPosition = height - 50;
    const leftMargin = 50;
    const lineHeight = 20;

    // Title
    page.drawText('HIPAA Contract Form', {
      x: leftMargin,
      y: yPosition,
      size: 20,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    yPosition -= 40;

    // Form fields
    const fields = [
      { label: 'Name:', value: formData.name },
      { label: 'Email ID:', value: formData.emailId },
      { label: 'Facility Email:', value: formData.facilityEmail },
      { label: 'City:', value: formData.city },
      { label: 'Country:', value: formData.country },
      { label: 'Facility Name:', value: formData.facilityName },
    ];

    fields.forEach((field) => {
      page.drawText(field.label, {
        x: leftMargin,
        y: yPosition,
        size: 12,
        font: boldFont,
        color: rgb(0, 0, 0),
      });

      page.drawText(field.value || 'N/A', {
        x: leftMargin + 120,
        y: yPosition,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      });

      yPosition -= lineHeight;
    });

    // Profile Image (at the top, right after title)
    if (formData.profileImage) {
      try {
        const base64Data = formData.profileImage.split(',')[1] || formData.profileImage;
        const imageBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        
        let embeddedImage;
        if (formData.profileImage.includes('image/png') || formData.profileImage.includes('png')) {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        }

        const imageSize = 100;
        page.drawText('Profile Image:', {
          x: leftMargin,
          y: yPosition,
          size: 12,
          font: boldFont,
          color: rgb(0, 0, 0),
        });

        yPosition -= 20;

        page.drawImage(embeddedImage, {
          x: leftMargin,
          y: yPosition - imageSize,
          width: imageSize,
          height: imageSize,
        });

        yPosition -= imageSize + 20;
      } catch (error) {
        console.error('Error embedding profile image:', error);
        page.drawText('Profile Image: [Error loading image]', {
          x: leftMargin,
          y: yPosition,
          size: 12,
          font: font,
          color: rgb(1, 0, 0),
        });
        yPosition -= lineHeight;
      }
    }

    yPosition -= 20;

    // Signature
    if (formData.signature) {
      try {
        page.drawText('Signature:', {
          x: leftMargin,
          y: yPosition,
          size: 12,
          font: boldFont,
          color: rgb(0, 0, 0),
        });

        yPosition -= 20;

        const base64Data = formData.signature.split(',')[1] || formData.signature;
        const signatureBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        const embeddedSignature = await pdfDoc.embedPng(signatureBytes);

        const signatureWidth = 200;
        const signatureHeight = 100;

        page.drawImage(embeddedSignature, {
          x: leftMargin,
          y: yPosition - signatureHeight,
          width: signatureWidth,
          height: signatureHeight,
        });

        yPosition -= signatureHeight + 20;
      } catch (error) {
        console.error('Error embedding signature:', error);
        page.drawText('Signature: [Error loading signature]', {
          x: leftMargin,
          y: yPosition,
          size: 12,
          font: font,
          color: rgb(1, 0, 0),
        });
        yPosition -= lineHeight;
      }
    }

    // HIPAA Agreement Text
    yPosition -= 20;
    page.drawText('HIPAA Agreement:', {
      x: leftMargin,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });

    yPosition -= 20;
    page.drawText('I acknowledge that I have read and agree to the HIPAA contract terms.', {
      x: leftMargin,
      y: yPosition,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });

    yPosition -= 20;
    page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
      x: leftMargin,
      y: yPosition,
      size: 10,
      font: font,
      color: rgb(0, 0, 0),
    });

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}

async function uploadToS3(buffer: Buffer, fileName: string): Promise<string> {
  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: 'application/pdf',
      Metadata: {
        'uploaded-at': new Date().toISOString(),
        'content-type': 'application/pdf',
      }
    });

    await s3Client.send(command);
    return fileName; // Return S3 key
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload PDF to S3');
  }
}

async function generateSignedUrl(s3Key: string, expiresIn: number = 86400): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw new Error('Failed to generate access URL');
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData: HippaFormData = await request.json();

    // Validate required fields
    if (!formData.name || !formData.signature) {
      return NextResponse.json(
        { error: 'Missing required fields: name and signature' },
        { status: 400 }
      );
    }

    // Generate PDF
    const pdfBuffer = await generateHippaPDF(formData);

    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `hipaa-contracts/${formData.name.replace(/\s+/g, '-')}-${timestamp}.pdf`;

    // Upload to S3
    const s3Key = await uploadToS3(pdfBuffer, fileName);

    // Generate signed URL (24 hours)
    const accessUrl = await generateSignedUrl(s3Key, 86400);

    return NextResponse.json({
      success: true,
      s3Key,
      accessUrl,
      message: 'PDF generated and uploaded successfully'
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}