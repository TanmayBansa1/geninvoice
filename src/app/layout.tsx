import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "sonner";
import { ClerkAuthProvider } from "@/components/providers/clerk-provider";

export const metadata: Metadata = {
  title: "GenInvoice",
  description: "GenInvoice: Streamline your business invoicing with an easy-to-use, professional invoice generation platform. Create, manage, and track invoices effortlessly for businesses and freelancers.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <ClerkAuthProvider>
          <TRPCReactProvider>
            {children}
            <Toaster richColors  />
          </TRPCReactProvider>
        </ClerkAuthProvider>
      </body>
    </html>
  );
}
