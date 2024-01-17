import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { cookies } from "next/headers";

import { cn } from "~/lib/utils";
import NextAuthProvider from "~/providers/session-provider";
import { ThemeProvider } from "~/providers/theme-provider";
import { TRPCReactProvider } from "~/trpc/react";
import ToastProvider from "~/providers/toast-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "T3 Movie App",
  description: "Movie App Created by Nirmal Kumar",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased scrollbar-hide scrollbar-thin scrollbar-thumb-red-700",
          inter.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider cookies={cookies().toString()}>
            <NextAuthProvider>{children}</NextAuthProvider>
            <ToastProvider />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
