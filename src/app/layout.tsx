import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "sonner";
import { ClerkAuthProvider } from "@/components/providers/clerk-provider";

export const metadata: Metadata = {
  metadataBase: new URL("https://geninvoice.tanmay.space"),
  title: "GenInvoice | Invoice Generation for Businesses & Freelancers",
  description:
    "Streamline your business invoicing with GenInvoice. Create, manage, and track invoices effortlessly. Fast, secure, and professional invoice generation for businesses and freelancers.",
  keywords: [
    "invoice",
    "invoicing",
    "business",
    "freelancer",
    "SaaS",
    "billing",
    "GenInvoice",
    "invoice generation",
    "analytics",
    "email support"
  ],
  icons: [{ rel: "icon", url: "/logo.svg" }],
  openGraph: {
    title: "GenInvoice",
    description: "Streamline your business invoicing with GenInvoice.",
    url: "https://geninvoice.tanmay.space",
    siteName: "GenInvoice",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "GenInvoice - Invoice Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GenInvoice",
    description: "Streamline your business invoicing with GenInvoice.",
    images: ["/og-image.png"],
    creator: "@K_A_I11",
  },
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
