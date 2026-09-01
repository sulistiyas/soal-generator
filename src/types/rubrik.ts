import { EducationLevel, CurriculumType, AIProviderId } from './exam';

export type AssessmentType =
  | 'formatif' // Ulangan Harian / Kuis / Asesmen Formatif
  | 'sumatif_materi' // Sumatif Lingkup Materi / Capaian TP
  | 'sts' // Sumatif Tengah Semester (STS / PTS / UTS)
  | 'sas' // Sumatif Akhir Semester (SAS / PAS / UAS / SAT)
  | 'us' // Asesmen Akhir Jenjang / Ujian Sekolah
  | 'kinerja' // Asesmen Kinerja / Unjuk Kerja / Praktik
  | 'proyek' // Asesmen Proyek / P5 (Profil Pelajar Pancasila)
  | 'portofolio' // Asesmen Produk / Portofolio
  | 'sikap'; // Asesmen Sikap & Perilaku

export type RubricType = 'analytic' | 'holistic' | 'kktp_interval' | 'scoring_guide' | 'all';

export type CognitiveLevel = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'LOTS' | 'MOTS' | 'HOTS';

export interface KisiKisiItem {
  no: number;
  kdOrCp: string; // Capaian Pembelajaran / Kompetensi Dasar
  materi: string; // Materi Pokok / Lingkup Materi
  subMateri?: string; // Sub Materi
  indikatorSoal: string; // Indikator Soal (ABCD - Audience, Behavior, Condition, Degree)
  levelKognitif: CognitiveLevel | string; // C1-C6 / LOTS / MOTS / HOTS
  bentukSoal: string; // Pilihan Ganda, PG Kompleks, Menjodohkan, Isian, Uraian, Praktik, Proyek
  nomorSoal: string | number; // '1', '1, 2', '1-3'
  bobotSkor: number; // Bobot nilai / skor butir
}

export interface AnalyticRubricLevel {
  level: number; // 4, 3, 2, 1
  title: string; // e.g. "Sangat Baik (4)", "Baik (3)", "Cukup (2)", "Perlu Bimbingan (1)"
  scoreRange: string; // e.g. "86 - 100", "71 - 85", "56 - 70", "< 56"
  descriptor: string; // Deskripsi kualitatif operasional
}

export interface AnalyticRubricCriterion {
  aspect: string; // Aspek / Kriteria Penilaian
  weight?: number; // Bobot persentase aspek (misal: 25%)
  levels: AnalyticRubricLevel[];
}

export interface HolisticRubricLevel {
  score: string | number; // e.g. "4 / 86-100", "3 / 71-85"
  gradeLabel: string; // e.g. "Istimewa / Mahir", "Memuaskan / Cakap", "Berkembang / Layak", "Awal / Baru Mulai"
  description: string; // Deskripsi menyeluruh
}

export interface ScoringGuideStep {
  step: string;
  points: number;
}

export interface ScoringGuideItem {
  nomorSoal: number | string;
  indikator: string;
  kunciJawaban: string;
  langkahPenyelesaian?: ScoringGuideStep[] | string[];
  skorMaksimal: number;
  rubrikPenskoranSingkat?: string;
}

export interface KktpInterval {
  interval: string; // e.g. "0 - 40%", "41 - 65%", "66 - 85%", "86 - 100%"
  kategori: string; // e.g. "Belum Mencapai Ketuntasan (Remedial Seluruh)", "Belum Mencapai (Remedial Sebagian)", "Tuntas", "Tuntas dengan Pengayaan"
  intervensi: string; // Tindak lanjut pendidik
}

export interface StudentScoreRow {
  no: number;
  nama: string;
  scores: number[];
  total: number;
  nilai: number;
  catatan: string;
}

export interface StudentScoringSheet {
  columns: string[];
  sampleRows?: StudentScoreRow[];
  maxTotalScore: number;
}

export interface KisiKisiRubrikIdentitas {
  namaSekolah: string;
  mataPelajaran: string;
  kelas: string;
  fase: string;
  kurikulum: CurriculumType;
  semester: string;
  tahunAjaran: string;
  jenisAsesmen: AssessmentType;
  jenisAsesmenLabel: string;
  alokasiWaktu: string;
  jumlahSoal: number;
  namaGuru: string;
  nipGuru: string;
  namaKepalaSekolah: string;
  nipKepalaSekolah: string;
  topikMateri: string;
  subTopik?: string;
  tujuanPembelajaran?: string;
}

export interface KisiKisiRubrikData {
  id: string;
  identitas: KisiKisiRubrikIdentitas;
  ringkasanKisiKisi: {
    totalSoal: number;
    distribusiBentuk: Record<string, number>;
    distribusiLevel: {
      lots: number;
      mots: number;
      hots: number;
    };
  };
  kisiKisi: KisiKisiItem[];
  rubrikAnalitik: AnalyticRubricCriterion[];
  rubrikHolistik?: HolisticRubricLevel[];
  pedomanPenskoran?: ScoringGuideItem[];
  intervalKktp?: KktpInterval[];
  lembarPenilaianSiswa?: StudentScoringSheet;
  petunjukPenggunaan?: string[];
  catatanGuru?: string;
  createdAt: string;
}

export interface KisiKisiRubrikGenerationRequest {
  schoolName: string;
  teacherName: string;
  teacherNip?: string;
  headmasterName?: string;
  headmasterNip?: string;
  educationLevel: EducationLevel;
  grade: string;
  phase: string;
  subject: string;
  curriculum: CurriculumType;
  semester: string;
  academicYear: string;
  assessmentType: AssessmentType;
  duration?: string;
  topic: string;
  subTopics?: string;
  learningObjectives?: string;
  
  // Konfigurasi Kisi-kisi
  totalQuestions: number;
  questionTypesIncluded: {
    pg: boolean;
    isian: boolean;
    uraian: boolean;
    praktik: boolean;
    proyek: boolean;
  };
  difficultyRatio: {
    lots: number;
    mots: number;
    hots: number;
  };

  // Konfigurasi Rubrik
  rubricTypesIncluded: {
    analytic: boolean;
    holistic: boolean;
    scoringGuide: boolean;
    kktpInterval: boolean;
    studentSheet: boolean;
  };
  rubricFocus?: string; // Fokus khusus (misal: "Penilaian Praktik Lab IPA", "Presentasi Proyek P5", "Tes Essay HOTS")

  additionalInstructions?: string;
  userApiKey?: string;
  aiProvider?: AIProviderId;
  aiModel?: string;
  customBaseUrl?: string;
}

export interface SavedRubrikItem {
  id: string;
  title: string;
  subject: string;
  grade: string;
  phase: string;
  educationLevel: EducationLevel;
  assessmentType: AssessmentType;
  assessmentTypeLabel: string;
  topic: string;
  totalQuestions: number;
  createdAt: string;
  classSlug: string;
  data: KisiKisiRubrikData;
}
