import { Box, Container } from "@mui/material";
import React from "react";
import StepperHeader from "./component/StepperHeader";
import QuestionnaireService from "@/app/services/questionnaire";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

async function PatientFormLayout({
  params: { locale, formid },

  children,
}: Readonly<{
  params: {
    locale: string;
    formid: string;
  };
  children: React.ReactNode;
}>) {


 
  const currentPath = headers().get("referer") || ""; // Using 'referer' as fallback
  const isNotFoundPage = currentPath.includes('/not-found');

  if (!formid) {
    return redirect(`/${locale}/patient/${formid}/not-found`);
  }

  const patientQuestionnaire = await QuestionnaireService.getQuestionnaire(formid);
  if (!patientQuestionnaire?.hasData && !isNotFoundPage) {
    return redirect(`/${locale}/patient/${formid}/not-found`);
  }
  const isAlreadySubmittedPage = currentPath.includes('/already-submitted');
  console.log({patientQuestionnaire})
  if(patientQuestionnaire?.item?.submitted && !isAlreadySubmittedPage){
    return redirect(`/${locale}/patient/${formid}/already-submitted`);
  }

  return (
    <>
      <StepperHeader locale={locale} 
      //  isSubmitted={patientQuestionnaire?.item?.submitted}
        />
      <Box
        component="main"
        sx={{
          width: "100%",
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: { xs: 7, sm: 10 },
            pb: { xs: 6, sm: 8 },
          }}
        >
          {children}
          
        </Container>
      </Box>
    </>
  );
}

export default PatientFormLayout;
