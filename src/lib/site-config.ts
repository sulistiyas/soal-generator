/**
 * Konfigurasi Terpusat SEO & Identitas Website Teacher Tools Hub
 */

export function getSiteUrl(): string {
  // 1. Cek environment variable kustom pengguna
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const url = process.env.NEXT_PUBLIC_SITE_URL.trim();
    return url.startsWith('http') ? url : `https://${url}`;
  }

  // 2. Jika di environment lokal development tanpa env khusus, gunakan localhost
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }

  // 3. Cek production URL bawaan Vercel
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  // 4. Default target domain produksi
  return 'https://teacher-hub-edu.vercel.app';
}

export const siteConfig = {
  name: 'Teacher Hub',
  shortName: 'TeacherHub',
  title: 'Teacher Hub - Portal Kumpulan Alat Bantu Guru Berbasis AI Indonesia',
  description:
    'Portal alat bantu guru berbasis AI gratis di Indonesia untuk membuat naskah soal ujian otomatis (Pilihan Ganda, Essay, Isian, Benar/Salah), kisi-kisi, rubrik penilaian, modul ajar Kurikulum Merdeka & K-13, dan ekspor ke Microsoft Word (.docx).',
  keywords: [
    'teacher hub',
    'teacher-hub-edu',
    'teacher tools hub',
    'generator soal ai',
    'pembuat soal otomatis',
    'generator modul ajar ai',
    'modul ajar kurikulum merdeka',
    'kisi kisi ujian kurikulum merdeka',
    'rubrik penilaian asesmen',
    'rpp 1 lembar kurikulum merdeka',
    'bank soal kurikulum merdeka',
    'soal hots lots mots',
    'alat bantu guru ai',
    'aplikasi guru indonesia',
    'ekspor soal word docx',
    'guru sd smp sma smk madrasah',
  ],
  author: {
    name: 'Sulistiya Nugroho & Tim Komunitas Guru Indonesia',
    url: 'https://saweria.co/sulistiyanugroho',
  },
  creator: 'Sulistiya Nugroho',
  publisher: 'Teacher Hub Indonesia',
  themeColor: '#4f46e5',
  backgroundColor: '#f8fafc',
  locale: 'id_ID',
  links: {
    saweria: 'https://saweria.co/sulistiyanugroho',
    github: 'https://github.com/sulistiyas/soal-generator',
  },
};
