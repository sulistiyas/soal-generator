/**
 * Konfigurasi Terpusat SEO & Identitas Website Teacher Tools Hub
 */

export function getSiteUrl(): string {
  // 1. Cek environment variable kustom pengguna
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    const url = process.env.NEXT_PUBLIC_SITE_URL.trim();
    return url.startsWith('http') ? url : `https://${url}`;
  }

  // 2. Cek production URL bawaan Vercel
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  // 3. Cek deployment URL Vercel (preview / branch)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 4. Fallback ke localhost untuk pengembangan lokal
  return 'http://localhost:3000';
}

export const siteConfig = {
  name: 'Teacher Tools Hub',
  shortName: 'EduSoal AI',
  title: 'Teacher Tools Hub - Portal Kumpulan Alat Bantu Guru Berbasis AI',
  description:
    'Portal terintegrasi alat bantu guru berbasis AI gratis di Indonesia untuk membuat naskah soal ujian (Pilihan Ganda, Essay, Isian, Benar/Salah), kisi-kisi soal, rubrik asesmen, modul ajar Kurikulum Merdeka & K-13, dan ekspor ke format Microsoft Word (.docx).',
  keywords: [
    'teacher tools hub',
    'alat bantu guru ai',
    'generator soal ai',
    'pembuat soal otomatis',
    'kisi kisi ujian kurikulum merdeka',
    'bank soal kurikulum merdeka',
    'modul ajar ai',
    'rpp 1 lembar kurikulum merdeka',
    'rubrik penilaian asesmen',
    'aplikasi guru indonesia',
    'soal hots lots mots',
    'ekspor soal word docx',
    'guru sd smp sma smk',
  ],
  author: {
    name: 'Sulistiya Nugroho & Tim Komunitas Guru Indonesia',
    url: 'https://saweria.co/sulistiyanugroho',
  },
  creator: 'Sulistiya Nugroho',
  publisher: 'Teacher Tools Hub Indonesia',
  themeColor: '#4f46e5',
  backgroundColor: '#f8fafc',
  locale: 'id_ID',
  links: {
    saweria: 'https://saweria.co/sulistiyanugroho',
    github: 'https://github.com/sulistiyas/soal-generator',
  },
};
