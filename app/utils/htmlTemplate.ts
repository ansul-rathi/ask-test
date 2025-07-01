import { AdditionalText, renderAdditionalText } from "../api/questionnaire/generate-report/asaScore";

export const registerFormTemp = (
  href: string,
  firstName: string,
  lastName: string,
  message: string
) => `
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ASK Application - Registration Form</title>
  <style>
    /* Add any additional styling here */
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .button {
      display: inline-block;
      padding: 10px 20px;
      background-color: #007bff;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 5px;
    }
    .button:hover {
      background-color: #0056b3;
    }
  </style>
</head>
<body>
  <div class="container">
    <p>Hello,</p>
    <p>${message}</p>
    <p>To avoid delays in your upcoming procedure, your doctor has requested that you fill out this medical screening questionnaire.</p>
    <p>In order to complete the Pre-Anesthesia process, please click on the button below:</p>
    <p style="text-align: center;"><a class="button" href="${href}" target="_blank">Fill Form</a></p>
    <p>You can copy and paste the following link:</p>
    <p style="text-align: center;"><a href="${href}" target="_blank">${href}</a></p>
    <p>Thank you for choosing ASK!</p>
  </div>
</body>
</html>
`;

export const deliverPdfTemplate = (additionalText: AdditionalText[]) => `<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Pre-Anesthesia Questionnaire Form</title>
<style>
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
    }
    .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 5px;
    }
    .header {
        text-align: center;
        margin-bottom: 20px;
    }
    .content {
        margin-bottom: 20px;
    }
    .button {
        display: inline-block;
        background-color: #007bff;
        color: #fff;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 5px;
    }
</style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Pre-Anesthesia Questionnaire Form</h2>
        </div>
        <div class="content">
            <p>Hello,</p>
            <p>The patient has filled out the pre-anesthesia questionnaire form.</p>
            <p style="text-decoration: underline;">Education</p>
            <ul>
                ${renderAdditionalText(additionalText)}
            <p>Please find the PDF attachment containing the details.</p>
        </div>
        <div class="footer">
          <p>Thank you for choosing ASK!</p>
        </div>
    </div>
</body>
</html>
`;
