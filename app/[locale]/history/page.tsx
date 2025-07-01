
import QuestionaireHistoryTable from "@/app/components/history-table";
import AppHeader from "@/app/components/layout/AppHeader";
import { Container } from "@mui/material";

const Page = ({ params }: any) => {
  const { locale } = params;

  return (
    <div className="p-6">
      <AppHeader locale={locale} />

      <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: { xs: 10, sm: 16 },
            pb: { xs: 8, sm: 12 },
          }}
        >

        <h1 className="text-2xl font-bold mb-4">Medical Requests</h1>
        <QuestionaireHistoryTable />
        </Container>
    </div>
  );
};

export default Page;
