import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { RootLayoutClient } from "./client-layout-wrapper";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  icons: {
    icon: {url:'/icon.svg'}
  },
  metadataBase: new URL(defaultUrl),
  title: "capsule.email",
  description: "Build beautiful AI powered emails to stand out in the market.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={`${geistSans.className} antialiased h-full`}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}