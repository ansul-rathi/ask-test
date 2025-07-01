import formData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(formData);
const mgClient = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY || "",
});
const mgDomain = process.env.MAILGUN_DOMAIN || "";

export { mailgun, mgClient, mgDomain };
