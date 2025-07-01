import axios from "../utils/axios";
import { IRegisterFormPayload } from "@/app/interfaces/form-interfaces";
import { mgClient, mgDomain } from "@/app/lib/mailgun";

interface EmailData {
  from: string;
  to: string;
  subject: string;
  text: string;
}

export const queryKey = {
  form: "form",
};

// API call functions
export async function submitForm(id: string | number, body: any) {
  const path = window.location.pathname;
  const url = "/form" + "/" + id;

  let res = await axios.put(url, body);
  console.log("body params", body);
  return res.data;
}

export async function registerForm(params: IRegisterFormPayload) {
  const path = window.location.pathname;
  params.path = path;
  let res = await axios.post("/form", params);
  return res.data;
}

export async function getForm(id: string | number) {
  const url = "/form" + "/" + id;
  console.log("id", id);
  let response = await axios.get(url).then((res) => res.data);
  return response.data;
}

// export const useGetFormDetails = (params: { id: string | number }) => {
//   return useQuery({
//     queryKey: [queryKey.form],
//     queryFn: () => getForm(params.id),
//     refetchOnWindowFocus: false,
//     refetchOnReconnect: false,
//     refetchOnMount: false,
//   });
// };

// Send email function
export const sendEmail = async (emailData: EmailData) => {
  const data = {
    from: emailData.from,
    to: emailData.to,
    subject: emailData.subject,
    text: emailData.text,
    attachment: [
      {
        filename: "document.pdf", // Name your PDF file appropriately
        data: "pdfBuffer",
      },
    ],
  };

  try {
    const mailgunRes = await mgClient.messages.create(mgDomain, {data});

    console.log("Mailgun response:", mailgunRes);
  } catch (error: any) {
    console.error("Failed to send email:", error.message);
    return { success: false, error: error.message };
  }
};
