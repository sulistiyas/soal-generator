import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Teacher Tools Hub - Portal Kumpulan Alat Bantu Guru Berbasis AI",
  description:
    "Portal terintegrasi alat bantu guru berbasis kecerdasan buatan (AI) untuk membuat naskah soal ujian, kisi-kisi, modul ajar, rubrik asesmen, capaian rapor, dan media ajar interaktif.",
  keywords: [
    "teacher tools hub",
    "alat bantu guru ai",
    "generator soal ai",
    "modul ajar ai",
    "kisi kisi ujian",
    "kurikulum merdeka",
    "guru indonesia",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      suppressHydrationWarning
      className={`${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased scroll-smooth`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col font-sans text-slate-900 bg-slate-50"
      >
        {children}
      </body>
    </html>
  );
}
