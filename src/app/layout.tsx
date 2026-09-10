import Navbar from "@/components/navBar";
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["200", "400", "700"],
  variable: "--font-noto-sans",
});

export const metadata: Metadata = {
  title: "Lillliant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${notoSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <div className="h-24">
          <Navbar />
        </div>
        <div className="h-full flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
