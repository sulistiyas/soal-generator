'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  ModulAjarGenerationRequest,
  ModulAjarFormat,
  LearningModelType,
  P5DimensionKey,
} from '@/types/modul-ajar';
import { EducationLevel, CurriculumType, UserAISettings, AIProviderId } from '@/types/exam';
import {
  EDUCATION_LEVELS,
  AI_PROVIDERS,
  CURRICULA,
  getSubjectsForLevel,
} from '@/lib/constants';
import {
  getTopicSuggestions,
  getSubMaterialSuggestions,
} from '@/lib/subject-topics';
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
  AlertCircle,
  Globe,
  HardDrive,
  Cpu,
  Bot,
  ListTree,
  FileQuestion,
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
  const searchParams = useSearchParams();

  // Hitung rentang tahun ajaran dinamis (rentang 6 tahun)
  const currentYear = new Date().getFullYear();
  const startYear = currentYear - 1;
  const academicYears = Array.from({ length: 6 }, (_, i) => {
    const y = startYear + i;
    return `${y}/${y + 1}`;
  });

  // 1. Identitas Sekolah & Pendidik States
  const [format, setFormat] = useState<ModulAjarFormat>('kurikulum_merdeka');
  const [curriculum, setCurriculum] = useState<CurriculumType>('merdeka');
  const [schoolName, setSchoolName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [teacherNip, setTeacherNip] = useState('');
  const [headmasterName, setHeadmasterName] = useState('');
  const [headmasterNip, setHeadmasterNip] = useState('');
  const [semester, setSemester] = useState('1 (Ganjil)');
  const [academicYear, setAcademicYear] = useState(`${currentYear}/${currentYear + 1}`);

  // 2. Jenjang, Kelas & Materi States
  const [educationLevel, setEducationLevel] = useState<EducationLevel | ''>('smp');
  const [grade, setGrade] = useState('Kelas 7 (Fase D)');
  const [subject, setSubject] = useState('Ilmu Pengetahuan Alam (IPA)');
  const [customSubject, setCustomSubject] = useState('');
  const [duration, setDuration] = useState('2 x 40 menit');
  const [meetingCount, setMeetingCount] = useState(1);

  // Dynamic Topic & Sub-Material State
  const [topic, setTopic] = useState('Zat dan Perubahannya');
  const [selectedTopicPreset, setSelectedTopicPreset] = useState('Zat dan Perubahannya');
  const [subTopics, setSubTopics] = useState('Wujud zat, model partikel, dan perubahan wujud zat dalam kehidupan sehari-hari');
  const [selectedSubPreset, setSelectedSubPreset] = useState('');

  // 3. Model Pembelajaran, P5 & Diferensiasi States
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

  // Validation Error State & Cross-tool prefill info banner
  const [formError, setFormError] = useState<string | null>(null);
  const [prefillNotification, setPrefillNotification] = useState<{
    source: string;
    topic: string;
    subject: string;
    grade: string;
  } | null>(null);

  // Helper to synchronize topic and sub-material when subject, level, or curriculum changes
  const updateTopicAndSub = (lvl: EducationLevel, sub: string, curr: CurriculumType) => {
    if (!lvl || !sub) {
      setSelectedTopicPreset('');
      setTopic('');
      setSelectedSubPreset('');
      setSubTopics('');
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
        setSubTopics(subList[0]);
      } else {
        setSelectedSubPreset('');
        setSubTopics('');
      }
    } else {
      setSelectedTopicPreset('__custom__');
      setTopic('');
      setSelectedSubPreset('');
      setSubTopics('');
    }
  };

  // Load persistent user profile from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedSchool = localStorage.getItem('edusoal_school_name');
      const savedTeacher = localStorage.getItem('edusoal_teacher_name');
      const savedTeacherNip = localStorage.getItem('edusoal_teacher_nip');
      const savedHeadmaster = localStorage.getItem('edusoal_headmaster_name');
      const savedHeadmasterNip = localStorage.getItem('edusoal_headmaster_nip');
      const savedAcademicYear = localStorage.getItem('edusoal_academic_year');

      if (savedSchool && !schoolName) setSchoolName(savedSchool);
      if (savedTeacher && !teacherName) setTeacherName(savedTeacher);
      if (savedTeacherNip && !teacherNip) setTeacherNip(savedTeacherNip);
      if (savedHeadmaster && !headmasterName) setHeadmasterName(savedHeadmaster);
      if (savedHeadmasterNip && !headmasterNip) setHeadmasterNip(savedHeadmasterNip);
      if (savedAcademicYear) setAcademicYear(savedAcademicYear);
    } catch (e) {
      console.warn('Could not read saved profile:', e);
    }
  }, []);

  // Check URL Search Params for cross-tool prefill from Soal Generator
  useEffect(() => {
    if (!searchParams) return;

    const fromExam = searchParams.get('fromExam');
    const paramSchool = searchParams.get('schoolName');
    const paramLevel = searchParams.get('level') as EducationLevel | null;
    const paramGrade = searchParams.get('grade');
    const paramSubject = searchParams.get('subject');
    const paramCurriculum = searchParams.get('curriculum') as CurriculumType | null;
    const paramTopic = searchParams.get('topic');
    const paramSubTopic = searchParams.get('subTopic');

    if (paramSchool) setSchoolName(paramSchool);
    if (paramCurriculum) {
      setCurriculum(paramCurriculum);
      if (paramCurriculum === 'k13') setFormat('rpp_1_lembar');
    }

    if (paramLevel && Object.keys(EDUCATION_LEVELS).includes(paramLevel)) {
      setEducationLevel(paramLevel);
      const lvlInfo = EDUCATION_LEVELS[paramLevel];
      if (paramGrade) {
        setGrade(paramGrade);
      } else if (lvlInfo && lvlInfo.grades.length > 0) {
        const g = lvlInfo.grades[0];
        setGrade(`${g.name} (${g.phase || ''})`.trim());
      }

      if (paramSubject) {
        setSubject(paramSubject);
      }
    }

    if (paramTopic) {
      setTopic(paramTopic);
      setSelectedTopicPreset('__custom__');
    }

    if (paramSubTopic) {
      setSubTopics(paramSubTopic);
      setSelectedSubPreset('__custom__');
    }

    if (fromExam && (paramTopic || paramSubject)) {
      setPrefillNotification({
        source: 'Generator Soal AI',
        topic: paramTopic || 'Materi Terkait',
        subject: paramSubject || '',
        grade: paramGrade || '',
      });
    }
  }, [searchParams]);

  // Handle change of Level (Jenjang)
  const handleLevelChange = (newLevel: EducationLevel) => {
    setEducationLevel(newLevel);
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
    if (educationLevel && newSubject !== 'Lainnya') {
      updateTopicAndSub(educationLevel, newSubject, curriculum);
    }
  };

  // Handle change of Curriculum (Kurikulum)
  const handleCurriculumChange = (newCurriculum: CurriculumType) => {
    setCurriculum(newCurriculum);
    if (newCurriculum === 'k13' && format === 'kurikulum_merdeka') {
      setFormat('rpp_1_lembar');
    } else if (newCurriculum === 'merdeka' && format === 'rpp_1_lembar') {
      setFormat('kurikulum_merdeka');
    }

    if (educationLevel) {
      const availableSubjects = getSubjectsForLevel(educationLevel, newCurriculum);
      const nextSubject = availableSubjects.includes(subject) ? subject : (availableSubjects[0] || '');
      setSubject(nextSubject);
      updateTopicAndSub(educationLevel, nextSubject, newCurriculum);
    }
  };

  // Handle change of Topic Preset dropdown
  const handleTopicPresetChange = (val: string) => {
    setSelectedTopicPreset(val);
    setFormError(null);
    if (val !== '__custom__') {
      setTopic(val);
      if (educationLevel && subject && subject !== 'Lainnya') {
        const subList = getSubMaterialSuggestions(educationLevel, subject, val, curriculum);
        if (subList && subList.length > 0) {
          setSelectedSubPreset(subList[0]);
          setSubTopics(subList[0]);
        } else {
          setSelectedSubPreset('');
          setSubTopics('');
        }
      }
    }
  };

  // Handle change of Sub-Material Preset dropdown
  const handleSubPresetChange = (val: string) => {
    setSelectedSubPreset(val);
    if (val === '__empty__' || val === '') {
      setSubTopics('');
    } else if (val === '__custom__') {
      // Switched to manual input
    } else {
      setSubTopics(val);
    }
  };

  // Active AI Provider info
  const activeProviderId: AIProviderId = aiSettings?.activeProvider || 'gemini';
  const activeConfig = AI_PROVIDERS.find((p) => p.id === activeProviderId) || AI_PROVIDERS[0];
  const activeSetting = aiSettings?.providers?.[activeProviderId];
  const hasKey = !activeConfig.requiresApiKey || !!activeSetting?.apiKey;

  // Grade list for active education level
  const currentLevelInfo = educationLevel ? EDUCATION_LEVELS[educationLevel] : null;
  const availableSubjects = educationLevel ? getSubjectsForLevel(educationLevel, curriculum) : [];
  const topicSuggestions = educationLevel && subject && subject !== 'Lainnya' ? getTopicSuggestions(educationLevel, subject, curriculum) : [];
  const subMaterialSuggestions = educationLevel && subject && topic && subject !== 'Lainnya' ? getSubMaterialSuggestions(educationLevel, subject, topic, curriculum) : [];

  // Phase lookup
  const currentPhase = useMemo(() => {
    if (!currentLevelInfo) return 'Fase D';
    const found = currentLevelInfo.grades.find((g) => grade.includes(g.name));
    return found?.phase || (educationLevel === 'sd' ? 'Fase A/B/C' : educationLevel === 'smp' ? 'Fase D' : 'Fase E/F');
  }, [currentLevelInfo, grade, educationLevel]);

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
      setCurriculum('merdeka');
      setEducationLevel('smp');
      setGrade('Kelas 7 (Fase D)');
      setSubject('Ilmu Pengetahuan Alam (IPA)');
      setTopic('Suhu, Kalor, dan Pemuaian');
      setSelectedTopicPreset('Suhu, Kalor, dan Pemuaian');
      setSubTopics('Konsep suhu, kalor jenis, azas Black, dan perpindahan kalor (konduksi, konveksi, radiasi) pada termos dan panel surya');
      setSelectedSubPreset('__custom__');
      setDuration('2 x 40 menit');
      setMeetingCount(1);
      setLearningModel('Problem-Based Learning (PBL)');
      setSelectedP5(['Bernalar Kritis', 'Gotong Royong', 'Kreatif']);
    } else if (preset === 'sd_matematika') {
      setFormat('kurikulum_merdeka');
      setCurriculum('merdeka');
      setEducationLevel('sd');
      setGrade('Kelas 4 (Fase B)');
      setSubject('Matematika');
      setTopic('Pecahan, Desimal, dan Persen');
      setSelectedTopicPreset('Pecahan, Desimal, dan Persen');
      setSubTopics('Mengenal pecahan sederhana menggunakan gambar konkret (arsiran pecahan 1/2, 1/3, 1/4) dan pecahan senilai');
      setSelectedSubPreset('__custom__');
      setDuration('2 x 35 menit');
      setMeetingCount(2);
      setLearningModel('Discovery Learning');
      setSelectedP5(['Bernalar Kritis', 'Mandiri', 'Kreatif']);
    } else if (preset === 'sma_biologi') {
      setFormat('rpp_berdiferensiasi');
      setCurriculum('merdeka');
      setEducationLevel('sma');
      setGrade('Kelas 11 (Fase F)');
      setSubject('Biologi');
      setTopic('Struktur dan Fungsi Sel');
      setSelectedTopicPreset('Struktur dan Fungsi Sel');
      setSubTopics('Komponen kimiawi penyusun sel, struktur organel sel hewan dan tumbuhan, serta mekanisme transpor membran (difusi dan osmosis)');
      setSelectedSubPreset('__custom__');
      setDuration('2 x 45 menit');
      setMeetingCount(1);
      setLearningModel('Problem-Based Learning (PBL)');
      setSelectedP5(['Bernalar Kritis', 'Kreatif', 'Gotong Royong']);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!schoolName.trim()) {
      setFormError('Nama Sekolah / Satuan Pendidikan wajib diisi.');
      return;
    }

    if (!educationLevel) {
      setFormError('Jenjang Pendidikan wajib dipilih (SD, SMP, SMA, atau SMK).');
      return;
    }

    const actualSubject = subject === 'Lainnya' ? customSubject.trim() : subject;
    if (!actualSubject) {
      setFormError('Mata Pelajaran wajib dipilih atau diisi.');
      return;
    }

    if (!topic.trim()) {
      setFormError('Topik / Materi Utama wajib diisi.');
      return;
    }

    setFormError(null);

    // Save profile defaults to localStorage for cross-tool synchronization
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('edusoal_school_name', schoolName.trim());
        if (teacherName.trim()) localStorage.setItem('edusoal_teacher_name', teacherName.trim());
        if (teacherNip.trim()) localStorage.setItem('edusoal_teacher_nip', teacherNip.trim());
        if (headmasterName.trim()) localStorage.setItem('edusoal_headmaster_name', headmasterName.trim());
        if (headmasterNip.trim()) localStorage.setItem('edusoal_headmaster_nip', headmasterNip.trim());
        localStorage.setItem('edusoal_academic_year', academicYear);
      } catch (err) {
        console.warn('Failed to save profile cache:', err);
      }
    }

    const requestData: ModulAjarGenerationRequest = {
      format,
      schoolName: schoolName.trim(),
      teacherName: teacherName.trim() || 'Guru Pengampu',
      teacherNip: teacherNip.trim() || '-',
      headmasterName: headmasterName.trim() || 'Kepala Sekolah',
      headmasterNip: headmasterNip.trim() || '-',
      educationLevel,
      grade,
      phase: currentPhase,
      subject: actualSubject,
      semester,
      academicYear,
      duration,
      meetingCount,
      topic: topic.trim(),
      subTopics: subTopics.trim() || undefined,
      p5Dimensions: selectedP5,
      learningModel,
      targetLearners,
      facilities: selectedFacilities.join(', '),
      differentiationFocus,
      additionalInstructions: additionalInstructions.trim() || undefined,
      aiProvider: activeProviderId,
      aiModel: activeSetting?.model || activeConfig.defaultModel,
      customBaseUrl: activeSetting?.customBaseUrl || activeConfig.defaultBaseUrl,
      userApiKey: activeSetting?.apiKey || '',
    };

    onSubmit(requestData);
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Prefill from Soal Generator Banner */}
      {prefillNotification && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 text-blue-950 text-xs sm:text-sm flex items-start justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
              <FileQuestion className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold block text-blue-900">
                ✨ Data Materi Berhasil Dimuat dari {prefillNotification.source}:
              </span>
              <p className="text-blue-800 mt-0.5">
                Topik: <strong>{prefillNotification.topic}</strong> • Mapel: <strong>{prefillNotification.subject}</strong> {prefillNotification.grade && `• ${prefillNotification.grade}`}
              </p>
              <p className="text-[11px] text-blue-600 mt-1">
                Formulir telah diselaraskan secara otomatis. Silakan pilih format modul dan klik Generate.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setPrefillNotification(null)}
            className="text-blue-500 hover:text-blue-800 text-xs font-bold shrink-0 p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

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

      {/* Preset Quick Fill Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-xs font-bold text-slate-800">Contoh Cepat Sesuai Fase:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleFillDemo('smp_ipa')}
            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold border border-blue-200 transition-all cursor-pointer"
          >
            🔬 IPA SMP (Fase D)
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('sd_matematika')}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-semibold border border-indigo-200 transition-all cursor-pointer"
          >
            📐 Matematika SD (Fase B)
          </button>
          <button
            type="button"
            onClick={() => handleFillDemo('sma_biologi')}
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-semibold border border-purple-200 transition-all cursor-pointer"
          >
            🧬 Biologi SMA (Fase F)
          </button>
        </div>
      </div>

      {/* SECTION 1: IDENTITAS SEKOLAH, PENDIDIK & FORMAT DOKUMEN */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-semibold text-sm">
          <School className="w-4 h-4 text-blue-600" />
          <span>1. Identitas Sekolah, Pendidik & Format Dokumen</span>
        </div>

        {/* Format Dokumen Tabs */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Pilihan Format Administrasi <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setFormat('kurikulum_merdeka')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                format === 'kurikulum_merdeka'
                  ? 'bg-blue-50/90 border-blue-500 text-blue-950 font-semibold ring-2 ring-blue-500/30 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">Modul Ajar Lengkap</span>
                {format === 'kurikulum_merdeka' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Standar Kurikulum Merdeka (CP, TP, ATP, Sintaks PBL, LKPD & KKTP).
              </p>
            </button>

            <button
              type="button"
              onClick={() => setFormat('rpp_berdiferensiasi')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                format === 'rpp_berdiferensiasi'
                  ? 'bg-purple-50/90 border-purple-500 text-purple-950 font-semibold ring-2 ring-purple-500/30 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">Modul Berdiferensiasi</span>
                {format === 'rpp_berdiferensiasi' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Fokus pemetaan diferensiasi konten, proses, dan produk siswa.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setFormat('rpp_1_lembar')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                format === 'rpp_1_lembar'
                  ? 'bg-indigo-50/90 border-indigo-500 text-indigo-950 font-semibold ring-2 ring-indigo-500/30 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">RPP 1 Lembar (K-13)</span>
                {format === 'rpp_1_lembar' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Format ringkas inspiratif SE Mendikbud No. 14 Tahun 2019.
              </p>
            </button>
          </div>
        </div>

        {/* Nama Sekolah & Tahun Ajaran */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
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

        {/* Data Guru & Kepala Sekolah */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Nama Guru Penyusun
            </label>
            <input
              type="text"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
              placeholder="Budi Prasetyo, S.Pd."
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
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
              placeholder="19850712 201001 1 012"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
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
              placeholder="Dra. Siti Aminah, M.Pd."
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
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
              placeholder="19760315 199903 2 004"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Jenjang Pendidikan Toggle Buttons */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700">
              Jenjang Pendidikan <span className="text-red-500">*</span>
            </label>
            {!educationLevel && (
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
                  educationLevel === lvl
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25 ring-2 ring-blue-500/30'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <span>{EDUCATION_LEVELS[lvl].name.split(' ')[0]}</span>
                <span className={`text-[10px] font-normal ${educationLevel === lvl ? 'text-blue-100' : 'text-slate-500'}`}>
                  ({lvl.toUpperCase()})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: KURIKULUM & MATERI PELAJARAN */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-semibold text-sm">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>2. Kurikulum & Materi Pembelajaran</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Kurikulum */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kurikulum <span className="text-red-500">*</span>
            </label>
            <select
              value={curriculum}
              onChange={(e) => handleCurriculumChange(e.target.value as CurriculumType)}
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
            >
              {CURRICULA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Kelas & Fase */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tingkat Kelas / Fase <span className="text-red-500">*</span>
            </label>
            {currentLevelInfo ? (
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
              >
                {currentLevelInfo.grades.map((g) => (
                  <option key={g.id} value={`${g.name} (${g.phase || ''})`.trim()}>
                    {g.name} {g.phase ? `- ${g.phase}` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <select
                disabled
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
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
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
            >
              <option value="1 (Ganjil)">1 (Ganjil)</option>
              <option value="2 (Genap)">2 (Genap)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {/* Mata Pelajaran */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Mata Pelajaran <span className="text-red-500">*</span></span>
              {educationLevel && (
                <span className="text-[10px] text-blue-600 font-normal">Mengubah pilihan bab & sub-materi</span>
              )}
            </label>
            {educationLevel ? (
              <select
                value={subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
              >
                {availableSubjects.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
                <option value="Lainnya">+ Mata Pelajaran Lainnya (Kustom)...</option>
              </select>
            ) : (
              <select
                disabled
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
              >
                <option>-- Pilih Jenjang Terlebih Dahulu --</option>
              </select>
            )}
          </div>

          {/* Alokasi Waktu & Pertemuan */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Alokasi Waktu
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="2 x 40 menit"
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pertemuan
              </label>
              <select
                value={meetingCount}
                onChange={(e) => setMeetingCount(Number(e.target.value))}
                className="w-full text-sm px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white cursor-pointer"
              >
                <option value={1}>1 Pertemuan</option>
                <option value={2}>2 Pertemuan</option>
                <option value={3}>3 Pertemuan</option>
                <option value={4}>4 Pertemuan</option>
              </select>
            </div>
          </div>
        </div>

        {/* Custom Subject Input if Lainnya */}
        {subject === 'Lainnya' && (
          <div className="pt-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Ketik Nama Mata Pelajaran Kustom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="Contoh: Bahasa Sunda / Koding & Robotika / Muatan Lokal"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              required
            />
          </div>
        )}

        {/* Topik Utama / Bab */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <label className="block text-xs font-semibold text-slate-700">
              Topik Utama / Bab / Capaian Pembelajaran <span className="text-red-500">*</span>
            </label>
            {subject && subject !== 'Lainnya' && (
              <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> Bab Sesuai Mapel: {subject.split('(')[0].trim()}
              </span>
            )}
          </div>

          {educationLevel && subject ? (
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
                    placeholder="Tuliskan judul bab atau topik utama materi yang ingin diajarkan..."
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-blue-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 shadow-2xs"
                    required
                    autoFocus
                  />
                  <p className="text-[11px] text-slate-500">
                    Ketik nama bab atau konsep materi secara spesifik.
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

        {/* Rincian Sub-Materi */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-1">
            <label className="block text-xs font-semibold text-slate-700">
              Rincian Sub-Materi / Konteks Pembelajaran Khusus (Opsional)
            </label>
            {topic && (
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <ListTree className="w-3.5 h-3.5" /> Rekomendasi Sub-Materi
              </span>
            )}
          </div>

          {educationLevel && subject ? (
            <>
              {/* Dropdown Pilihan Sub-Materi Sesuai Bab */}
              <select
                value={selectedSubPreset}
                onChange={(e) => handleSubPresetChange(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer"
              >
                <option value="">-- Pilih Rincian Sub-Materi / Fokus Pembelajaran --</option>
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

              {/* Textarea untuk Edit Rincian Sub-Materi */}
              {selectedSubPreset === '__custom__' ? (
                <div className="space-y-1.5 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
                  <textarea
                    value={subTopics}
                    onChange={(e) => setSubTopics(e.target.value)}
                    placeholder="Contoh: Fokus pada pemahaman konsep partikel, demonstrasi perubahan wujud dengan lilin & es batu, dan diskusi kelompok..."
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

      {/* SECTION 3: PENDEKATAN, MODEL PEMBELAJARAN, P5 & DIFERENSIASI */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-semibold text-sm">
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>3. Model Pembelajaran, P5 & Karakteristik Kelas</span>
        </div>

        {/* Model Pembelajaran Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Model Pembelajaran Utama <span className="text-red-500">*</span>
          </label>
          <select
            value={learningModel}
            onChange={(e) => setLearningModel(e.target.value)}
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-medium cursor-pointer"
          >
            {LEARNING_MODELS.map((m) => (
              <option key={m.id} value={m.label}>
                {m.label} — {m.desc}
              </option>
            ))}
          </select>
        </div>

        {/* Profil Pelajar Pancasila (P5) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-700">
              Dimensi Profil Pelajar Pancasila (P5) (Pilih 1 - 3 Dimensi)
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
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                    active
                      ? 'bg-blue-50 border-blue-300 text-blue-950 font-bold shadow-2xs ring-1 ring-blue-400/30'
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
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1 ${
                    active
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-700 font-semibold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
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
              { id: 'konten', label: 'Diferensiasi Konten', desc: 'Variasi materi (bacaan teks, video audio visual, infografis)' },
              { id: 'proses', label: 'Diferensiasi Proses', desc: 'Variasi aktivitas (bimbingan berjenjang, mandiri, kelompok)' },
              { id: 'produk', label: 'Diferensiasi Produk', desc: 'Variasi hasil karya (laporan tertulis, poster/infografis, presentasi lisan)' },
            ].map((d) => {
              const active = differentiationFocus.includes(d.label);
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => toggleDifferentiation(d.label)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold shadow-2xs ring-1 ring-emerald-400/30'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
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

        {/* Target Peserta Didik & Instruksi Tambahan */}
        <div className="space-y-3 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Target Peserta Didik (Opsional)
            </label>
            <input
              type="text"
              value={targetLearners}
              onChange={(e) => setTargetLearners(e.target.value)}
              placeholder="Peserta didik reguler / tipikal dengan gaya belajar majemuk..."
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Instruksi Tambahan / Permintaan Khusus ke AI (Opsional)
            </label>
            <textarea
              rows={2}
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              placeholder="Contoh: Sertakan studi kasus lingkungan lokal di desa/kota, atau integrasikan kuis asesmen 5 menit di penutup..."
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Info AI Provider Box - Identical to ExamForm */}
      <div className="rounded-2xl border border-slate-200 bg-white p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-100 shrink-0">
            {getProviderIcon(activeConfig.id)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500">AI Generator:</span>
              <span className="text-xs font-bold text-slate-900">
                {activeConfig.name} ({activeSetting?.model || activeConfig.defaultModel})
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

        {onOpenApiKeyModal && (
          <button
            type="button"
            onClick={onOpenApiKeyModal}
            className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl transition-all cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Ganti AI / Atur Key</span>
          </button>
        )}
      </div>

      {/* Action Submit Button */}
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
          className="w-full min-h-[52px] py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Sedang Menyusun Dokumen Modul Ajar & RPP Lengkap dengan AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              <span>Generate Modul Ajar / RPP Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {!hasKey && onOpenApiKeyModal && (
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
              className="font-bold underline text-amber-900 hover:text-black cursor-pointer text-left sm:text-right"
            >
              Atur API Key Gratis
            </button>
          </div>
        )}
      </div>
    </form>
  );
};
