import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter, Tangerine } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const elodie = localFont({
  src: "./fonts/MTD-Elodie.otf",
  variable: "--font-display",
  weight: "400",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
});

const tangerine = Tangerine({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "FAYE",
  description:
    "FAYE — Spirit Lenormand, bộ bài 37 lá minh họa thủ công, dẫn lối chiêm nghiệm và kết nối trực giác qua các biểu tượng đời thường.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${elodie.variable} ${inter.variable} ${tangerine.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
