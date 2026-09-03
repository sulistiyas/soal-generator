import type { Metadata } from 'next';
import { getSiteUrl } from '@/lib/site-config';

const baseUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'Generator Modul Ajar AI & RPP Kurikulum Merdeka (SD, SMP, SMA/SMK)',
  description:
    'Buat Modul Ajar Kurikulum Merdeka dan RPP 1 Lembar otomatis dengan AI. Lengkap dengan Capaian Pembelajaran (CP), Alur Tujuan Pembelajaran (ATP), Profil Pelajar Pancasila (P5), diferensiasi, asesmen, dan ekspor ke format Microsoft Word (.docx).',
  keywords: [
    'generator modul ajar ai',
    'modul ajar kurikulum merdeka',
    'pembuat rpp kurikulum merdeka',
    'rpp 1 lembar ai',
    'modul ajar sd smp sma smk',
    'modul ajar fase a b c d e f',
    'modul ajar p5 profil pelajar pancasila',
    'ekspor modul ajar docx word',
    'perangkat ajar kurikulum merdeka',
  ],
  alternates: {
    canonical: '/tools/modul-ajar',
  },
  openGraph: {
    title: 'Generator Modul Ajar AI & RPP Kurikulum Merdeka - Teacher Hub',
    description:
      'Susun Modul Ajar dan RPP Kurikulum Merdeka otomatis berbasis AI berstandar Kemendikbudristek. Gratis, terstruktur, dan siap ekspor ke Word (.docx).',
    url: `${baseUrl}/tools/modul-ajar`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generator Modul Ajar AI & RPP Kurikulum Merdeka - Teacher Hub',
    description:
      'Susun Modul Ajar dan RPP Kurikulum Merdeka otomatis berbasis AI berstandar Kemendikbudristek. Gratis, terstruktur, dan siap ekspor ke Word (.docx).',
  },
};

export default function ModulAjarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
