import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { Viewport } from "next";
import ProvidersWrapper from "./_providers/providers";

export const metadata = {
  title: "Relaxing Koala",
  description: `For lovers of great coffee, food & wine & prides itself on friendly & helpful service. We want you to leave feeling you have been genuinely looked after.
  `,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  userScalable: false,
  initialScale: 1,
  maximumScale: 1,
  width: "device-width",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "flex min-h-screen flex-col bg-background font-sans antialiased",
          GeistSans.variable,
        )}
      >
        <ProvidersWrapper>
          {children}
          <Toaster />
        </ProvidersWrapper>
      </body>
    </html>
  );
}
