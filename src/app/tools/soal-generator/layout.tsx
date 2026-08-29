import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site-config';

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Generator Soal AI & Kisi-Kisi Ujian (SD, SMP, SMA/SMK)',
  description:
    'Buat naskah soal ujian otomatis berbasis AI lengkap dengan kisi-kisi, kunci jawaban, dan rubrik penilaian untuk Pilihan Ganda, Essay, Isian, dan Benar/Salah. Dukung Kurikulum Merdeka & K-13 serta ekspor ke MS Word (.docx).',
  keywords: [
    'generator soal ai',
    'pembuat soal ujian otomatis',
    'kisi kisi soal kurikulum merdeka',
    'soal hots ai',
    'soal sd smp sma smk',
    'soal matematika ipa ips bahasa indonesia bahasa inggris ai',
    'ekspor soal docx',
  ],
  alternates: {
    canonical: '/tools/soal-generator',
  },
  openGraph: {
    title: 'Generator Soal AI & Kisi-Kisi Ujian - Teacher Tools Hub',
    description:
      'Susun paket soal ujian dan kisi-kisi otomatis dengan AI. Gratis, cepat, dan bisa langsung diunduh dalam format Word (.docx).',
    url: `${baseUrl}/tools/soal-generator`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generator Soal AI & Kisi-Kisi Ujian - Teacher Tools Hub',
    description:
      'Susun paket soal ujian dan kisi-kisi otomatis dengan AI. Gratis, cepat, dan bisa langsung diunduh dalam format Word (.docx).',
  },
};

export default function SoalGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
