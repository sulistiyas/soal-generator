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

  // Dynamic Topic & Sub-Material State
  const initialTopic = 'Hakikat Ilmu Sains dan Metode Ilmiah';
  const initialSubList = getSubMaterialSuggestions('Ilmu Pengetahuan Alam (IPA)', initialTopic);
  const initialSub = initialSubList[0] || '';

  const [topic, setTopic] = useState(initialTopic);
  const [selectedTopicPreset, setSelectedTopicPreset] = useState(initialTopic);
  const [specificMaterial, setSpecificMaterial] = useState(initialSub);
  const [selectedSubPreset, setSelectedSubPreset] = useState(initialSub);

  const [pgCount, setPgCount] = useState(10);
  const [essayCount, setEssayCount] = useState(3);
  const [difficulty, setDifficulty] = useState<'seimbang' | 'hots' | 'mudah'>('seimbang');
  const [additionalInstructions] = useState('');

  // Handle change of Subject (Mapel)
  const handleSubjectChange = (newSubject: string) => {
    setSubject(newSubject);
    const suggestedTopics = getTopicSuggestions(newSubject);
    if (suggestedTopics && suggestedTopics.length > 0) {
      const firstTopic = suggestedTopics[0].topic;
      setSelectedTopicPreset(firstTopic);
      setTopic(firstTopic);

      const subList = getSubMaterialSuggestions(newSubject, firstTopic);
      if (subList && subList.length > 0) {
        setSelectedSubPreset(subList[0]);
        setSpecificMaterial(subList[0]);
      } else {
        setSelectedSubPreset('');
        setSpecificMaterial('');
      }
    } else {
      setSelectedTopicPreset('__custom__');
      setSelectedSubPreset('');
      setSpecificMaterial('');
    }
  };

  // Handle change of Level (Jenjang)
  const handleLevelChange = (newLevel: EducationLevel) => {
    setLevel(newLevel);
    const currentLevel = EDUCATION_LEVELS[newLevel];
    if (currentLevel) {
      if (currentLevel.grades.length > 0) {
        const firstGrade = currentLevel.grades[0];
        setGrade(`${firstGrade.name} (${firstGrade.phase || ''})`.trim());
      }
      if (currentLevel.subjects.length > 0) {
        const firstSub = currentLevel.subjects[0];
        handleSubjectChange(firstSub);
      }
    }
  };

  // Handle change of Topic Preset dropdown
  const handleTopicPresetChange = (val: string) => {
    setSelectedTopicPreset(val);
    if (val !== '__custom__') {
      setTopic(val);
      const subList = getSubMaterialSuggestions(subject, val);
      if (subList && subList.length > 0) {
        setSelectedSubPreset(subList[0]);
        setSpecificMaterial(subList[0]);
      } else {
        setSelectedSubPreset('');
        setSpecificMaterial('');
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
      case 'anthropic':
        return <Bot className="w-4 h-4 text-orange-500" />;
    }
  };

  const levelInfo = EDUCATION_LEVELS[level];
  const topicSuggestions = getTopicSuggestions(subject);
  const subMaterialSuggestions = getSubMaterialSuggestions(subject, topic);

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
                onClick={() => handleLevelChange(lvl)}
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
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Mata Pelajaran</span>
              <span className="text-[10px] text-blue-600 font-normal">Mengubah pilihan bab & sub-materi</span>
            </label>
            <select
              value={subject}
              onChange={(e) => handleSubjectChange(e.target.value)}
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

        {/* Topik Utama / Bab */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700">
              Topik Utama / Bab / Capaian Pembelajaran <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Bab Sesuai Mapel: {subject.split('(')[0].trim()}
            </span>
          </div>

          {/* Dropdown Pilihan Bab Sesuai Mapel */}
          <select
            value={selectedTopicPreset}
            onChange={(e) => handleTopicPresetChange(e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50/50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
          >
            <optgroup label={`📚 Contoh Bab Terpilih (${subject})`}>
              {topicSuggestions.map((item, idx) => (
                <option key={idx} value={item.topic}>
                  {idx + 1}. {item.topic}
                </option>
              ))}
            </optgroup>
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
                onChange={(e) => setTopic(e.target.value)}
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
        </div>

        {/* Materi Tambahan */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700">
              Rincian Sub-Materi / Konteks Khusus (Opsional)
            </label>
            <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
              <ListTree className="w-3.5 h-3.5" /> Rekomendasi Sub-Materi
            </span>
          </div>

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
              onChange={(e) => setDifficulty(e.target.value as 'seimbang' | 'hots' | 'mudah')}
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
