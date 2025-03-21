import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});
export const metadata: Metadata = {
  title: "CampFinder",
  description: "Discover and share camping experiences",
  keywords: ["camping", "outdoors", "campgrounds", "travel"],
  authors: [{ name: "Joshua Worden" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
