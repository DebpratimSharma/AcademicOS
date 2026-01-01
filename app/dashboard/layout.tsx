import React from "react";
import Header from "@/components/dashboard/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/Footer";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header>
        <Header />
      </header>
      <body>
          {children}
      </body>
    </div>
  );
}
