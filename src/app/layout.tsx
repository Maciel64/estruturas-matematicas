import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type React from "react";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solucionador de Matrizes | Estruturas Matemáticas",
  description:
    "Resolva problemas de álgebra linear com explicações passo a passo",
  generator: "v0.app",
  openGraph: {
    images: [
      {
        url: "/og_bg.pgn",
        width: 1200,
        height: 630,
        alt: "Solucionador de Matrizes - Estruturas Matemáticas",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
