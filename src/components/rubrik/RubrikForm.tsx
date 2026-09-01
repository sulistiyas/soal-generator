'use client';

import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  School,
  BookOpen,
  ListChecks,
  Award,
  Settings2,
} from 'lucide-react';
import {
  EducationLevel,
  CurriculumType,
  UserAISettings,
  AIProviderId,
} from '@/types/exam';
import {
  AssessmentType,
  KisiKisiRubrikGenerationRequest,
} from '@/types/rubrik';
import {
  AI_PROVIDERS,
  EDUCATION_LEVELS,
  getSubjectsForLevel,
} from '@/lib/constants';
import { getTopicSuggestions } from '@/lib/subject-topics';

interface RubrikFormProps {
  onSubmit: (request: KisiKisiRubrikGenerationRequest) => void;
  isLoading: boolean;
  aiSettings: UserAISettings;
  onOpenApiKeyModal: () => void;
}

const ASSESSMENT_TYPE_OPTIONS: { id: AssessmentType; label: string; description: string; badge?: string }[] = [
  { id: 'sumatif_materi', label: 'Sumatif Lingkup Materi', description: 'Evaluasi ketuntasan 1-2 Tujuan Pembelajaran (TP)', badge: 'Populer' },
  { id: 'sts', label: 'Sumatif Tengah Semester (STS / PTS)', description: 'Asesmen tengah semester untuk beberapa bab', badge: 'Utama' },
  { id: 'sas', label: 'Sumatif Akhir Semester (SAS / PAS / SAT)', description: 'Evaluasi komprehensif seluruh materi satu semester', badge: 'Utama' },
  { id: 'formatif', label: 'Asesmen Formatif / Ulangan Harian', description: 'Refleksi pembelajaran dan diagnosa pemahaman siswa' },
  { id: 'us', label: 'Asesmen Akhir Jenjang / Ujian Sekolah', description: 'Ujian kelulusan akhir jenjang sekolah' },
  { id: 'kinerja', label: 'Asesmen Kinerja / Ujian Praktik', description: 'Rubrik unjuk kerja, demonstrasi, & lab', badge: 'Praktik' },
  { id: 'proyek', label: 'Asesmen Proyek / P5', description: 'Rubrik proyek & Profil Pelajar Pancasila', badge: 'P5' },
  { id: 'portofolio', label: 'Asesmen Produk / Portofolio', description: 'Penilaian karya, laporan, & produk siswa' },
];

const SEMESTERS = [
  { value: 'Ganjil', label: 'Semester 1 (Ganjil)' },
  { value: 'Genap', label: 'Semester 2 (Genap)' },
];

const ACADEMIC_YEARS = ['2024/2025', '2025/2026', '2026/2027'];

export const RubrikForm: React.FC<RubrikFormProps> = ({
  onSubmit,
  isLoading,
  aiSettings,
  onOpenApiKeyModal,
}) => {
  // 1. Identitas Sekolah & Guru
  const [schoolName, setSchoolName] = useState('SMP Negeri 1 Indonesia');
  const [teacherName, setTeacherName] = useState('Sulistiyo, S.Pd.');
  const [teacherNip, setTeacherNip] = useState('19850715 201001 1 008');
  const [headmasterName, setHeadmasterName] = useState('Dra. Hj. Nur Endah, M.Pd.');
  const [headmasterNip, setHeadmasterNip] = useState('19720320 199802 2 001');

  // 2. Jenjang, Kurikulum, Kelas
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('smp');
  const [curriculum, setCurriculum] = useState<CurriculumType>('merdeka');
  const [grade, setGrade] = useState('7');
  const [semester, setSemester] = useState('Ganjil');
  const [academicYear, setAcademicYear] = useState('2024/2025');

  // 3. Mapel & Topik
  const [subject, setSubject] = useState('Ilmu Pengetahuan Alam (IPA)');
  const [topic, setTopic] = useState('Hakikat Ilmu Sains dan Metode Ilmiah');
  const [subTopics, setSubTopics] = useState('Pengukuran besaran fisika, keselamatan kerja di lab IPA');
  const [learningObjectives, setLearningObjectives] = useState('Peserta didik mampu merancang penyelidikan ilmiah dan menggunakan alat ukur dengan tepat.');

  // 4. Parameter Asesmen
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('sumatif_materi');
  const [duration, setDuration] = useState('90 Menit');
  const [totalQuestions, setTotalQuestions] = useState<number>(10);

  // 5. Bentuk Soal
  const [questionTypesIncluded, setQuestionTypesIncluded] = useState({
    pg: true,
    isian: true,
    uraian: true,
    praktik: false,
    proyek: false,
  });

  // 6. Kesukaran Kognitif
  const [difficultyRatio, setDifficultyRatio] = useState({
    lots: 30,
    mots: 40,
    hots: 30,
  });

  // 7. Kelengkapan Rubrik
  const [rubricTypesIncluded, setRubricTypesIncluded] = useState({
    analytic: true,
    holistic: true,
    scoringGuide: true,
    kktpInterval: true,
    studentSheet: true,
  });

  const [rubricFocus, setRubricFocus] = useState('');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  // Otomatis hitung Fase Kurikulum Merdeka
  const phase = useMemo(() => {
    switch (grade) {
      case '1':
      case '2':
        return 'Fase A';
      case '3':
      case '4':
        return 'Fase B';
      case '5':
      case '6':
        return 'Fase C';
      case '7':
      case '8':
      case '9':
        return 'Fase D';
      case '10':
        return 'Fase E';
      case '11':
      case '12':
        return 'Fase F';
      default:
        return 'Fase D';
    }
  }, [grade]);

  // Handle Level Change -> Update Grade default
  const handleLevelChange = (lvl: EducationLevel) => {
    setEducationLevel(lvl);
    if (lvl === 'sd') {
      setGrade('4');
      setSubject('Ilmu Pengetahuan Alam dan Sosial (IPAS)');
    } else if (lvl === 'smp') {
      setGrade('7');
      setSubject('Ilmu Pengetahuan Alam (IPA)');
    } else if (lvl === 'sma' || lvl === 'smk') {
      setGrade('10');
      setSubject('Biologi');
    }
  };

  // Autocomplete Topics from dataset
  const availableTopics = useMemo(() => {
    return getTopicSuggestions(educationLevel, subject);
  }, [educationLevel, subject]);

  const activeProviderId: AIProviderId = aiSettings?.activeProvider || 'gemini';
  const activeConfig = AI_PROVIDERS.find((p) => p.id === activeProviderId) || AI_PROVIDERS[0];
  const activeSetting = aiSettings?.providers?.[activeProviderId];
  const isConnected = !activeConfig.requiresApiKey || !!activeSetting?.apiKey;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected) {
      onOpenApiKeyModal();
      return;
    }

    const payload: KisiKisiRubrikGenerationRequest = {
      schoolName,
      teacherName,
      teacherNip,
      headmasterName,
      headmasterNip,
      educationLevel,
      grade,
      phase,
      subject,
      curriculum,
      semester,
      academicYear,
      assessmentType,
      duration,
      topic,
      subTopics,
      learningObjectives,
      totalQuestions,
      questionTypesIncluded,
      difficultyRatio,
      rubricTypesIncluded,
      rubricFocus,
      additionalInstructions,
      userApiKey: activeSetting?.apiKey,
      aiProvider: activeProviderId,
      aiModel: activeSetting?.model || activeConfig.defaultModel,
      customBaseUrl: activeSetting?.customBaseUrl,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
      {/* 1. Header Card Identitas */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -z-10" />
        
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
            <School className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">1. Identitas Satuan Pendidikan & Pendidik</h2>
            <p className="text-xs text-slate-500">Kop resmi dan lembar pengesahan dokumen kisi-kisi & rubrik</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="md:col-span-2 lg:col-span-1">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Satuan Pendidikan / Sekolah</label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Contoh: SMP Negeri 1 Jakarta"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Guru Penyusun</label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="Nama Guru & Gelar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-800"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">NIP Guru Penyusun</label>
            <input
              type="text"
              value={teacherNip}
              onChange={(e) => setTeacherNip(e.target.value)}
              placeholder="NIP / -"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Kepala Sekolah</label>
            <input
              type="text"
              value={headmasterName}
              onChange={(e) => setHeadmasterName(e.target.value)}
              placeholder="Nama Kepala Sekolah & Gelar"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">NIP Kepala Sekolah</label>
            <input
              type="text"
              value={headmasterNip}
              onChange={(e) => setHeadmasterNip(e.target.value)}
              placeholder="NIP / -"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Tahun Ajaran & Semester</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:border-blue-500"
              >
                {ACADEMIC_YEARS.map((yr: string) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:border-blue-500"
              >
                {SEMESTERS.map((sem) => (
                  <option key={sem.value} value={sem.value}>{sem.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Jenjang, Kurikulum, & Mata Pelajaran */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">2. Kurikulum, Jenjang & Materi Pokok</h2>
            <p className="text-xs text-slate-500">Pilih jenjang, kurikulum, dan lingkup materi yang akan dievaluasi</p>
          </div>
        </div>

        {/* Jenjang Selector */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 mb-2">Pilih Jenjang Sekolah</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['sd', 'smp', 'sma', 'smk'] as EducationLevel[]).map((lvl) => {
              const info = EDUCATION_LEVELS[lvl];
              return (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => handleLevelChange(lvl)}
                  className={`py-3 px-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    educationLevel === lvl
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm">{info.name.split(' ')[0]}</div>
                    <div className="text-[11px] text-slate-400">{info.name}</div>
                  </div>
                  {educationLevel === lvl && (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          {/* Kurikulum */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Standar Kurikulum</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCurriculum('merdeka')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  curriculum === 'merdeka'
                    ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Kurikulum Merdeka
              </button>
              <button
                type="button"
                onClick={() => setCurriculum('k13')}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  curriculum === 'k13'
                    ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                Kurikulum 2013
              </button>
            </div>
          </div>

          {/* Kelas & Fase */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tingkat Kelas {curriculum === 'merdeka' && <span className="text-blue-600 font-normal">({phase})</span>}
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:border-blue-500"
            >
              {EDUCATION_LEVELS[educationLevel].grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} {g.phase ? `(${g.phase})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Mata Pelajaran */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Mata Pelajaran</label>
            <input
              type="text"
              list="subject-suggestions"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ketik atau pilih mata pelajaran"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-sm font-medium text-slate-800"
              required
            />
            <datalist id="subject-suggestions">
              {getSubjectsForLevel(educationLevel).map((s: string) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Materi Pokok & Sub-Topik */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">Topik / Lingkup Materi Pokok</label>
              {availableTopics.length > 0 && (
                <span className="text-[11px] text-blue-600 font-medium">Saran topik tersedia di bawah</span>
              )}
            </div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Contoh: Sistem Tata Surya, Persamaan Linear, Teks Eksposisi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-sm font-medium text-slate-800"
              required
            />

            {/* Quick Topic Chips */}
            {availableTopics.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {availableTopics.slice(0, 6).map((item) => (
                  <button
                    key={item.topic}
                    type="button"
                    onClick={() => {
                      setTopic(item.topic);
                      if (item.subMaterials && item.subMaterials.length > 0) {
                        setSubTopics(item.subMaterials.slice(0, 2).join(', '));
                      }
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 transition-colors border border-slate-200/60"
                  >
                    + {item.topic}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Sub-Topik / Pokok Bahasan Spesifik (Opsional)</label>
              <input
                type="text"
                value={subTopics}
                onChange={(e) => setSubTopics(e.target.value)}
                placeholder="Misal: Rotasi dan Revolusi Bumi, Gerhana Bulan & Matahari"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Tujuan Pembelajaran / Capaian (Opsional)</label>
              <input
                type="text"
                value={learningObjectives}
                onChange={(e) => setLearningObjectives(e.target.value)}
                placeholder="Misal: Menganalisis fenomena gerhana dan rotasi bumi..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-xs font-medium text-slate-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Parameter Evaluasi & Format Kisi-Kisi */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-purple-600/10 text-purple-600 flex items-center justify-center">
            <ListChecks className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">3. Jenis Asesmen & Konfigurasi Kisi-Kisi</h2>
            <p className="text-xs text-slate-500">Tentukan bentuk ujian, jumlah butir indikator, dan tingkat kognitif</p>
          </div>
        </div>

        {/* Jenis Asesmen Selection Grid */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 mb-2">Jenis Asesmen / Evaluasi</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ASSESSMENT_TYPE_OPTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setAssessmentType(item.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                  assessmentType === item.id
                    ? 'border-purple-600 bg-purple-50/60 ring-2 ring-purple-100 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                {item.badge && (
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200">
                    {item.badge}
                  </span>
                )}
                <div className="font-bold text-xs text-slate-900 mb-1">{item.label}</div>
                <div className="text-[11px] text-slate-500 leading-relaxed">{item.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Jumlah Soal & Alokasi Waktu */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Jumlah Butir Soal / Indikator: <span className="text-purple-600 font-extrabold text-sm">{totalQuestions} Butir</span>
            </label>
            <div className="flex items-center gap-2 mb-3">
              {[5, 10, 15, 20, 25, 30].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setTotalQuestions(num)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    totalQuestions === num
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
            <input
              type="range"
              min="3"
              max="40"
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(Number(e.target.value))}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Alokasi Waktu Ujian / Asesmen</label>
            <div className="grid grid-cols-3 gap-2">
              {['60 Menit', '90 Menit', '120 Menit'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setDuration(t)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    duration === t
                      ? 'bg-purple-50 border-purple-600 text-purple-800'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bentuk Soal Checklist */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 mb-2">Bentuk Instrumen / Butir Soal yang Disertakan</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { key: 'pg', label: 'Pilihan Ganda' },
              { key: 'isian', label: 'Isian Singkat' },
              { key: 'uraian', label: 'Uraian / Essay' },
              { key: 'praktik', label: 'Kinerja / Praktik' },
              { key: 'proyek', label: 'Proyek / P5' },
            ].map((bt) => (
              <label
                key={bt.key}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                  questionTypesIncluded[bt.key as keyof typeof questionTypesIncluded]
                    ? 'border-purple-500 bg-purple-50/70 text-purple-900'
                    : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={questionTypesIncluded[bt.key as keyof typeof questionTypesIncluded]}
                  onChange={(e) =>
                    setQuestionTypesIncluded({
                      ...questionTypesIncluded,
                      [bt.key]: e.target.checked,
                    })
                  }
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                />
                <span>{bt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Rasio Kesukaran Kognitif (Taksonomi Bloom) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700">
              Distribusi Level Kognitif (LOTS / MOTS / HOTS)
            </label>
            <span className="text-xs text-slate-500">
              LOTS: <strong className="text-emerald-600">{difficultyRatio.lots}%</strong> • MOTS: <strong className="text-amber-600">{difficultyRatio.mots}%</strong> • HOTS: <strong className="text-purple-600">{difficultyRatio.hots}%</strong>
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60">
              <span className="text-[11px] font-bold text-emerald-800 block">LOTS (C1-C2)</span>
              <span className="text-[10px] text-emerald-600">Mengingat, Memahami</span>
            </div>
            <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60">
              <span className="text-[11px] font-bold text-amber-800 block">MOTS (C3)</span>
              <span className="text-[10px] text-amber-600">Mengaplikasikan</span>
            </div>
            <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200/60">
              <span className="text-[11px] font-bold text-purple-800 block">HOTS (C4-C6)</span>
              <span className="text-[10px] text-purple-600">Menganalisis, Evaluasi, Kreasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Kelengkapan Rubrik & Kriteria Penilaian */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">4. Komponen Rubrik & Pedoman Penskoran</h2>
            <p className="text-xs text-slate-500">Pilih format instrumen penilaian pelengkap yang akan digenerate</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-6">
          {[
            {
              key: 'analytic',
              label: 'Rubrik Analitik 4 Skala',
              desc: 'Kriteria terperinci per aspek (Sangat Baik, Baik, Cukup, Perlu Bimbingan)',
            },
            {
              key: 'holistic',
              label: 'Rubrik Holistik',
              desc: 'Deskripsi penilaian menyeluruh dalam satu skala global',
            },
            {
              key: 'scoringGuide',
              label: 'Pedoman Penskoran & Kunci',
              desc: 'Rincian langkah pembobotan skor per butir soal uraian/praktik',
            },
            {
              key: 'kktpInterval',
              label: 'Interval KKTP & Tindak Lanjut',
              desc: 'Skala capaian (0-100%) dan rekomendasi remedial/pengayaan',
            },
            {
              key: 'studentSheet',
              label: 'Format Lembar Nilai Siswa',
              desc: 'Tabel blangko rekap penilaian yang siap dicetak & diisi di kelas',
            },
          ].map((rb) => (
            <label
              key={rb.key}
              className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3 ${
                rubricTypesIncluded[rb.key as keyof typeof rubricTypesIncluded]
                  ? 'border-emerald-500 bg-emerald-50/50 text-slate-900 ring-1 ring-emerald-200'
                  : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
              }`}
            >
              <input
                type="checkbox"
                checked={rubricTypesIncluded[rb.key as keyof typeof rubricTypesIncluded]}
                onChange={(e) =>
                  setRubricTypesIncluded({
                    ...rubricTypesIncluded,
                    [rb.key]: e.target.checked,
                  })
                }
                className="mt-1 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div>
                <div className="font-bold text-xs text-slate-900">{rb.label}</div>
                <div className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{rb.desc}</div>
              </div>
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Fokus Khusus Penilaian (Opsional)</label>
            <input
              type="text"
              value={rubricFocus}
              onChange={(e) => setRubricFocus(e.target.value)}
              placeholder="Contoh: Menekankan pada kemampuan analisis data & presentasi lisan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs font-medium text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Catatan Tambahan untuk AI (Opsional)</label>
            <input
              type="text"
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              placeholder="Contoh: Sediakan kunci jawaban berhitung langkah demi langkah"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 text-xs font-medium text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* 5. Submit Button Card & AI Engine Info */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30">
              AI Engine: {activeConfig.name}
            </span>
            {!isConnected && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 border border-amber-400/30">
                Kunci Belum Diatur
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold">Siap Menyusun Kisi-Kisi & Rubrik Penilaian?</h3>
          <p className="text-xs text-blue-200 max-w-lg">
            Dokumen akan otomatis tersusun rapi dan dapat langsung diunduh ke format Microsoft Word (.docx) siap cetak.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onOpenApiKeyModal}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all flex items-center gap-2"
          >
            <Settings2 className="w-4 h-4" />
            <span>Pengaturan AI</span>
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 sm:flex-none px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
          >
            <Sparkles className="w-5 h-5" />
            <span>{isLoading ? 'Menyusun Instrumen...' : 'Buat Kisi-Kisi & Rubrik AI'}</span>
          </button>
        </div>
      </div>
    </form>
  );
};
