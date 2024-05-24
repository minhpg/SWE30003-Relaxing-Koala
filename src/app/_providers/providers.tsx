"use client";

import { ThemeProvider } from "@/components/ui/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { TRPCReactProvider } from "@/trpc/react";
import { SessionProvider } from "next-auth/react";

export default function ProvidersWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ThemeProvider defaultTheme="dark" attribute="class">
        <TRPCReactProvider>
          <ToastProvider>{children}</ToastProvider>
        </TRPCReactProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
