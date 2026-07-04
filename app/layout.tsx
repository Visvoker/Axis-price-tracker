import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AxisClut",
  description: "Join Axis Cult to change your miserable life! ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="flex h-full flex-col">
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
