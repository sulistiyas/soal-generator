'use client';

import React, { useState } from 'react';
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
  getSubjectsForLevel,
} from '@/lib/constants';
import {
  getTopicSuggestions,
  getSubMaterialSuggestions,
} from '@/lib/subject-topics';
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
  Layers,
  ListTree,
  CheckCircle2,
  HelpCircle,
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
  // Hitung rentang tahun ajaran dinamis (5 tahun ke depan dari 1 tahun sebelum tahun sekarang)
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 1; // Misal 2026 -> 2025
  const academicYears = Array.from({ length: 6 }, (_, i) => {
    const y = startYear + i;
    return `${y}/${y + 1}`;
  });

  // 1. Identitas Sekolah & Jenis Ujian States
  const [schoolName, setSchoolName] = useState('');
  const [academicYear, setAcademicYear] = useState(`${currentYear}/${currentYear + 1}`);
  const [level, setLevel] = useState<EducationLevel | ''>('');
  const [examCategory, setExamCategory] = useState<ExamCategory | ''>('');

  // 2. Kurikulum & Materi States
  const [curriculum, setCurriculum] = useState<CurriculumType>('merdeka');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('1 (Ganjil)');
  const [durationMinutes, setDurationMinutes] = useState(90);

  // Dynamic Topic & Sub-Material State
  const [topic, setTopic] = useState('');
  const [selectedTopicPreset, setSelectedTopicPreset] = useState('');
  const [specificMaterial, setSpecificMaterial] = useState('');
  const [selectedSubPreset, setSelectedSubPreset] = useState('');

  // 3. Komposisi & Karakteristik Soal States
  const [pgCount, setPgCount] = useState(10);
  const [isianCount, setIsianCount] = useState(5);
  const [essayCount, setEssayCount] = useState(3);
  const [difficulty, setDifficulty] = useState<'seimbang' | 'hots' | 'mudah'>('seimbang');
  const [additionalInstructions] = useState('');

  // Validation Error State
  const [formError, setFormError] = useState<string | null>(null);

  // Helper to synchronize topic and sub-material when subject, level, or curriculum changes
  const updateTopicAndSub = (lvl: EducationLevel, sub: string, curr: CurriculumType) => {
    if (!lvl || !sub) {
      setSelectedTopicPreset('');
      setTopic('');
      setSelectedSubPreset('');
      setSpecificMaterial('');
      return;
    }

    const suggestedTopics = getTopicSuggestions(lvl, sub, curr);
    if (suggestedTopics && suggestedTopics.length > 0) {
      const firstTopic = suggestedTopics[0].topic;
      setSelectedTopicPreset(firstTopic);
      setTopic(firstTopic);

      const subList = getSubMaterialSuggestions(lvl, sub, firstTopic, curr);
      if (subList && subList.length > 0) {
        setSelectedSubPreset(subList[0]);
        setSpecificMaterial(subList[0]);
      } else {
        setSelectedSubPreset('');
        setSpecificMaterial('');
      }
    } else {
      setSelectedTopicPreset('__custom__');
      setTopic('');
      setSelectedSubPreset('');
      setSpecificMaterial('');
    }
  };

  // Handle change of Level (Jenjang)
  const handleLevelChange = (newLevel: EducationLevel) => {
    setLevel(newLevel);
    setFormError(null);

    const currentLevelInfo = EDUCATION_LEVELS[newLevel];
    if (currentLevelInfo && currentLevelInfo.grades.length > 0) {
      const firstGrade = currentLevelInfo.grades[0];
      setGrade(`${firstGrade.name} (${firstGrade.phase || ''})`.trim());
    }

    const availableSubjects = getSubjectsForLevel(newLevel, curriculum);
    const nextSubject = availableSubjects[0] || '';
    setSubject(nextSubject);
    updateTopicAndSub(newLevel, nextSubject, curriculum);
  };

  // Handle change of Subject (Mapel)
  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    setFormError(null);
    if (level) {
      updateTopicAndSub(level, newSubject, curriculum);
    }
  };

  // Handle change of Curriculum (Kurikulum)
  const handleCurriculumChange = (newCurriculum: CurriculumType) => {
    setCurriculum(newCurriculum);
    if (level) {
      const availableSubjects = getSubjectsForLevel(level, newCurriculum);
      const nextSubject = availableSubjects.includes(subject) ? subject : (availableSubjects[0] || '');
      setSubject(nextSubject);
      updateTopicAndSub(level, nextSubject, newCurriculum);
    }
  };

  // Handle change of Topic Preset dropdown
  const handleTopicPresetChange = (val: string) => {
    setSelectedTopicPreset(val);
    setFormError(null);
    if (val !== '__custom__') {
      setTopic(val);
      if (level && subject) {
        const subList = getSubMaterialSuggestions(level, subject, val, curriculum);
        if (subList && subList.length > 0) {
          setSelectedSubPreset(subList[0]);
          setSpecificMaterial(subList[0]);
        } else {
          setSelectedSubPreset('');
          setSpecificMaterial('');
        }
      }
    }
  };

  // Handle change of Sub-Material Preset dropdown
  const handleSubPresetChange = (val: string) => {
    setSelectedSubPreset(val);
    if (val === '__empty__' || val === '') {
      setSpecificMaterial('');
    } else if (val === '__custom__') {
      // Switched to manual input
    } else {
      setSpecificMaterial(val);
    }
  };

  // Handle change of Exam Category
  const handleCategoryChange = (cat: ExamCategory) => {
    setExamCategory(cat);
    setFormError(null);
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

    if (!schoolName.trim()) {
      setFormError('Nama Sekolah / Madrasah wajib diisi.');
      return;
    }

    if (!level) {
      setFormError('Jenjang Pendidikan wajib dipilih (SD, SMP, SMA, atau SMK).');
      return;
    }

    if (!examCategory) {
      setFormError('Jenis Asesmen / Ujian wajib dipilih (Ulangan Harian, STS/PTS, SAS/PAS, atau Ujian Sekolah).');
      return;
    }

    if (!subject) {
      setFormError('Mata Pelajaran wajib dipilih.');
      return;
    }

    if (!topic.trim()) {
      setFormError('Topik Utama / Bab materi wajib diisi.');
      return;
    }

    setFormError(null);

    let difficultyRatio = { lots: 30, mots: 50, hots: 20 };
    if (difficulty === 'hots') {
      difficultyRatio = { lots: 15, mots: 35, hots: 50 };
    } else if (difficulty === 'mudah') {
      difficultyRatio = { lots: 60, mots: 30, hots: 10 };
    }

    onGenerate({
      schoolName: schoolName.trim(),
      educationLevel: level,
      grade,
      subject,
      curriculum,
      examCategory,
      semester,
      academicYear,
      durationMinutes,
      topic: topic.trim(),
      specificMaterial: specificMaterial.trim() || undefined,
      pgCount,
      isianCount,
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
      case 'anthropic':
        return <Bot className="w-4 h-4 text-orange-500" />;
    }
  };

  const levelInfo = level ? EDUCATION_LEVELS[level] : null;
  const availableSubjects = level ? getSubjectsForLevel(level, curriculum) : [];
  const topicSuggestions = level && subject ? getTopicSuggestions(level, subject, curriculum) : [];
  const subMaterialSuggestions = level && subject && topic ? getSubMaterialSuggestions(level, subject, topic, curriculum) : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Form Error Banner */}
      {formError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm flex items-start gap-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block">Mohon Lengkapi Formulir:</span>
            <span>{formError}</span>
          </div>
        </div>
      )}

      {/* 1. IDENTITAS SEKOLAH & TIPE UJIAN */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-semibold text-sm">
          <School className="w-4 h-4 text-blue-600" />
          <span>1. Identitas Sekolah & Jenis Ujian</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Sekolah / Madrasah <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => {
                setSchoolName(e.target.value);
                if (formError) setFormError(null);
              }}
              placeholder="Contoh: SMP Negeri 1 Nusantara"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tahun Ajaran <span className="text-red-500">*</span>
            </label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
              required
            >
              {academicYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Jenjang Pendidikan */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700">
              Jenjang Pendidikan <span className="text-red-500">*</span>
            </label>
            {!level && (
              <span className="text-[11px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">
                ⚠️ Wajib dipilih
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(Object.keys(EDUCATION_LEVELS) as EducationLevel[]).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => handleLevelChange(lvl)}
                className={`px-3.5 py-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                  level === lvl
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 ring-2 ring-blue-500/30'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span>{EDUCATION_LEVELS[lvl].name.split(' ')[0]}</span>
                <span className={`text-[10px] font-normal ${level === lvl ? 'text-blue-100' : 'text-slate-500'}`}>
                  ({lvl.toUpperCase()})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Jenis Asesmen / Ujian */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700">
              Jenis Asesmen / Ujian <span className="text-red-500">*</span>
            </label>
            {!examCategory && (
              <span className="text-[11px] text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">
                ⚠️ Wajib dipilih
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {EXAM_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer ${
                  examCategory === cat.id
                    ? 'bg-blue-50/90 border-blue-500 text-blue-950 font-semibold ring-2 ring-blue-500/30 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <div className="text-xs font-bold">{cat.label}</div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Waktu: {cat.defaultDuration} mnt</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. KURIKULUM & MATERI PEMBELAJARAN */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-semibold text-sm">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>2. Kurikulum & Materi Pelajaran</span>
        </div>

        {!level && (
          <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-blue-900 text-xs flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              Silakan pilih <strong>Jenjang Pendidikan</strong> pada bagian 1 di atas untuk memuat daftar kelas, mata pelajaran, dan pilihan bab secara otomatis.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Kurikulum */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kurikulum <span className="text-red-500">*</span>
            </label>
            <select
              value={curriculum}
              onChange={(e) => handleCurriculumChange(e.target.value as CurriculumType)}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
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
              Tingkat Kelas / Fase <span className="text-red-500">*</span>
            </label>
            {levelInfo ? (
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
              >
                {levelInfo.grades.map((g) => (
                  <option key={g.id} value={`${g.name} (${g.phase || ''})`.trim()}>
                    {g.name} {g.phase ? `- ${g.phase}` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <select
                disabled
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
              >
                <option>-- Pilih Jenjang Terlebih Dahulu --</option>
              </select>
            )}
          </div>

          {/* Semester */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Semester <span className="text-red-500">*</span>
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
            >
              <option value="1 (Ganjil)">1 (Ganjil)</option>
              <option value="2 (Genap)">2 (Genap)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mata Pelajaran */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Mata Pelajaran <span className="text-red-500">*</span></span>
              {level && (
                <span className="text-[10px] text-blue-600 font-normal">Mengubah pilihan bab & sub-materi</span>
              )}
            </label>
            {level ? (
              <select
                value={subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
              >
                {availableSubjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            ) : (
              <select
                disabled
                className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
              >
                <option>-- Pilih Jenjang Terlebih Dahulu --</option>
              </select>
            )}
          </div>

          {/* Alokasi Waktu */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Alokasi Waktu Pengerjaan (Menit) <span className="text-red-500">*</span>
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

        {/* Topik Utama / Bab */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700">
              Topik Utama / Bab / Capaian Pembelajaran <span className="text-red-500">*</span>
            </label>
            {subject && (
              <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Bab Sesuai Mapel: {subject.split('(')[0].trim()}
              </span>
            )}
          </div>

          {level && subject ? (
            <>
              {/* Dropdown Pilihan Bab Sesuai Mapel */}
              <select
                value={selectedTopicPreset}
                onChange={(e) => handleTopicPresetChange(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50/50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
              >
                {topicSuggestions.length > 0 && (
                  <optgroup label={`📚 Contoh Bab Terpilih (${subject})`}>
                    {topicSuggestions.map((item, idx) => (
                      <option key={idx} value={item.topic}>
                        {idx + 1}. {item.topic}
                      </option>
                    ))}
                  </optgroup>
                )}
                <optgroup label="⚙️ Opsi Lainnya">
                  <option value="__custom__">✏️ Tulis Manual / Bab Kustom...</option>
                </optgroup>
              </select>

              {/* Kolom Input Edit Topik (Hanya muncul jika memilih Tulis Manual) */}
              {selectedTopicPreset === '__custom__' ? (
                <div className="space-y-1.5 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => {
                      setTopic(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    placeholder="Tuliskan judul bab atau konsep kunci yang ingin diujikan..."
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 shadow-2xs"
                    required
                    autoFocus
                  />
                  <p className="text-[11px] text-slate-500">
                    Ketik nama bab atau konsep materi yang ingin dibuatkan soal secara spesifik.
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">
                  Pilih bab dari daftar rekomendasi di atas, atau pilih opsi <strong>&quot;Tulis Manual&quot;</strong> jika ingin mengetik judul bab sendiri.
                </p>
              )}
            </>
          ) : (
            <select
              disabled
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
            >
              <option>-- Pilih Jenjang &amp; Mapel Terlebih Dahulu --</option>
            </select>
          )}
        </div>

        {/* Materi Tambahan */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700">
              Rincian Sub-Materi / Konteks Khusus (Opsional)
            </label>
            {topic && (
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <ListTree className="w-3.5 h-3.5" /> Rekomendasi Sub-Materi
              </span>
            )}
          </div>

          {level && subject ? (
            <>
              {/* Dropdown Pilihan Sub-Materi Sesuai Bab */}
              <select
                value={selectedSubPreset}
                onChange={(e) => handleSubPresetChange(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option value="">-- Pilih Rincian Sub-Materi / Fokus --</option>
                {subMaterialSuggestions.length > 0 && (
                  <optgroup label="🎯 Rekomendasi Sub-Materi Terkait">
                    {subMaterialSuggestions.map((sub, idx) => (
                      <option key={idx} value={sub}>
                        {idx + 1}. {sub}
                      </option>
                    ))}
                  </optgroup>
                )}
                <optgroup label="⚙️ Opsi Lainnya">
                  <option value="__empty__">❌ Kosongkan (Biarkan AI menyusun merata)</option>
                  <option value="__custom__">✏️ Tulis Manual / Rincian Kustom...</option>
                </optgroup>
              </select>

              {/* Textarea untuk Edit Rincian Sub-Materi (Hanya muncul jika memilih Tulis Manual) */}
              {selectedSubPreset === '__custom__' ? (
                <div className="space-y-1.5 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <textarea
                    value={specificMaterial}
                    onChange={(e) => setSpecificMaterial(e.target.value)}
                    placeholder="Contoh: Fokuskan pada metode ilmiah, variabel penelitian, dan pengukuran..."
                    rows={2}
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-emerald-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 shadow-2xs"
                    autoFocus
                  />
                  <p className="text-[11px] text-slate-500">
                    Tuliskan fokus materi khusus, batasan cakupan, atau instruksi materi tambahan secara bebas.
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500">
                  Pilih dari rekomendasi sub-materi di atas, atau pilih opsi <strong>&quot;Tulis Manual&quot;</strong> untuk kustomisasi rincian.
                </p>
              )}
            </>
          ) : (
            <select
              disabled
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
            >
              <option>-- Pilih Jenjang &amp; Mapel Terlebih Dahulu --</option>
            </select>
          )}
        </div>
      </div>

      {/* 3. KOMPOSISI & JUMLAH SOAL */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-semibold text-sm">
          <Sliders className="w-4 h-4 text-emerald-600" />
          <span>3. Komposisi & Karakteristik Soal</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              1. Pilihan Ganda (PG)
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
              {levelInfo ? (levelInfo.optionCount === 4 ? 'Opsi: A s/d D (4 pilihan)' : 'Opsi: A s/d E (5 pilihan)') : 'Opsi: A s/d D / E'}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              2. Isian Singkat
            </label>
            <input
              type="number"
              min={0}
              max={30}
              value={isianCount}
              onChange={(e) => setIsianCount(Number(e.target.value))}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Jawaban singkat / istilah pasti
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              3. Uraian / Essay
            </label>
            <input
              type="number"
              min={0}
              max={15}
              value={essayCount}
              onChange={(e) => setEssayCount(Number(e.target.value))}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              Jawaban panjang & rubrik skor
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Karakteristik Kesulitan
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'seimbang' | 'hots' | 'mudah')}
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
            >
              <option value="seimbang">Seimbang (30% LOTS, 50% MOTS, 20% HOTS)</option>
              <option value="hots">Fokus HOTS / AKM (50% Penalaran Tinggi)</option>
              <option value="mudah">Remedial / Dasar (60% LOTS C1-C2)</option>
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Distribusi level kognitif
            </span>
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
      <div className="pt-1 space-y-3">
        {formError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-semibold">{formError}</span>
          </div>
        )}

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
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-800">
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

