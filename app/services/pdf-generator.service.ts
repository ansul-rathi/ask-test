// app/services/pdf-generator.service.ts
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

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

class PDFGeneratorService {
  async generateHippaPDF(formData: HippaFormData): Promise<Buffer> {
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

      yPosition -= 20;

      // Profile Image
      if (formData.profileImage) {
        try {
          // Remove data:image/jpeg;base64, or similar prefix
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

          // Remove data:image/png;base64, prefix
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
}

export default new PDFGeneratorService();