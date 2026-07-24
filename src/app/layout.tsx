import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Sürücü Kurslarına Özel Sosyal Medya Tasarımı",
  description:
    "Sürücü kursları için özel olarak hazırladığımız sosyal medya tasarımları ile markanızı dijitalde bir adım öne taşıyın. Profesyonel Instagram post, story ve reels tasarımları.",
  keywords:
    "sürücü kursu sosyal medya, sürücü kursu tasarım, instagram post tasarımı, sosyal medya ajansı",
  openGraph: {
    title: "Sürücü Kurslarına Özel Sosyal Medya Tasarımı",
    description:
      "Sürücü kursları için özel sosyal medya tasarımları ile markanızı dijitalde bir adım öne taşıyın.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
