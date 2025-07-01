import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import {
  alcoholDrugAndCancerFn,
  allergiesListFn,
  backNeckJawFn,
  bloodDisordersFn,
  cardiovascularHealthFn,
  digestiveSystemFn,
  drugHistoryFn,
  liverAndKidneyFn,
  medicalHistoryFamilyFn,
  medicalTestsFn,
  nervesMusclesFn,
  pastMedicationFn,
  patientDetailsFn,
  respiratoryHealthFn,
  surgeryListFn,
  calculateAge,
  calculateBMI,
  medicalHistory3,
} from "./utils";
import { HA_LABELS, PD_LABELS } from "./constants";

const headerTextSize = 8;
const subHeaderTextSize = 8;
const labelTextSize = 7;
const AnswerTextSize = 7;

const boldValues = {
  "Pulmonary fibrosis": true,
  "Use supplemental oxygen?": true,
  "Use supplemental oxygen.": true,
  "Implanted Device": true,
  Seizures: true,
  "Muscular Disorder": true,
  "Neurologic Disorder": true,
  "TIA or Stroke": true,
  "HIV/AIDS": true,
  "Factor V Leiden mutation": true,
  "Von Willebrand disease": true,
  "Use street/illicit drugs, marijuana, opioids?": true,
};

function boldCheck(item: any) {
  let bold = false;
  if (item.label === HA_LABELS.bmi && item.value >= 40) {
    bold = true;
  } else if (
    item.label === HA_LABELS.kidney_failure &&
    item.Dialysis == "Yes"
  ) {
    bold = true;
  }
  //any cardiovascular variable
  else if (
    item.label === HA_LABELS.heart_failure ||
    item.label === HA_LABELS.heart_valve_problem ||
    item.label === HA_LABELS.heart_attack ||
    item.label === "Palpitations/Irregular Heart Beat" ||
    item.label === HA_LABELS.artery_blockage ||
    item.label === HA_LABELS.peripheral_vascular_disease ||
    item.label === HA_LABELS.chest_pain ||
    item.label === HA_LABELS.blood_thinner ||
    item.label === HA_LABELS.stairs_trouble ||
    item.label === HA_LABELS.physical_limitations ||
    item.label === HA_LABELS.implanted_device
  ) {
    bold = true;
  }

  //Hospitalization Required
  else if (
    item.label === HA_LABELS.copd_emphysema &&
    item[HA_LABELS.hospitalization_required] == "Yes"
  ) {
    bold = true;
  }

  //cpap settings
  else if (item.label === HA_LABELS.sleep_apnea && item["CPAP Setting"] >= 14) {
    bold = true;
  } else if (item.label === HA_LABELS.diabetes && item.HbA1c >= 9) {
    bold = true;
  }
  //age condition
  else if (item.key === PD_LABELS.dob) {
    const dob = new Date(item.value);
    let age = new Date().getFullYear() - dob.getFullYear();
    if (age > 70) {
      bold = true;
    }
  }
  //blood pressure
  // else if (item.label === HA_LABELS.high_blood_pressure_treatment) {
  //   const numbersString = item[HA_LABELS.cpap_settings_blood_pressure];
  //   const numbersArray = numbersString.split("/");
  //   const firstNumber = parseInt(numbersArray[0]);
  //   const secondNumber = parseInt(numbersArray[1]);

  //   if (firstNumber >= 160 || secondNumber >= 100) bold = true;
  // }
  else if (item.key === "Problems with anesthesia or surgery.") {
    if (
      item.value.includes("Problems With Placement of a Breathing Tube") ||
      item.value.includes("Malignant Hyperthermia")
    ) {
      bold = true;
    }
  } else if (
    item.label === "Malignant Hyperthermia (in blood relatives or in yourself)"
  ) {
    bold = true;
  }
  //@ts-ignore
  else if (boldValues[item.label]) {
    bold = true;
  }

  return bold;
}

function drawFormFields({ data, page, yOffset, font, fontBold, pdfDoc }: any) {
  const { width, height } = page.getSize();

  data.forEach((row: any[]) => {
    if (yOffset < 50) {
      page = pdfDoc.addPage();
      yOffset = height - 25;
    }
    let valueLines = [];
    row.forEach((col: { key: any; value: any }, colInd: number) => {
      let { key, value } = col;
      const isBold = boldCheck(col);
      // const keyWidth = font.widthOfTextAtSize(key, labelTextSize);
      if (!value) {
        return;
      }
      const valueWidth = isBold
        ? fontBold.widthOfTextAtSize(value, AnswerTextSize)
        : font.widthOfTextAtSize(value, AnswerTextSize);
      const maxLineWidth = width / row.length - 50; // Adjust as needed

      valueLines = [value];
      if (valueWidth > maxLineWidth) {
        const words = value.split(" ");
        let line = "";
        valueLines = [];
        words.forEach((word: string) => {
          if (
            (isBold
              ? fontBold.widthOfTextAtSize(line, AnswerTextSize)
              : font.widthOfTextAtSize(line, AnswerTextSize)) <= maxLineWidth
          ) {
            line += (line ? " " : "") + word;
          } else {
            valueLines.push(line);
            line = word;
          }
        });
        if (line) valueLines.push(line);
      }

      let keyPrinted = false; // To track if the key has been printed
      const firstOrLast = colInd === 0;
      const indent = firstOrLast ? 10 : 0;
      valueLines.forEach((line, index) => {
        const yOffsetAdjusted = yOffset - index * (AnswerTextSize + 3); // Adjust as needed for line spacing

        // Print the key only before the first line of the value
        if (!keyPrinted) {
          page.drawText(key, {
            x: 10 + indent + (width / row.length) * colInd,
            y: yOffsetAdjusted,
            color: rgb(0.5, 0.5, 0.5),
            font: isBold ? fontBold : font,
            size: isBold ? labelTextSize - 0.2 : labelTextSize,
          });
          keyPrinted = true;
        }

        page.drawText(line, {
          x: 10 + indent + (width / row.length) * colInd,
          y: yOffsetAdjusted - labelTextSize - 5,
          font: isBold ? fontBold : font,
          size: isBold ? AnswerTextSize - 0.2 : AnswerTextSize,
          // size: 30,
        });
        page.drawLine({
          start: {
            x: 10 + indent + (width / row.length) * colInd,
            y: yOffsetAdjusted - labelTextSize - 7,
          },
          end: {
            x: (width / row.length) * (colInd + 1) - 25,
            y: yOffsetAdjusted - labelTextSize - 7,
          },
          thickness: 1,
          color: rgb(0.8, 0.8, 0.8),
          dashArray: [3, 3],
        });
      });
    });
    if (row?.length === 1 && !row?.[0].value) {
    } else {
      yOffset -= AnswerTextSize + 10 + valueLines.length * (AnswerTextSize + 5); // Adjust as needed
    }
  });

  return { yOffset, page };
}

function drawTable({
  pdfDoc,
  currentPage,
  numRows,
  numCols,
  yOffset,
  textArray,
  font,
  fontSize = 8,
}: any) {
  console.log({ textArray });
  const cellWidth = 100;
  const cellHeight = 10;
  let actualYOffset = yOffset;
  const { height } = currentPage.getSize();
  for (let row = 0; row < numRows; row++) {
    if (yOffset - cellHeight * row < 50) {
      currentPage = pdfDoc.addPage();
      yOffset = height - 20;
    }
    for (let col = 0; col < numCols; col++) {
      let leftWidth = 20;
      for (let i = 0; i < col; i++) {
        leftWidth += textArray[row][i]?.width;
      }

      const x = leftWidth;
      const y = yOffset + fontSize - (row + 1) * cellHeight;

      // Draw a rectangle for each cell
      console.log({ row, col });
      currentPage.drawRectangle({
        x,
        y,
        width: textArray[row][col].width ?? cellWidth,
        // width: 30,
        height: cellHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
        color: textArray[row][col].color ?? rgb(1, 1, 1),
      });

      // Add text inside the cell
      let text =
        textArray[row] && textArray[row][col] ? textArray[row][col].value : "";
      if (!text) {
        text = "";
      }
      currentPage.drawText(text, {
        x: x + 5, // Adjust for padding
        y: y + cellHeight / 2 - 2, // Adjust for vertical alignment
        font: font,
        size: fontSize,
        // size: 30,
        color: rgb(0, 0, 0),
      });

      actualYOffset = y;
    }
  }
  return { yOffset: actualYOffset, page: currentPage };
}

function drawSubHeading({
  page,
  heading,
  startX = 20,
  yOffset,
  size = subHeaderTextSize,
  // size = 30,
  font,
  pdfDoc,
}: any) {
  const { height } = page.getSize();
  if (yOffset < 25) {
    page = pdfDoc.addPage();
    yOffset = height - 25;
  }
  page.drawText(heading, {
    x: startX,
    y: yOffset,
    size,
    font,
  });
  yOffset = yOffset - subHeaderTextSize - 4;
  return { yOffset, page };
}

function drawDetailedListItems({
  page,
  startX,
  yOffset,
  listItems,
  bulletRadius,
  font,
  fontBold,
  fontSize,
  spacing,
  itemsPerRow,
  keyValueSpacing = 2,
  pdfDoc,
}: any) {
  const { width, height } = page.getSize();
  const halfWidth = width / 2; // Half width of the page
  let currentY = yOffset;

  // Group items into rows based on itemsPerRow
  const rows = [];
  for (let i = 0; i < listItems.length; i += itemsPerRow) {
    const rowItems = listItems.slice(i, i + itemsPerRow);
    rows.push(rowItems);
  }

  // Process each row
  for (const row of rows) {
    if (currentY < 20) {
      page = pdfDoc.addPage();
      currentY = height - 25;
    }

    const rowLayout = row.map((item: any, index: number) => {
      const isBold = boldCheck(item);
      const isDetailed = Object.keys(item).length > 1;
      const colX = index === 0 ? startX : startX + halfWidth;

      // Split label into lines if needed
      let labelLines: string[] = [];
      let currentLine = "";
      const words = (item.label || "").split(" ");
      const maxLabelWidth = halfWidth - (bulletRadius * 2 + 2 + 10); // padding

      words.forEach((word: any, idx: number) => {
        const testLine = currentLine ? currentLine + " " + word : word;
        const testWidth = (isBold ? fontBold : font).widthOfTextAtSize(
          testLine,
          fontSize
        );
        if (testWidth > maxLabelWidth && currentLine) {
          labelLines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
        if (idx === words.length - 1) {
          labelLines.push(currentLine);
        }
      });

      const labelWidth = Math.max(
        ...labelLines.map((line) =>
          (isBold ? fontBold : font).widthOfTextAtSize(line, fontSize)
        )
      );

      // Calculate needed height for the item
      let itemHeight = fontSize + (labelLines.length - 1) * (fontSize);

      // Add space for detail chips if needed
      if (isDetailed) {
       
        const detailKeys = Object.keys(item).filter(
          (key) => key !== "label" && key !== "isBold"
        );
        const chipsPerLine = Math.floor(
          halfWidth /
            (font.widthOfTextAtSize(" Key : Value ", fontSize) + keyValueSpacing)
        );
        const chipLines = Math.ceil(detailKeys.length / chipsPerLine);
        if (labelWidth > halfWidth /2 || chipLines > 1) {
          itemHeight += chipLines  * (fontSize + keyValueSpacing);
        }
      }

      return {
        item,
        isBold,
        labelLines,
        labelWidth,
        colX,
        itemHeight,
        isDetailed,
      };
    });

    // Find the tallest item in this row
    const rowHeight = Math.max(
      ...rowLayout.map((layout: any) => layout.itemHeight)
    );

    // Second pass: render each item using the calculated row height
    rowLayout.forEach((layout: any) => {
      const { item, isBold, labelLines, labelWidth, colX, isDetailed } = layout;

      // Draw bullet
      page.drawCircle({
        x: colX + bulletRadius,
        y: currentY + bulletRadius,
        size: bulletRadius / 2,
        color: rgb(0, 0, 0),
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
        fill: false,
      });

      // Draw label text (multiline)
      let labelY = currentY;
      labelLines.forEach((line: any, idx: number) => {
        page.drawText(line, {
          x: colX + bulletRadius * 2 + 2,
          y: labelY,
          font: isBold ? fontBold : font,
          size: isBold ? fontSize - 0.5 : fontSize,
          color: rgb(0, 0, 0),
        });
        if (idx < labelLines.length - 1) {
          labelY -= fontSize + 2; // line spacing
        }
      });

      // Draw detail chips if needed
      if (isDetailed) {
        let rectX = colX + keyValueSpacing + labelWidth;
        let textY = currentY;

        Object.keys(item).forEach((key) => {
          if (key !== "label" && key !== "isBold") {
            const value = item[key] || "";
            const text = `${key}: ${value}`;
            const textWidth = font.widthOfTextAtSize(text, fontSize);

            let willExceed =
              rectX + textWidth + keyValueSpacing > colX + halfWidth;
            if (willExceed) {
              textY -= fontSize + spacing;
              rectX = colX + keyValueSpacing;
            }

            page.drawRectangle({
              x: rectX + 1,
              y: textY - 2,
              width: textWidth + 4,
              height: fontSize + 2,
              color: rgb(0.9, 0.9, 1),
            });

            page.drawText(text, {
              x: rectX + 3,
              y: textY,
              font: font,
              size: fontSize,
              color: rgb(0, 0, 0),
            });

            rectX += textWidth + keyValueSpacing;
          }
        });
      }
    });

    // Move to the next row position
    currentY -= rowHeight + spacing;
  }

  return { yOffset: currentY, page };
}
function drawListIWithChips({
  page,
  startX,
  yOffset,
  listItems,
  bulletRadius,
  font,
  fontBold,
  fontSize,
  spacing,
  itemsPerRow,
  keyValueSpacing = 2,
  pdfDoc,
}: any) {
  // console.log("listItems", listItems)
  const { width, height } = page.getSize();
  const halfWidth = width / 2; // Half width of the page
  let currentX = startX;
  let currentY = yOffset;
  let totalWidth = 0;

  for (let i = 0; i < listItems.length; i++) {
    if (currentY < 20) {
      page = pdfDoc.addPage();
      currentY = height - 25;
    }
    const item = listItems[i];
    const isDetailed = Object.keys(item).length > 1;

    if (itemsPerRow === 2) {
      if ((i + 1) % 2 === 0) {
        currentX = startX + halfWidth;
      } else {
        currentX = startX;
      }
    }

    page.drawCircle({
      x: currentX + bulletRadius,
      y: currentY + bulletRadius,
      size: bulletRadius / 2,
      // size: 30,
      color: rgb(0, 0, 0), // Border color
      borderColor: rgb(0, 0, 0), // Border color
      borderWidth: 1, // Border width
      fill: false, // No fill
    });

    // Draw label text
    page.drawText(item.label || "", {
      x: currentX + bulletRadius * 2 + 2,
      y: currentY,
      font: boldCheck(item) ? fontBold : font,
      size: fontSize,
      // size: 30,
      color: rgb(0, 0, 0),
    });
    // console.log("item data", item.label, fontSize)
    const labelWidth = font.widthOfTextAtSize(item.label, fontSize);
    // const labelWidth = 100;

    if (isDetailed) {
      let rectX = currentX + keyValueSpacing + labelWidth;
      let textY = currentY;
      Object.keys(item).forEach((key) => {
        if (key !== "label" && key !== "isBold") {
          const value = item[key] || "";
          const text = `${value}`;
          const textWidth = font.widthOfTextAtSize(`${value}`, fontSize);
          let willExceed =
            rectX + textWidth + keyValueSpacing > currentX + halfWidth;
          if (willExceed) {
            currentY -= fontSize + spacing;
            rectX = currentX + keyValueSpacing;
            textY = currentY;
          }
          page.drawRectangle({
            x: rectX + 1,
            y: textY - 2,
            width: textWidth + 4,
            height: fontSize + 2,
            // height: 30,
            color: rgb(0.9, 0.9, 1),
          });
          page.drawText(text, {
            x: rectX + 3,
            y: textY,
            font: font,
            size: fontSize,
            // size: 30,
            color: rgb(0, 0, 0),
          });
          rectX += textWidth + keyValueSpacing;
        }
      });
      totalWidth = rectX;
    } else {
      totalWidth = currentX + labelWidth + bulletRadius * 2 + spacing + 2;
    }

    if (itemsPerRow === 2 && (i + 1) % 2 !== 0) {
      currentX = startX + halfWidth;
    } else {
      currentX = totalWidth;
    }

    // Move to the next row if needed
    if (totalWidth > halfWidth) {
      currentX = startX;
      currentY -= fontSize + spacing;
    }
  }

  return { yOffset: currentY - fontSize - spacing, page };
}
function drawListItems({
  page,
  startX,
  yOffset,
  listItems,
  bulletRadius,
  font,
  fontSize,
  spacing,
  itemsPerRow,
}: any) {
  let currentX = startX;
  let currentY = yOffset;

  for (let i = 0; i < listItems.length; i++) {
    const item = listItems[i];
    const textWidth = font.widthOfTextAtSize(item, fontSize);

    // Draw bullet
    page.drawCircle({
      x: currentX + bulletRadius,
      y: currentY + bulletRadius,
      size: bulletRadius,
      // size: 30,
      color: rgb(0, 0, 0),
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
    });

    // Draw text
    page.drawText(item, {
      x: currentX + bulletRadius * 2 + 2,
      y: currentY,
      font: font,
      size: fontSize,
      // size: 30,
      color: rgb(0, 0, 0),
    });

    currentX += bulletRadius * 2 + textWidth + 10; // Add spacing between bullet and text

    // Move to the next row if needed
    if ((i + 1) % itemsPerRow === 0) {
      currentX = startX;
      currentY -= fontSize + spacing;
    }
  }

  return currentY - fontSize - spacing;
}

// async function embedImagesPage({
//   images,
//   form,
//   pdfDoc,
//   font,
//   fontBold,
//   body,
// }: {
//   images: string[];
//   form: any;
//   pdfDoc: any;
//   font: any;
//   fontBold: any;
//   body: any;
// }) {
//   const page = pdfDoc.addPage();
//   const { width, height } = page.getSize();

//   // Calculate the available height for each image
//   const availableHeight = height / Math.max(images.length, 2);

//   for (let i = 0; i < images.length; i++) {
//     const imageData = images[i];

//     // Parse the Base64 image source to extract type and data
//     const matches = imageData.match(/^data:(image\/\w+);base64,(.+)$/);
//     if (!matches) {
//       console.error("Invalid Base64 image source");
//       continue; // Skip to the next image
//     }

//     const [, mimeType, base64Data] = matches;
//     const imageBytes = Uint8Array.from(atob(base64Data), (c) =>
//       c.charCodeAt(0)
//     );

//     let embeddedImage;
//     // Embed the image into the PDF
//     if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
//       embeddedImage = await pdfDoc.embedJpg(imageBytes);
//     } else if (mimeType === "image/png") {
//       embeddedImage = await pdfDoc.embedPng(imageBytes);
//     } else {
//       console.error("Invalid image source: only jpg or png allowed");
//       continue;
//     }

//     // Calculate dimensions and scale image to fit available height
//     const dimensions = embeddedImage.scaleToFit(
//       width - 50,
//       availableHeight - 20
//     );

//     // Draw the image onto the page
//     page.drawImage(embeddedImage, {
//       x: 25,
//       y: height - availableHeight * (i + 1) + 10,
//       width: dimensions.width,
//       height: dimensions.height,
//     });
//   }

//   let x = width / 2 + 140;
//   let y = height - 50;
//   // heart auscultation
//   page.drawText("Heart Auscultation", {
//     x: x,
//     y: y,
//     size: 15,
//     color: rgb(0, 0, 0),
//   });
//   y -= 24;
//   const checkBoxHeart = form.createCheckBox("heart.auscultation");
//   checkBoxHeart.addToPage(page, {
//     x,
//     y: y,
//     width: 12,
//     height: 12,
//     textColor: rgb(0, 1, 0),
//     backgroundColor: rgb(1, 1, 1),
//     borderColor: rgb(0, 0, 0),
//     borderWidth: 2,
//   });
//   // Draw text
//   page.drawText("Normal", {
//     x: x + 20,
//     y: y + 2,
//     size: 12,
//     color: rgb(0, 0, 0),
//   });

//   y -= 30;

//   page.drawText("Lung Auscultation", {
//     x: x,
//     y: y,
//     size: 15,
//     color: rgb(0, 0, 0),
//   });
//   y -= 24;

//   const checkBoxLung = form.createCheckBox("lung.auscultation");

//   checkBoxLung.addToPage(page, {
//     x: x,
//     y: y,
//     width: 12,
//     height: 12,
//     textColor: rgb(0, 1, 0),
//     backgroundColor: rgb(1, 1, 1),
//     borderColor: rgb(0, 0, 0),
//     borderWidth: 2,
//   });
//   // Draw text
//   page.drawText("Normal", {
//     x: x + 20,
//     y: y + 2,
//     size: 12,
//     color: rgb(0, 0, 0),
//   });

//   y -= 20;
//   const arr = medicalHistory3(body);
//   const flattenedArray = arr.flat(Infinity);

//   drawListItems({
//     page,
//     startX: x,
//     yOffset: y,
//     listItems: flattenedArray,
//     bulletRadius: 2,
//     font,
//     fontSize: 10,
//     spacing: 1,
//     itemsPerRow: 1,
//   });
// }

async function embedImagesPage({
  images,
  form,
  pdfDoc,
  font,
  fontBold,
  body,
}: {
  images: string[];
  form: any;
  pdfDoc: any;
  font: any;
  fontBold: any;
  body: any;
}) {
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();

  // Starting position for the first image
  let currentY = height - 20;

  // Track all rendered image heights for debugging
  const renderedImageHeights = [];

  for (let i = 0; i < images.length; i++) {
    const imageData = images[i];

    // Parse the Base64 image source to extract type and data
    const matches = imageData.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!matches) {
      console.error("Invalid Base64 image source");
      continue; // Skip to the next image
    }

    const [, mimeType, base64Data] = matches;
    const imageBytes = Uint8Array.from(atob(base64Data), (c) =>
      c.charCodeAt(0)
    );

    let embeddedImage;
    // Embed the image into the PDF
    if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
      embeddedImage = await pdfDoc.embedJpg(imageBytes);
    } else if (mimeType === "image/png") {
      embeddedImage = await pdfDoc.embedPng(imageBytes);
    } else {
      console.error("Invalid image source: only jpg or png allowed");
      continue;
    }

    // Get original dimensions of the image
    const origWidth = embeddedImage.width;
    const origHeight = embeddedImage.height;

    // Maximum width for the image (50% of page width if too large)
    let maxWidth = width - 50; // Default max width

    // If the image would take more than 50% of the page width, limit it to half the width
    if (origWidth > width * 0.5) {
      maxWidth = width * 0.5;
    }

    // Calculate dimensions with adjusted width
    const dimensions = embeddedImage.scaleToFit(maxWidth, height * 0.3); // Limit height to 30% of page

    // Draw the image onto the page with updated positioning
    page.drawImage(embeddedImage, {
      x: 25,
      y: currentY - dimensions.height, // Position based on current Y position
      width: dimensions.width,
      height: dimensions.height,
    });

    // Store rendered image height for debugging
    renderedImageHeights.push(dimensions.height);

    // Update the current Y position for the next image
    // Add a small fixed gap (20 units) between images
    currentY = currentY - dimensions.height - 20;
  }

  // Log the heights of each rendered image (for debugging)
  console.log("Rendered image heights:", renderedImageHeights);

  // Right side content position
  let x = width / 2 + 140;
  let y = height - 50;

  // heart auscultation
  page.drawText("Heart Auscultation", {
    x: x,
    y: y,
    size: 15,
    color: rgb(0, 0, 0),
  });
  y -= 24;
  const checkBoxHeart = form.createCheckBox("heart.auscultation");
  checkBoxHeart.addToPage(page, {
    x,
    y: y,
    width: 12,
    height: 12,
    textColor: rgb(0, 1, 0),
    backgroundColor: rgb(1, 1, 1),
    borderColor: rgb(0, 0, 0),
    borderWidth: 2,
  });
  // Draw text
  page.drawText("Normal", {
    x: x + 20,
    y: y + 2,
    size: 12,
    color: rgb(0, 0, 0),
  });

  y -= 30;

  page.drawText("Lung Auscultation", {
    x: x,
    y: y,
    size: 15,
    color: rgb(0, 0, 0),
  });
  y -= 24;

  const checkBoxLung = form.createCheckBox("lung.auscultation");

  checkBoxLung.addToPage(page, {
    x: x,
    y: y,
    width: 12,
    height: 12,
    textColor: rgb(0, 1, 0),
    backgroundColor: rgb(1, 1, 1),
    borderColor: rgb(0, 0, 0),
    borderWidth: 2,
  });
  // Draw text
  page.drawText("Normal", {
    x: x + 20,
    y: y + 2,
    size: 12,
    color: rgb(0, 0, 0),
  });

  y -= 20;
  const arr = medicalHistory3(body);
  const flattenedArray = arr.flat(Infinity);

  drawListItems({
    page,
    startX: x,
    yOffset: y,
    listItems: flattenedArray,
    bulletRadius: 2,
    font,
    fontSize: 10,
    spacing: 1,
    itemsPerRow: 1,
  });
}

async function createAnesthesiaConsentForm({
  name,
  signatureBase64,
  pdfDoc,
}: any) {
  const page = pdfDoc.addPage();

  const consentText = `
  Although rare, unexpected severe complications with anesthesia can occur and include the possibility of dental damage,
  sore throat, hoarse voice, nerve damage, drug reactions, blood clots, loss of sensation,
  loss of limb function, paralysis, infection, lung aspiration, headaches, seizures, stroke,
  brain damage, bleeding, blood vessel damage, awareness under anesthesia, heart attack or death.

  These risks are higher based on:
  • patient’s baseline medical condition
  • if the patient withholds pertinent medical information,
  • does not follow medical instructions of when to stop medications
  • if the patient eats food within 8 hours of the procedure.

  Anesthetic technique is determined by many factors including my physical condition,
  the type of procedure, my doctor’s preference and my own preference.
  Types of anesthesia include:
  • General Anesthesia - unconscious, may require airway intervention
  • Regional Anesthesia - utilizing local anesthetics to numb a certain area of the body,
    will result in decreased sensation / movement of the affected area.
  • Monitored Anesthesia Care - sedated, but conscious. Reduced anxiety, reduced pain,
    may result in partial amnesia.

  All forms of anesthesia will require intravenous access.
  You will have an opportunity prior to the procedure to have any remaining questions answered.

  I, ${name}, certify and acknowledge that I have read this form.
  I, ${name}, understand the risks of the procedure.
  I, ${name}, consent to anesthesia services and authorize that it be administered
  as deemed appropriate by them.
  `;

  // Add consent text to the page
  page.drawText("Anesthesia Consent Form", {
    x: page.getWidth() / 2 - 100,
    y: page.getHeight() - 30,
    size: 14,
    lineHeight: 15,
    color: rgb(0, 0, 0),
  });
  page.drawText(consentText, {
    x: 25,
    y: page.getHeight() - 40,
    size: 8,
    lineHeight: 12,
    color: rgb(0, 0, 0),
  });

  const matches = signatureBase64.match(/^data:(image\/\w+);base64,(.+)$/);
  if (!matches) {
    console.error("Invalid Base64 image source");
    // continue; // Skip to the next image
  }

  const [, mimeType, base64Data] = matches;
  const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

  let signatureImage;
  // Embed the image into the PDF
  if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
    signatureImage = await pdfDoc.embedJpg(imageBytes);
  } else if (mimeType === "image/png") {
    signatureImage = await pdfDoc.embedPng(imageBytes);
  } else {
    console.error("Invalid image source: only jpg or png allowed");
  }
  // const signatureDimensions = signatureImage.scale(0.5);
  const signatureDimensions = signatureImage.scaleToFit(200, 100);
  page.drawImage(signatureImage, {
    x: 150,
    y: 50,
    width: signatureDimensions.width,
    height: signatureDimensions.height,
  });

  // Add signature line
  page.drawText("_____________ (signature)", {
    x: 200,
    y: 20,
    size: 12,
    lineHeight: 15,
    color: rgb(0, 0, 0),
  });

  // Add date
  const today = new Date();
  const date = today.toLocaleDateString();

  page.drawText(`Date: ${date}`, {
    x: 400,
    y: 20,
    size: 12,
    lineHeight: 15,
    color: rgb(0, 0, 0),
  });
}

export async function CreateForm1(body: any) {
  const patientDetails = patientDetailsFn(body);

  const allergies = allergiesListFn(body);
  const surgeries = surgeryListFn(body);
  const medicalHistoryFamily = medicalHistoryFamilyFn(body);

  const medicalTests = medicalTestsFn(body);
  const drugHistory = drugHistoryFn(body);
  const medicationsLastMonth = pastMedicationFn(body);
  const patientHeightFeet = Number(body.patient_information?.height_feet);
  const patientHeightInches = Number(body.patient_information?.height_inches);
  const patientWeight = Number(body.patient_information?.weight);
  const healthAssessment = [
    {
      label: calculateBMI(patientHeightFeet, patientHeightInches, patientWeight)
        .label,
    },
    ...cardiovascularHealthFn(body),
    ...respiratoryHealthFn(body),
    ...alcoholDrugAndCancerFn(body),
    ...bloodDisordersFn(body),
    ...liverAndKidneyFn(body),
    ...digestiveSystemFn(body),
    ...backNeckJawFn(body),
    ...nervesMusclesFn(body),
  ];
  if (body?.patient_information?.dob) {
    const ageInYears = calculateAge(body.patient_information?.dob);
    if (ageInYears < 2) {
      const dob = new Date(body.patient_information?.dob);
      const now = new Date();
      const ageInMonths =
        (now.getFullYear() - dob.getFullYear()) * 12 +
        (now.getMonth() - dob.getMonth());
      healthAssessment.unshift({
        label: "Age: " + ageInMonths + " months",
      });
    } else {
      healthAssessment.unshift({
        label: "Age: " + ageInYears,
      });
    }
  }

  try {
    const numCols = 2;
    const fontSize = 7;
    let result: any = {};

    const pdfDoc = await PDFDocument.create();
    const form = pdfDoc.getForm();

    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let currentPage = pdfDoc.addPage();
    const { width, height } = currentPage.getSize();

    let yOffset = height - 25; // Initial y-offset for drawing fields

    result = drawFormFields({
      page: currentPage,
      yOffset,
      font,
      fontBold,
      pdfDoc: pdfDoc,
      data: patientDetails,
    });

    yOffset = result.yOffset;
    currentPage = result.page;

    yOffset -= 10;
    console.log({ medicalHistoryFamily });

    //medical history family
    result = drawFormFields({
      page: currentPage,
      yOffset,
      font,
      fontBold,
      pdfDoc: pdfDoc,
      data: medicalHistoryFamily,
    });

    yOffset = result.yOffset;
    currentPage = result.page;

    result = drawSubHeading({
      page: currentPage,
      heading: "Health Assessment",
      yOffset,
      font: timesRomanFont,
      pdfDoc,
    });
    yOffset = result.yOffset;
    currentPage = result.page;

    const bulletRadius = 2;
    const spacing = 6;
    const itemsPerRow = 2;
    const keyValueSpacing = 10;

    result = drawDetailedListItems({
      page: currentPage,
      startX: 20,
      yOffset,
      listItems: healthAssessment,
      bulletRadius,
      font,
      fontBold,
      fontSize: AnswerTextSize,
      spacing,
      itemsPerRow,
      keyValueSpacing,
      pdfDoc,
    });

    yOffset = result.yOffset;
    currentPage = result.page;

    if (body?.health_assesment?.additional_medical_illnesses) {
      result = drawFormFields({
        page: currentPage,
        yOffset,
        font,
        pdfDoc,
        data: [
          [
            {
              key: "Additional medical illnesses that were not noted above",
              value: body?.health_assesment?.additional_medical_illnesses ?? "",
            },
          ],
        ],
      });
      yOffset = result.yOffset;
      currentPage = result.page;
    }

    if (drugHistory?.length > 0) {
      result = drawSubHeading({
        page: currentPage,
        heading: "Medications:",
        startX: 20,
        yOffset,
        pdfDoc,
      });
      yOffset = result.yOffset;
      currentPage = result.page;

      result = drawDetailedListItems({
        page: currentPage,
        startX: 20,
        yOffset,
        listItems: drugHistory,
        bulletRadius,
        font,
        fontSize: AnswerTextSize,
        spacing,
        itemsPerRow: 2,
        keyValueSpacing,
        pdfDoc,
      });
      yOffset = result.yOffset;
      currentPage = result.page;
    }

    if (medicationsLastMonth.length > 0) {
      result = drawSubHeading({
        page: currentPage,
        heading:
          "Medications Patient has taken in the last month (other than above).",
        yOffset,
        pdfDoc,
      });
      yOffset = result.yOffset;
      currentPage = result.page;

      result = drawTable({
        pdfDoc,
        currentPage,
        numRows: medicationsLastMonth.length,
        numCols: medicationsLastMonth[0].length,
        yOffset,
        textArray: medicationsLastMonth,
        font,
        fontSize,
      });
      yOffset = result.yOffset;
      currentPage = result.page;
      yOffset -= 15;
    }

    if (allergies && allergies.length > 0) {
      result = drawSubHeading({
        page: currentPage,
        heading: "Allergies",
        startX: 20,
        yOffset: yOffset,
        pdfDoc,
      });
      yOffset = result.yOffset;
      currentPage = result.page;

      result = drawListIWithChips({
        page: currentPage,
        startX: 20,
        yOffset: yOffset,
        listItems: allergies,
        bulletRadius: 2,
        font,
        fontSize: AnswerTextSize,
        spacing: 3,
        itemsPerRow: 2,
        keyValueSpacing: 6,
        pdfDoc,
      });
      yOffset = result.yOffset;
      currentPage = result.page;

      yOffset -= 10;
    }
    if (surgeries && surgeries.length > 0) {
      result = drawSubHeading({
        page: currentPage,
        heading: "Prior Surgeries or Procedures",
        startX: 20,
        yOffset,
        pdfDoc,
      });
      yOffset = result.yOffset;
      currentPage = result.page;

      result = drawTable({
        pdfDoc,
        currentPage,
        numRows: surgeries.length,
        numCols,
        yOffset,
        textArray: surgeries,
        font,
        fontSize,
      });
      yOffset = result.yOffset;
      currentPage = result.page;

      yOffset -= 15;
    }

    result = drawFormFields({
      page: currentPage,
      yOffset,
      font,
      pdfDoc,
      data: [
        [
          {
            key: "Comments or Questions for the anesthesia provider?",
            value:
              body?.health_assesment?.health_detail_write_any_questions ??
              "N/A",
          },
        ],
      ],
    });

    yOffset = result.yOffset;
    currentPage = result.page;

    if (medicalTests.length > 0) {
      result = drawSubHeading({
        page: currentPage,
        heading: "Tests:",
        startX: 20,
        yOffset,
        pdfDoc,
      });
      yOffset = result.yOffset + 2;
      currentPage = result.page;

      result = drawTable({
        pdfDoc,
        currentPage,
        numRows: medicalTests.length,
        numCols: medicalTests[0].length,
        yOffset,
        textArray: medicalTests,
        font,
        fontSize,
      });
      yOffset = result.yOffset;
      currentPage = result.page;
    }

    if (body.consent && body.consent?.name) {
      await createAnesthesiaConsentForm({
        pdfDoc,
        name: body.consent.name,
        signatureBase64: body.consent.sign,
      });
    }

    if (body.images && body.images.length) {
      await embedImagesPage({
        pdfDoc,
        form,
        font,
        fontBold,
        images: body.images,
        body,
      });
    }

    const pdfBytes = await pdfDoc.save();

    // Trigger the browser to download the PDF document
    return pdfBytes;
  } catch (error) {
    console.log({ error });
  }
}
