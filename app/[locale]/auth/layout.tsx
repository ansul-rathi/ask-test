// RootLayout.tsx
import { Box, Card, Container, Stack, Typography } from "@mui/material";
// import Link from "next/link";
import { Link } from '@/i18n/routing';
import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { getServerSession } from "@/app/utils/serverAuth";


interface AuthRootLayoutProps {
  children: React.ReactNode;
  params: any
}

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        ASK Medical
      </Link>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}

export default async function AuthRootLayout({ params, children }: AuthRootLayoutProps) {

  const locale = params.locale;
  const session = await getServerSession()
  // const session = await getSession() as any;

  if (session?.isAuthenticated) {
    redirect(`/${locale}`);
  }

  return (
    <Stack sx={{ height: "100vh" }}>
      <Container component="main" maxWidth="sm">
        {children}
      </Container>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Stack>
  );
}
