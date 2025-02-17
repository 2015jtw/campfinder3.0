import type { Metadata } from "next";
import { Roboto } from "next/font/google";

import "../globals.css";
import Header from "@/components/Header";
import MobileHeader from "@/components/MobileHeader";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/Footer";

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
    <div className={`${roboto.variable} antialiased`}>
      <Header />
      <MobileHeader />
      <main>{children}</main>
      <Toaster />
      <Footer />
    </div>
  );
}
