'use client';

import React, { useState, useEffect } from 'react';
import {
  EducationLevel,
  CurriculumType,
  ExamCategory,
  ExamGenerationRequest,
  UserAISettings,
  AIProviderId,
} from '@/types/exam';
import {
  EDUCATION_LEVELS,
  EXAM_CATEGORIES,
  CURRICULA,
  AI_PROVIDERS,
} from '@/lib/constants';
import {
  Sparkles,
  BookOpen,
  Clock,
  School,
  Sliders,
  Zap,
  Globe,
  HardDrive,
  Cpu,
  Bot,
  Settings2,
  AlertCircle,
} from 'lucide-react';

interface ExamFormProps {
  onGenerate: (data: ExamGenerationRequest) => void;
  isLoading: boolean;
  aiSettings: UserAISettings;
  onOpenApiKeyModal: () => void;
}

export const ExamForm: React.FC<ExamFormProps> = ({
  onGenerate,
  isLoading,
  aiSettings,
  onOpenApiKeyModal,
}) => {
  const [schoolName, setSchoolName] = useState('SMP NEGERI 1 NUSANTARA');
  const [level, setLevel] = useState<EducationLevel>('smp');
  const [grade, setGrade] = useState('Kelas 7 (Fase D)');
  const [subject, setSubject] = useState('Ilmu Pengetahuan Alam (IPA)');
  const [curriculum, setCurriculum] = useState<CurriculumType>('merdeka');
  const [examCategory, setExamCategory] = useState<ExamCategory>('sas');
  const [semester, setSemester] = useState('1 (Ganjil)');
  const [academicYear, setAcademicYear] = useState('2025/2026');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [topic, setTopic] = useState('Hakikat Ilmu Sains dan Metode Ilmiah');
  const [specificMaterial, setSpecificMaterial] = useState('');
  const [pgCount, setPgCount] = useState(10);
  const [essayCount, setEssayCount] = useState(3);
  const [difficulty, setDifficulty] = useState<'seimbang' | 'hots' | 'mudah'>('seimbang');
  const [additionalInstructions, setAdditionalInstructions] = useState('');

  useEffect(() => {
    const currentLevel = EDUCATION_LEVELS[level];
    if (currentLevel) {
      if (currentLevel.grades.length > 0) {
        const firstGrade = currentLevel.grades[0];
        setGrade(`${firstGrade.name} (${firstGrade.phase || ''})`.trim());
      }
      if (currentLevel.subjects.length > 0) {
        setSubject(currentLevel.subjects[0]);
      }
    }
  }, [level]);

  const handleCategoryChange = (cat: ExamCategory) => {
    setExamCategory(cat);
    const found = EXAM_CATEGORIES.find((c) => c.id === cat);
    if (found) {
      setDurationMinutes(found.defaultDuration);
    }
  };

  const activeProviderId: AIProviderId = aiSettings?.activeProvider || 'gemini';
  const activeConfig = AI_PROVIDERS.find((p) => p.id === activeProviderId) || AI_PROVIDERS[0];
  const activeProviderSettings = aiSettings?.providers?.[activeProviderId];
  const hasKey = !activeConfig.requiresApiKey || !!activeProviderSettings?.apiKey;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let difficultyRatio = { lots: 30, mots: 50, hots: 20 };
    if (difficulty === 'hots') {
      difficultyRatio = { lots: 15, mots: 35, hots: 50 };
    } else if (difficulty === 'mudah') {
      difficultyRatio = { lots: 60, mots: 30, hots: 10 };
    }

    onGenerate({
      schoolName,
      educationLevel: level,
      grade,
      subject,
      curriculum,
      examCategory,
      semester,
      academicYear,
      durationMinutes,
      topic,
      specificMaterial,
      pgCount,
      essayCount,
      difficultyRatio,
      additionalInstructions,
      aiProvider: activeProviderId,
      aiModel: activeProviderSettings?.model || activeConfig.defaultModel,
      userApiKey: activeProviderSettings?.apiKey || undefined,
      customBaseUrl: activeProviderSettings?.customBaseUrl || undefined,
    });
  };

  const getProviderIcon = (id: AIProviderId) => {
    switch (id) {
      case 'gemini':
        return <Sparkles className="w-4 h-4 text-blue-500" />;
      case 'groq':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'openrouter':
        return <Globe className="w-4 h-4 text-purple-500" />;
      case 'ollama':
        return <HardDrive className="w-4 h-4 text-emerald-500" />;
      case 'deepseek':
        return <Cpu className="w-4 h-4 text-cyan-500" />;
      case 'openai':
        return <Bot className="w-4 h-4 text-emerald-600" />;
    }
  };

  const levelInfo = EDUCATION_LEVELS[level];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. IDENTITAS SEKOLAH & TIPE UJIAN */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-semibold text-sm">
          <School className="w-4 h-4 text-blue-600" />
          <span>1. Identitas Sekolah & Jenis Ujian</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Sekolah / Madrasah
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Contoh: SMP Negeri 1 Nusantara"
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tahun Ajaran
            </label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              placeholder="2025/2026"
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* Jenjang Pendidikan */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Jenjang Pendidikan
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(EDUCATION_LEVELS) as EducationLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLevel(lvl)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                  level === lvl
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {EDUCATION_LEVELS[lvl].name.split(' ')[0]} ({lvl.toUpperCase()})
              </button>
            ))}
          </div>
        </div>

        {/* Jenis Asesmen / Ujian */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
          {EXAM_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                examCategory === cat.id
                  ? 'bg-blue-50/80 border-blue-500 text-blue-950 font-semibold'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="text-xs font-semibold">{cat.label}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Waktu: {cat.defaultDuration} mnt</div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. KURIKULUM & MATERI PEMBELAJARAN */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-semibold text-sm">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>2. Kurikulum & Materi Pelajaran</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Kurikulum */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kurikulum
            </label>
            <select
              value={curriculum}
              onChange={(e) => setCurriculum(e.target.value as CurriculumType)}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              {CURRICULA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Kelas */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tingkat Kelas / Fase
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              {levelInfo.grades.map((g) => (
                <option key={g.id} value={`${g.name} (${g.phase || ''})`.trim()}>
                  {g.name} {g.phase ? `- ${g.phase}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Semester */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              <option value="1 (Ganjil)">1 (Ganjil)</option>
              <option value="2 (Genap)">2 (Genap)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mata Pelajaran */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mata Pelajaran
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              {levelInfo.subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Alokasi Waktu */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Alokasi Waktu Pengerjaan (Menit)
            </label>
            <input
              type="number"
              min={15}
              max={240}
              step={5}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Topik Utama */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Topik Utama / Bab / Capaian Pembelajaran <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Contoh: Ekosistem dan Rantai Makanan, Bangun Ruang Sisi Lengkung, Teks Laporan Hasil Observasi"
            className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            required
          />
          <p className="mt-1 text-[11px] text-slate-500">
            Tuliskan judul bab atau konsep kunci yang ingin diujikan.
          </p>
        </div>

        {/* Materi Tambahan */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Rincian Sub-Materi / Konteks Khusus (Opsional)
          </label>
          <textarea
            value={specificMaterial}
            onChange={(e) => setSpecificMaterial(e.target.value)}
            placeholder="Contoh: Fokuskan pada simbiosis parasitisme, piramida makanan, serta studi kasus pencemaran sungai..."
            rows={2}
            className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* 3. KOMPOSISI & JUMLAH SOAL */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-semibold text-sm">
          <Sliders className="w-4 h-4 text-emerald-600" />
          <span>3. Komposisi & Karakteristik Soal</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jumlah Pilihan Ganda (PG)
            </label>
            <input
              type="number"
              min={0}
              max={50}
              value={pgCount}
              onChange={(e) => setPgCount(Number(e.target.value))}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Opsi: {levelInfo.optionCount === 4 ? 'A s/d D' : 'A s/d E'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Jumlah Soal Uraian / Essay
            </label>
            <input
              type="number"
              min={0}
              max={15}
              value={essayCount}
              onChange={(e) => setEssayCount(Number(e.target.value))}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">Dilengkapi rubrik penskoran</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Karakteristik Kesulitan
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              <option value="seimbang">Seimbang (30% LOTS, 50% MOTS, 20% HOTS)</option>
              <option value="hots">Fokus HOTS / AKM (50% Penalaran Tinggi)</option>
              <option value="mudah">Remedial / Dasar (60% LOTS C1-C2)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Info AI Provider Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100">
            {getProviderIcon(activeConfig.id)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">AI Generator:</span>
              <span className="text-xs font-bold text-slate-900">
                {activeConfig.name} ({activeProviderSettings?.model || activeConfig.defaultModel})
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {activeConfig.tierBadge}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {hasKey ? 'Status: Siap digunakan' : '⚠️ Kunci API belum diisi'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenApiKeyModal}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl transition-all cursor-pointer"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Ganti AI / Atur Key</span>
        </button>
      </div>

      {/* Tombol Action Generate */}
      <div className="pt-1">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:scale-[1.005] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Sedang Menyusun Naskah Soal & Kisi-Kisi dengan AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>Generate Paket Soal & Kisi-Kisi Lengkap</span>
            </>
          )}
        </button>

        {!hasKey && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-800">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                API Key untuk <strong>{activeConfig.name}</strong> belum terpasang.
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenApiKeyModal}
              className="font-bold underline text-amber-900 hover:text-black cursor-pointer ml-2"
            >
              Atur API Key Gratis
            </button>
          </div>
        )}
      </div>
    </form>
  );
};
