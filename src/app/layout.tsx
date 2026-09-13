import Navbar from "@/components/navBar";
import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";
import "katex/dist/katex.min.css";
import "./globals.css";

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["200", "400", "700"],
  variable: "--font-noto-sans",
});

const notoSansMono = Noto_Sans_Mono({
  subsets: ['latin'],
  variable: '--font-noto-mono',
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
    <html lang="en" className={`${notoSans.variable} ${notoSansMono.variable} h-full antialiased`}>
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
