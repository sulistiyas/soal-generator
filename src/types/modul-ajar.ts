import { EducationLevel, CurriculumType, AIProviderId } from './exam';

export type ModulAjarFormat = 'kurikulum_merdeka' | 'rpp_1_lembar' | 'rpp_berdiferensiasi';

export type LearningModelType =
  | 'pbl'          // Problem Based Learning
  | 'pjbl'         // Project Based Learning
  | 'discovery'    // Discovery Learning
  | 'inquiry'      // Inquiry Learning
  | 'cooperative'  // Cooperative Learning
  | 'diferensiasi' // Pembelajaran Berdiferensiasi
  | 'konvensional';// Saintifik / Konvensional Terstruktur

export type P5DimensionKey =
  | 'beriman'
  | 'kebinekaan'
  | 'gotong_royong'
  | 'mandiri'
  | 'bernalar_kritis'
  | 'kreatif';

export interface P5DimensionInfo {
  id: P5DimensionKey;
  label: string;
  description: string;
}

export interface LearningStepDetail {
  tahap: string;
  alokasiMenit?: number;
  aktivitasGuru: string;
  aktivitasSiswa: string;
  fokusDiferensiasi?: string; // Konten, Proses, Produk, atau kosong
}

export interface MeetingPlan {
  pertemuan: number;
  alokasiWaktu: string;
  tujuanPertemuan: string;
  pendahuluan: {
    alokasiMenit: number;
    langkah: string[];
  };
  inti: {
    alokasiMenit: number;
    sintaks: LearningStepDetail[];
    langkahUmum?: string[];
  };
  penutup: {
    alokasiMenit: number;
    langkah: string[];
  };
}

export interface RubrikKriteriaItem {
  aspek: string;
  sangatBaik: string; // Skor 4 / Mahir
  baik: string;       // Skor 3 / Cakap
  cukup: string;      // Skor 2 / Berkembang
  perluBimbingan: string; // Skor 1 / Baru Memulai
}

export interface KKTPIntervalItem {
  interval: string;
  keterangan: string;
  intervensi: string;
}

export interface ModulAjarData {
  id?: string;
  format: ModulAjarFormat;
  identitas: {
    namaPenyusun: string;
    nipPenyusun?: string;
    namaSekolah: string;
    jenjang: string;
    mataPelajaran: string;
    faseKelas: string;
    semester: string;
    tahunAjaran: string;
    alokasiWaktu: string;
    jumlahPertemuan: number;
    babTema: string;
    topikMateri: string;
    kepalaSekolah?: {
      nama: string;
      nip?: string;
    };
  };
  kompetensiAwal: string[];
  profilPelajarPancasila: string[];
  saranaPrasarana: {
    sumberBelajar: string[];
    mediaPembelajaran: string[];
    alatDanBahan: string[];
  };
  targetPesertaDidik: string;
  modelPembelajaran: {
    pendekatan: string;
    model: string;
    metode: string[];
  };
  komponenInti: {
    capaianPembelajaran: string;
    tujuanPembelajaran: string[];
    alurTujuanPembelajaran?: string;
    pemahamanBermakna: string[];
    pertanyaanPemantik: string[];
    persiapanPembelajaran: string[];
  };
  kegiatanPembelajaran: MeetingPlan[];
  asesmen: {
    diagnostik: {
      teknik: string;
      instrumen: string;
      contohSoalPertanyaan: string[];
    };
    formatif: {
      teknik: string;
      instrumen: string;
      rubrikAtauKriteria: RubrikKriteriaItem[];
    };
    sumatif: {
      teknik: string;
      bentukInstrumen: string;
      kisiKisiSingkat: string;
    };
    kktp: {
      tujuan: string;
      skalaInterval: KKTPIntervalItem[];
    };
  };
  pengayaanDanRemedial: {
    pengayaan: string[];
    remedial: string[];
  };
  refleksi: {
    refleksiGuru: string[];
    refleksiSiswa: string[];
  };
  lampiran: {
    lkpd: {
      judul: string;
      petunjukPengerjaan: string[];
      aktivitasTugas: string[];
    };
    bahanBacaan: {
      untukGuru: string;
      untukSiswa: string;
    };
    glosarium: { istilah: string; definisi: string }[];
    daftarPustaka: string[];
  };
}

export interface ModulAjarGenerationRequest {
  format: ModulAjarFormat;
  schoolName: string;
  teacherName: string;
  teacherNip?: string;
  headmasterName?: string;
  headmasterNip?: string;
  educationLevel: EducationLevel;
  grade: string;
  phase: string;
  subject: string;
  semester: string;
  academicYear: string;
  duration: string; // e.g. "2 x 35 menit"
  meetingCount: number; // 1, 2, 3, etc.
  topic: string;
  subTopics?: string;
  p5Dimensions: string[];
  learningModel: string;
  targetLearners?: string;
  facilities?: string;
  differentiationFocus?: string[]; // ['konten', 'proses', 'produk']
  additionalInstructions?: string;
  userApiKey?: string;
  aiProvider?: AIProviderId;
  aiModel?: string;
  customBaseUrl?: string;
}
