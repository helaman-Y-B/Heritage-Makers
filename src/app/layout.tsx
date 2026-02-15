import type { Metadata } from "next";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Nunito_Sans, Chivo } from "next/font/google";
import "./globals.css";
import Providers from "../components/auth/Providers";


  

const nunito = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const chivo = Chivo({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Heritage Makers",
  description: "A marketplace for handcrafted items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${chivo.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Providers>
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
