import React from "react";
import ServerComponent from "./ServerComponent";

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  return <ServerComponent locale={locale}>{children}</ServerComponent>;
}
