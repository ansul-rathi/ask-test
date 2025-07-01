'use server';

import { Box, Container } from "@mui/material";
import Hero from "../components/landing-page/Hero";
import Features from "../components/landing-page/Features";
import AppHeader from "../components/layout/AppHeader";
import AppFooter from "../components/layout/AppFooter";
import HeroBanner from "../components/landing-page/HeroBanner";
import PricingPlan from "../components/landing-page/PricingPlan";
import SessionHandler from "../components/SessionHandler";
// import SessionHandler from "../components/SessionHandler";

export default async function Home({ params }: any) {
  const { locale } = params;

  return (
    <>
      <AppHeader locale={locale} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          width: "100%",
          minHeight: "100vh",
          zIndex: 10,
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: { xs: 10, sm: 16 },
            pb: { xs: 8, sm: 12 },
          }}
        >
          <HeroBanner />
          <Hero />
          <Features />
          <PricingPlan />
        </Container>
      </Box>

      <AppFooter />

      {/* Client-Side Session Handler */}
      <SessionHandler locale={locale} />
    </>
  );
}
