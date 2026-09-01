import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pembuat Kisi-Kisi & Rubrik Penilaian AI | Teacher Tools Hub',
  description:
    'Rancang matriks kisi-kisi soal ujian dan rubrik penilaian analitik/holistik standar Kemendikbudristek secara otomatis dengan AI. Ekspor langsung ke Microsoft Word (.docx).',
  keywords: [
    'kisi-kisi soal ai',
    'pembuat rubrik penilaian',
    'rubrik analitik kurikulum merdeka',
    'kisi-kisi ujian sekolah',
    'kktp kurikulum merdeka',
    'pedoman penskoran essay',
    'teacher tools hub',
    'generator soal dan kisi-kisi',
  ],
  openGraph: {
    title: 'Pembuat Kisi-Kisi & Rubrik Penilaian AI | Teacher Tools Hub',
    description:
      'Susun matriks kisi-kisi soal, rubrik analitik 4 skala capaian, dan pedoman penskoran otomatis dengan AI. Gratis dan siap ekspor ke Microsoft Word (.docx).',
    url: 'https://soal-generator.vercel.app/tools/rubrik-penilaian',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pembuat Kisi-Kisi & Rubrik Penilaian AI | Teacher Tools Hub',
    description:
      'Susun matriks kisi-kisi soal, rubrik analitik 4 skala capaian, dan pedoman penskoran otomatis dengan AI. Gratis dan siap ekspor ke Microsoft Word (.docx).',
  },
};

export default function RubrikLayout({ children }: { children: React.ReactNode }) {
  return children;
}
