'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ModulAjarGenerationRequest,
  ModulAjarFormat,
  LearningModelType,
  P5DimensionKey,
} from '@/types/modul-ajar';
import { EducationLevel, UserAISettings } from '@/types/exam';
import { EDUCATION_LEVELS, AI_PROVIDERS } from '@/lib/constants';
import { getTopicSuggestions, getSubMaterialSuggestions } from '@/lib/subject-topics';
import {
  BookOpen,
  Sparkles,
  Layers,
  School,
  User,
  Clock,
  Settings2,
  HelpCircle,
  Zap,
  Check,
  CheckCircle2,
  FileText,
  Lightbulb,
  Compass,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ModulAjarFormProps {
  onSubmit: (data: ModulAjarGenerationRequest) => void;
  isLoading: boolean;
  aiSettings?: UserAISettings;
  onOpenApiKeyModal?: () => void;
}

const P5_DIMENSIONS: { id: P5DimensionKey; label: string; desc: string }[] = [
  { id: 'beriman', label: 'Beriman & Bertakwa', desc: 'Beriman, bertakwa kepada Tuhan YME, dan berakhlak mulia' },
  { id: 'bernalar_kritis', label: 'Bernalar Kritis', desc: 'Mampu memproses informasi, menganalisis, dan mengevaluasi' },
  { id: 'gotong_royong', label: 'Gotong Royong', desc: 'Mampu berkolaborasi, berbagi, dan peduli sesama' },
  { id: 'kreatif', label: 'Kreatif', desc: 'Menghasilkan gagasan orisinal dan karya bermakna' },
  { id: 'mandiri', label: 'Mandiri', desc: 'Prakarsa atas pengembangan dirinya dan tanggung jawab' },
  { id: 'kebinekaan', label: 'Berkebinekaan Global', desc: 'Mengenal dan menghargai budaya serta toleransi' },
];

const LEARNING_MODELS: { id: LearningModelType; label: string; desc: string }[] = [
  { id: 'pbl', label: 'Problem-Based Learning (PBL)', desc: 'Berbasis pemecahan masalah autentik di kehidupan nyata' },
  { id: 'pjbl', label: 'Project-Based Learning (PjBL)', desc: 'Berbasis pembuatan produk/karya nyata melalui proyek' },
  { id: 'discovery', label: 'Discovery Learning', desc: 'Penemuan konsep mandiri melalui pengamatan dan percobaan' },
  { id: 'inquiry', label: 'Inquiry Learning', desc: 'Penyelidikan mendalam terstruktur berbasis rasa ingin tahu' },
  { id: 'diferensiasi', label: 'Pembelajaran Berdiferensiasi', desc: 'Mengakomodasi kesiapan, minat, dan profil belajar siswa' },
  { id: 'cooperative', label: 'Cooperative Learning', desc: 'Kerja tim kolaboratif dengan struktur peran kelompok' },
  { id: 'konvensional', label: 'Saintifik & Diskusi Interaktif', desc: 'Pendekatan 5M saintifik dengan penguatan tanya jawab' },
];

const QUICK_FACILITIES = [
  'Proyektor & Laptop',
  'Video Animasi / Interaktif',
  'Buku Teks Guru & Siswa',
  'LKPD Lembar Aktivitas',
  'Jaringan Internet',
  'Alat Peraga / Benda Nyata',
  'Papan Tulis & Spidol',
  'Perangkat Laboratorium / Eksperimen',
];

export const ModulAjarForm: React.FC<ModulAjarFormProps> = ({
  onSubmit,
  isLoading,
  aiSettings,
  onOpenApiKeyModal,
}) => {
  // Form State
  const [format, setFormat] = useState<ModulAjarFormat>('kurikulum_merdeka');
  const [schoolName, setSchoolName] = useState('SMP NEGERI INDONESIA JAYA');
  const [teacherName, setTeacherName] = useState('Budi Prasetyo, S.Pd.');
  const [teacherNip, setTeacherNip] = useState('19850712 201001 1 012');
  const [headmasterName, setHeadmasterName] = useState('Dra. Siti Aminah, M.Pd.');
  const [headmasterNip, setHeadmasterNip] = useState('19760315 199903 2 004');

  const [educationLevel, setEducationLevel] = useState<EducationLevel>('smp');
  const [grade, setGrade] = useState('7');
  const [subject, setSubject] = useState('Ilmu Pengetahuan Alam (IPA)');
  const [customSubject, setCustomSubject] = useState('');
  const [semester, setSemester] = useState('1 (Ganjil)');
  const [academicYear, setAcademicYear] = useState('2024/2025');

  const [duration, setDuration] = useState('2 x 40 menit');
  const [meetingCount, setMeetingCount] = useState(1);
  const [topic, setTopic] = useState('Zat dan Perubahannya');
  const [subTopics, setSubTopics] = useState('Wujud zat, model partikel, dan perubahan wujud zat dalam kehidupan sehari-hari');
  
  const [learningModel, setLearningModel] = useState<string>('Problem-Based Learning (PBL)');
  const [selectedP5, setSelectedP5] = useState<string[]>(['Bernalar Kritis', 'Gotong Royong', 'Kreatif']);
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([
    'Proyektor & Laptop',
    'Buku Teks Guru & Siswa',
    'LKPD Lembar Aktivitas',
    'Video Animasi / Interaktif',
  ]);
  const [targetLearners, setTargetLearners] = useState('Peserta didik reguler / tipikal dengan gaya belajar majemuk (visual, auditori, kinestetik)');
  const [differentiationFocus, setDifferentiationFocus] = useState<string[]>(['Diferensiasi Proses', 'Diferensiasi Konten']);
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  // Active AI Provider info
  const activeProviderId = aiSettings?.activeProvider || 'gemini';
  const activeConfig = AI_PROVIDERS.find((p) => p.id === activeProviderId) || AI_PROVIDERS[0];
  const activeSetting = aiSettings?.providers?.[activeProviderId];
  const isConnected = !activeConfig.requiresApiKey || !!activeSetting?.apiKey;

  // Grade list for active education level
  const currentLevelInfo = EDUCATION_LEVELS[educationLevel];
  const gradesList = currentLevelInfo.grades;

  // Phase lookup
  const currentPhase = useMemo(() => {
    const matchedGrade = gradesList.find((g) => g.id === grade);
    return matchedGrade?.phase || 'Fase D';
  }, [gradesList, grade]);

  // Topic suggestions
  const topicSuggestions = useMemo(() => {
    const targetSub = subject === 'Lainnya' ? customSubject : subject;
    return getTopicSuggestions(targetSub);
  }, [subject, customSubject]);

  // Sub-material suggestions
  const subMaterialSuggestions = useMemo(() => {
    const targetSub = subject === 'Lainnya' ? customSubject : subject;
    return getSubMaterialSuggestions(targetSub, topic);
  }, [subject, customSubject, topic]);

  // Sync grade when education level changes
  useEffect(() => {
    if (gradesList.length > 0 && !gradesList.some((g) => g.id === grade)) {
      setGrade(gradesList[0].id);
    }
  }, [educationLevel, gradesList, grade]);

  // Sync subject when level changes
  useEffect(() => {
    if (currentLevelInfo.subjects.length > 0 && !currentLevelInfo.subjects.includes(subject) && subject !== 'Lainnya') {
      setSubject(currentLevelInfo.subjects[0]);
    }
  }, [educationLevel, currentLevelInfo, subject]);

  const toggleP5 = (label: string) => {
    if (selectedP5.includes(label)) {
      setSelectedP5(selectedP5.filter((p) => p !== label));
    } else {
      setSelectedP5([...selectedP5, label]);
    }
  };

  const toggleFacility = (item: string) => {
    if (selectedFacilities.includes(item)) {
      setSelectedFacilities(selectedFacilities.filter((f) => f !== item));
    } else {
      setSelectedFacilities([...selectedFacilities, item]);
    }
  };

  const toggleDifferentiation = (item: string) => {
    if (differentiationFocus.includes(item)) {
      setDifferentiationFocus(differentiationFocus.filter((d) => d !== item));
    } else {
      setDifferentiationFocus([...differentiationFocus, item]);
    }
  };

  const handleFillDemo = (preset: 'smp_ipa' | 'sd_matematika' | 'sma_biologi') => {
    if (preset === 'smp_ipa') {
      setFormat('kurikulum_merdeka');
      setEducationLevel('smp');
      setGrade('7');
      setSubject('Ilmu Pengetahuan Alam (IPA)');
      setTopic('Suhu, Kalor, dan Pemuaian');
      setSubTopics('Konsep suhu, azas Black, dan perpindahan kalor (konduksi, konveksi, radiasi) pada termos dan panel surya');
      setDuration('2 x 40 menit');
      setMeetingCount(1);
      setLearningModel('Problem-Based Learning (PBL)');
      setSelectedP5(['Bernalar Kritis', 'Gotong Royong']);
    } else if (preset === 'sd_matematika') {
      setFormat('kurikulum_merdeka');
      setEducationLevel('sd');
      setGrade('4');
      setSubject('Matematika');
      setTopic('Pecahan Senilai dan Operasi Hitung Pecahan');
      setSubTopics('Membandingkan pecahan senilai dengan media konkret kue/pizza dan penjumlahan pecahan berpenyebut sama');
      setDuration('2 x 35 menit');
      setMeetingCount(2);
      setLearningModel('Discovery Learning');
      setSelectedP5(['Bernalar Kritis', 'Mandiri', 'Kreatif']);
    } else if (preset === 'sma_biologi') {
      setFormat('rpp_berdiferensiasi');
      setEducationLevel('sma');
      setGrade('11');
      setSubject('Biologi');
      setTopic('Sistem Sirkulasi dan Peredaran Darah Manusia');
      setSubTopics('Struktur jantung, pembuluh darah, mekanisme peredaran darah besar/kecil, dan analisis kelainan anemia/hipertensi');
      setDuration('2 x 45 menit');
      setMeetingCount(1);
      setLearningModel('Problem-Based Learning (PBL)');
      setSelectedP5(['Bernalar Kritis', 'Kreatif', 'Gotong Royong']);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const actualSubject = subject === 'Lainnya' ? customSubject.trim() : subject;
    if (!actualSubject || !topic.trim()) {
      alert('Mohon isi mata pelajaran dan topik materi terlebih dahulu.');
      return;
    }

    const matchedGrade = gradesList.find((g) => g.id === grade);
    const gradeLabel = matchedGrade ? `${matchedGrade.name} (${currentPhase})` : `Kelas ${grade}`;

    const requestData: ModulAjarGenerationRequest = {
      format,
      schoolName: schoolName.trim() || 'Satuan Pendidikan',
      teacherName: teacherName.trim() || 'Guru Pengampu',
      teacherNip: teacherNip.trim() || '-',
      headmasterName: headmasterName.trim() || 'Kepala Sekolah',
      headmasterNip: headmasterNip.trim() || '-',
      educationLevel,
      grade: gradeLabel,
      phase: currentPhase,
      subject: actualSubject,
      semester,
      academicYear,
      duration,
      meetingCount,
      topic: topic.trim(),
      subTopics: subTopics.trim(),
      p5Dimensions: selectedP5,
      learningModel,
      targetLearners,
      facilities: selectedFacilities.join(', '),
      differentiationFocus,
      additionalInstructions: additionalInstructions.trim(),
      aiProvider: activeProviderId,
      aiModel: activeSetting?.model || activeConfig.defaultModel,
      customBaseUrl: activeSetting?.customBaseUrl || activeConfig.defaultBaseUrl,
      userApiKey: activeSetting?.apiKey || '',
    };

    onSubmit(requestData);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 overflow-hidden">
      {/* Top Banner Presets */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 p-6 text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold text-blue-100 border border-white/20 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Administrasi Guru Cerdas Indonesia</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Generator Modul Ajar & RPP AI
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-xl">
              Susun Modul Ajar Kurikulum Merdeka atau RPP 1 Lembar resmi Kemendikbudristek secara otomatis, lengkap dengan langkah pembelajaran, rubrik KKTP, dan LKPD.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="text-xs font-medium text-blue-200 block w-full md:w-auto">
              Contoh Cepat:
            </span>
            <button
              type="button"
              onClick={() => handleFillDemo('smp_ipa')}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur border border-white/20 transition-all cursor-pointer"
            >
              🔬 IPA SMP (Fase D)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('sd_matematika')}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur border border-white/20 transition-all cursor-pointer"
            >
              📐 Matematika SD (Fase B)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('sma_biologi')}
              className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-semibold backdrop-blur border border-white/20 transition-all cursor-pointer"
            >
              🧬 Biologi SMA (Fase F)
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        {/* 1. PILIH FORMAT KURIKULUM */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-blue-600" />
            Format Dokumen Administrasi
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setFormat('kurikulum_merdeka')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                format === 'kurikulum_merdeka'
                  ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">Modul Ajar Lengkap</span>
                {format === 'kurikulum_merdeka' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Format standar Kurikulum Merdeka (CP, TP, ATP, Sintaks PBL/PjBL, LKPD & KKTP).
              </p>
            </button>

            <button
              type="button"
              onClick={() => setFormat('rpp_berdiferensiasi')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                format === 'rpp_berdiferensiasi'
                  ? 'border-purple-600 bg-purple-50/70 shadow-sm ring-2 ring-purple-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">Modul Berdiferensiasi</span>
                {format === 'rpp_berdiferensiasi' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Fokus pemetaan diferensiasi konten, proses, dan produk sesuai kesiapan belajar siswa.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setFormat('rpp_1_lembar')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                format === 'rpp_1_lembar'
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">RPP 1 Lembar (K-13)</span>
                {format === 'rpp_1_lembar' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Format ringkas inspiratif SE Mendikbud No. 14 Tahun 2019 (Tujuan, Langkah, Asesmen).
              </p>
            </button>
          </div>
        </div>

        {/* 2. IDENTITAS SATUAN PENDIDIKAN & GURU */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <School className="w-4 h-4 text-blue-600" />
              Identitas Sekolah & Pendidik
            </label>
            <span className="text-[11px] text-slate-400">Untuk Kop dan Lembar Pengesahan</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Sekolah / Satuan Pendidikan
              </label>
              <input
                type="text"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Contoh: SMP Negeri 1 Jakarta"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Guru Penyusun
              </label>
              <input
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="Nama Lengkap & Gelar"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                NIP Guru (Opsional)
              </label>
              <input
                type="text"
                value={teacherNip}
                onChange={(e) => setTeacherNip(e.target.value)}
                placeholder="Contoh: 19850712 201001 1 012"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nama Kepala Sekolah
              </label>
              <input
                type="text"
                value={headmasterName}
                onChange={(e) => setHeadmasterName(e.target.value)}
                placeholder="Nama Kepala Sekolah"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                NIP Kepala Sekolah
              </label>
              <input
                type="text"
                value={headmasterNip}
                onChange={(e) => setHeadmasterNip(e.target.value)}
                placeholder="NIP Kepala Sekolah"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                >
                  <option value="1 (Ganjil)">1 (Ganjil)</option>
                  <option value="2 (Genap)">2 (Genap)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Tahun Ajaran</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. JENJANG, KELAS, FASE & MATA PELAJARAN */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-blue-600" />
            Jenjang, Kelas & Mata Pelajaran
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            {/* Jenjang */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Jenjang Pendidikan</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['sd', 'smp', 'sma', 'smk'] as EducationLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEducationLevel(lvl)}
                    className={`min-h-[44px] py-2.5 px-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer border flex items-center justify-center ${
                      educationLevel === lvl
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Kelas & Fase */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tingkat Kelas ({currentPhase})
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                {gradesList.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} {g.phase ? `— ${g.phase}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Mata Pelajaran */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mata Pelajaran</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                {currentLevelInfo.subjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
                <option value="Lainnya">+ Mata Pelajaran Lainnya...</option>
              </select>
            </div>
          </div>

          {/* Custom Subject Input if Lainnya */}
          {subject === 'Lainnya' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ketik Nama Mata Pelajaran Kustom
              </label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                placeholder="Contoh: Bahasa Sunda / Koding / Robotika"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                required
              />
            </div>
          )}
        </div>

        {/* 4. TOPIK & MATERI PEMBELAJARAN */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-blue-600" />
            Topik Materi & Cakupan Pembelajaran
          </label>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Topik / Materi Utama <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Contoh: Ekosistem dan Interaksi Antarmakhluk Hidup"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                required
              />

              {/* Bank Topik Quick Pills */}
              {topicSuggestions && topicSuggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3 text-amber-500" /> Rekomendasi Bab:
                  </span>
                  {topicSuggestions.slice(0, 4).map((item) => (
                    <button
                      key={item.topic}
                      type="button"
                      onClick={() => {
                        setTopic(item.topic);
                        if (item.subMaterials?.[0]) setSubTopics(item.subMaterials[0]);
                      }}
                      className="text-[11.5px] px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 transition-all cursor-pointer text-left active:bg-blue-100"
                    >
                      {item.topic}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Rincian Sub-Materi / Konsep Pokok (Opsional)
              </label>
              <textarea
                rows={2}
                value={subTopics}
                onChange={(e) => setSubTopics(e.target.value)}
                placeholder="Rincian bagian materi yang ingin ditekankan..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 leading-relaxed"
              />

              {subMaterialSuggestions && subMaterialSuggestions.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {subMaterialSuggestions.slice(0, 2).map((sub, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSubTopics(sub)}
                      className="text-[11px] text-slate-500 hover:text-blue-600 hover:underline text-left cursor-pointer p-0.5"
                    >
                      💡 Gunakan: {sub.slice(0, 75)}...
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. PENDEKATAN, MODEL & PROFIL PELAJAR PANCASILA */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-blue-600" />
            Model Pembelajaran & Profil Pelajar Pancasila (P5)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Alokasi & Pertemuan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Alokasi Waktu
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="2 x 40 menit"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Jumlah Pertemuan
                </label>
                <select
                  value={meetingCount}
                  onChange={(e) => setMeetingCount(Number(e.target.value))}
                  className="w-full min-h-[44px] px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                >
                  <option value={1}>1 Pertemuan</option>
                  <option value={2}>2 Pertemuan</option>
                  <option value={3}>3 Pertemuan</option>
                  <option value={4}>4 Pertemuan</option>
                </select>
              </div>
            </div>

            {/* Model Pembelajaran */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Model Pembelajaran
              </label>
              <select
                value={learningModel}
                onChange={(e) => setLearningModel(e.target.value)}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base sm:text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
              >
                {LEARNING_MODELS.map((m) => (
                  <option key={m.id} value={m.label}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dimensi Profil Pelajar Pancasila (P5) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Dimensi Profil Pelajar Pancasila (Pilih 1 - 3 Dimensi Utama)
              </label>
              <span className="text-[11px] text-blue-600 font-medium">
                {selectedP5.length} dipilih
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {P5_DIMENSIONS.map((p) => {
                const active = selectedP5.includes(p.label);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleP5(p.label)}
                    className={`min-h-[44px] p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      active
                        ? 'bg-blue-50 border-blue-300 text-blue-950 font-bold shadow-2xs'
                        : 'bg-slate-50/80 border-slate-200 text-slate-700 hover:bg-slate-100 active:bg-slate-200'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border ${
                        active ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {active && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="text-xs block leading-tight">{p.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sarana & Prasarana Quick Select */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Sarana, Media & Sumber Belajar
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_FACILITIES.map((fac) => {
                const active = selectedFacilities.includes(fac);
                return (
                  <button
                    key={fac}
                    type="button"
                    onClick={() => toggleFacility(fac)}
                    className={`min-h-[38px] px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1 ${
                      active
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 active:bg-slate-200'
                    }`}
                  >
                    <span>{active ? '✓ ' : '+ '}</span>
                    <span>{fac}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Diferensiasi Pembelajaran */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Fokus Diferensiasi Pembelajaran
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'konten', label: 'Diferensiasi Konten', desc: 'Variasi materi (teks bacaan, video audio visual, infografis)' },
                { id: 'proses', label: 'Diferensiasi Proses', desc: 'Variasi aktivitas (bimbingan berjenjang, mandiri)' },
                { id: 'produk', label: 'Diferensiasi Produk', desc: 'Variasi karya (laporan tertulis, poster, presentasi lisan)' },
              ].map((d) => {
                const active = differentiationFocus.includes(d.label);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDifferentiation(d.label)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 active:bg-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs block font-bold">{d.label}</span>
                      {active && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
                    </div>
                    <span className="text-[11px] text-slate-500 block leading-snug">{d.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Catatan / Instruksi Tambahan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Instruksi Tambahan / Permintaan Khusus (Opsional)
            </label>
            <textarea
              rows={2}
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              placeholder="Contoh: Sertakan studi kasus tentang lingkungan lokal di desa/kota, atau integrasikan kuis interaktif 5 menit..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-base sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
        </div>

        {/* 6. AI ENGINE STATUS & SUBMIT BUTTON */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-2xl border sm:border-0 border-slate-200/80">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="truncate">Mesin AI: {activeConfig.name}</span>
                <span className={`w-2 h-2 rounded-full shrink-0 ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                Model: <code className="bg-slate-200/70 px-1 py-0.5 rounded text-slate-700 font-mono text-[10.5px]">{activeSetting?.model || activeConfig.defaultModel}</code>
              </p>
            </div>
            {onOpenApiKeyModal && (
              <button
                type="button"
                onClick={onOpenApiKeyModal}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer shrink-0 ml-1 py-1 px-1.5"
              >
                Ganti AI
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto min-h-[50px] inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-white font-bold text-sm sm:text-base shadow-lg transition-all cursor-pointer ${
              isLoading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-blue-500/25 hover:shadow-xl active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menyusun Modul Ajar AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Buat Modul Ajar / RPP Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
