import { EducationLevel, CurriculumType, ExamCategory } from '@/types/exam';

export interface LevelInfo {
  id: EducationLevel;
  name: string;
  grades: { id: string; name: string; phase?: string }[];
  subjects: string[];
  optionCount: number; // 4 for SD/SMP (A-D), 5 for SMA/SMK (A-E)
}

export const EDUCATION_LEVELS: Record<EducationLevel, LevelInfo> = {
  sd: {
    id: 'sd',
    name: 'SD / MI (Sekolah Dasar)',
    optionCount: 4,
    grades: [
      { id: '1', name: 'Kelas 1', phase: 'Fase A' },
      { id: '2', name: 'Kelas 2', phase: 'Fase A' },
      { id: '3', name: 'Kelas 3', phase: 'Fase B' },
      { id: '4', name: 'Kelas 4', phase: 'Fase B' },
      { id: '5', name: 'Kelas 5', phase: 'Fase C' },
      { id: '6', name: 'Kelas 6', phase: 'Fase C' },
    ],
    subjects: [
      'Pendidikan Pancasila',
      'Bahasa Indonesia',
      'Matematika',
      'Ilmu Pengetahuan Alam dan Sosial (IPAS)',
      'Pendidikan Agama dan Budi Pekerti',
      'Bahasa Inggris',
      'Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK)',
      'Seni Rupa / Seni Musik / Seni Tari',
    ],
  },
  smp: {
    id: 'smp',
    name: 'SMP / MTs (Sekolah Menengah Pertama)',
    optionCount: 4,
    grades: [
      { id: '7', name: 'Kelas 7', phase: 'Fase D' },
      { id: '8', name: 'Kelas 8', phase: 'Fase D' },
      { id: '9', name: 'Kelas 9', phase: 'Fase D' },
    ],
    subjects: [
      'Pendidikan Pancasila',
      'Bahasa Indonesia',
      'Matematika',
      'Ilmu Pengetahuan Alam (IPA)',
      'Ilmu Pengetahuan Sosial (IPS)',
      'Bahasa Inggris',
      'Informatika',
      'Pendidikan Agama dan Budi Pekerti',
      'PJOK',
      'Seni dan Budaya',
      'Prakarya',
    ],
  },
  sma: {
    id: 'sma',
    name: 'SMA / MA (Sekolah Menengah Atas)',
    optionCount: 5,
    grades: [
      { id: '10', name: 'Kelas 10', phase: 'Fase E' },
      { id: '11', name: 'Kelas 11', phase: 'Fase F' },
      { id: '12', name: 'Kelas 12', phase: 'Fase F' },
    ],
    subjects: [
      'Bahasa Indonesia',
      'Matematika (Umum)',
      'Matematika Tingkat Lanjut',
      'Bahasa Inggris',
      'Pendidikan Pancasila',
      'Fisika',
      'Kimia',
      'Biologi',
      'Ekonomi',
      'Sosiologi',
      'Geografi',
      'Sejarah',
      'Informatika',
      'Pendidikan Agama dan Budi Pekerti',
    ],
  },
  smk: {
    id: 'smk',
    name: 'SMK / MAK (Sekolah Menengah Kejuruan)',
    optionCount: 5,
    grades: [
      { id: '10', name: 'Kelas 10', phase: 'Fase E' },
      { id: '11', name: 'Kelas 11', phase: 'Fase F' },
      { id: '12', name: 'Kelas 12', phase: 'Fase F' },
    ],
    subjects: [
      'Bahasa Indonesia',
      'Matematika Terapan',
      'Bahasa Inggris',
      'Pendidikan Pancasila',
      'Informatika',
      'Projek IPAS (SMK)',
      'Dasar-dasar Program Keahlian',
      'Konsentrasi Keahlian Kejuruan',
      'Produk Kreatif dan Kewirausahaan (PKK)',
      'Pendidikan Agama dan Budi Pekerti',
    ],
  },
};

export const EXAM_CATEGORIES: { id: ExamCategory; label: string; defaultTitle: string; defaultDuration: number }[] = [
  {
    id: 'formatif',
    label: 'Ulangan Harian / Asesmen Formatif',
    defaultTitle: 'ASESMEN FORMATIF / ULANGAN HARIAN',
    defaultDuration: 45,
  },
  {
    id: 'sts',
    label: 'STS / PTS (Tengah Semester)',
    defaultTitle: 'SUMATIF TENGAH SEMESTER (STS)',
    defaultDuration: 60,
  },
  {
    id: 'sas',
    label: 'SAS / PAS (Akhir Semester)',
    defaultTitle: 'SUMATIF AKHIR SEMESTER (SAS)',
    defaultDuration: 90,
  },
  {
    id: 'us',
    label: 'Ujian Sekolah / Asesmen Akhir',
    defaultTitle: 'UJIAN SEKOLAH (US) / ASESMEN AKHIR JENJANG',
    defaultDuration: 120,
  },
];

export const CURRICULA: { id: CurriculumType; label: string }[] = [
  { id: 'merdeka', label: 'Kurikulum Merdeka (Capaian & Tujuan Pembelajaran)' },
  { id: 'k13', label: 'Kurikulum 2013 / K-13 (Kompetensi Dasar)' },
];
