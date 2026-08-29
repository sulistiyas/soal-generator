import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pratinjau Naskah Soal & Kisi-Kisi Ujian',
  description:
    'Lihat dan ekspor naskah soal ujian interaktif beserta kisi-kisi dan kunci jawaban yang dibuat dengan Teacher Tools Hub AI.',
  robots: {
    index: false, // Halaman hasil generate lokal/berbagi tidak perlu diindeks massal agar tidak terjadi duplicate content
    follow: true,
  },
};

export default function GeneratedExamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
