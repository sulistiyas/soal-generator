export type EducationLevel = 'sd' | 'smp' | 'sma' | 'smk';

export type CurriculumType = 'merdeka' | 'k13';

export type ExamCategory = 
  | 'formatif' // Ulangan Harian / Asesmen Formatif
  | 'sts'      // Sumatif Tengah Semester / PTS / UTS
  | 'sas'      // Sumatif Akhir Semester / PAS / UAS
  | 'us';      // Ujian Sekolah / Asesmen Akhir Jenjang

export type QuestionType = 'pg' | 'pg_kompleks' | 'menjodohkan' | 'isian' | 'uraian';

export type CognitiveLevel = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'LOTS' | 'MOTS' | 'HOTS';

export interface QuestionOption {
  key: string; // 'A', 'B', 'C', 'D', 'E'
  text: string;
}

export interface QuestionItem {
  id: string;
  number: number;
  type: QuestionType;
  stimulus?: string; // Teks pengantar / bacaan / studi kasus
  question: string;
  options?: QuestionOption[]; // Khusus PG
  correctAnswer: string; // Misal 'A' atau uraian kunci jawaban
  explanation: string; // Pembahasan detail
  cognitiveLevel: CognitiveLevel | string; // C1-C6 / HOTS
  indicator: string; // Indikator soal untuk kisi-kisi
  learningObjective?: string; // Capaian / Tujuan Pembelajaran
  scoreWeight: number; // Bobot skor
}

export interface RubricItem {
  questionNumber: number;
  criteria: string;
  maxScore: number;
  scoringGuide: {
    score: number;
    description: string;
  }[];
}

export interface ExamData {
  schoolName: string;
  educationLevel: EducationLevel;
  grade: string;
  subject: string;
  curriculum: CurriculumType;
  examCategory: ExamCategory;
  examTitle: string;
  semester: string;
  academicYear: string;
  durationMinutes: number;
  topic: string;
  teacherName?: string;
  instructions: string[];
  questions: QuestionItem[];
  rubrics?: RubricItem[];
}

export type AIProviderId = 'gemini' | 'groq' | 'openrouter' | 'ollama' | 'deepseek' | 'openai' | 'anthropic';

export interface AIModelOption {
  id: string;
  name: string;
  badge?: string; // e.g. "Rekomendasi", "Free Tier", "Super Cepat", "Penalaran HOTS"
  description?: string;
}

export interface AIProviderConfig {
  id: AIProviderId;
  name: string;
  tagline: string;
  tierBadge: string; // e.g. "Gratis (Rekomendasi)", "Gratis (Super Cepat)", "Lokal / Offline", "Berbayar"
  tierType: 'free' | 'freemium' | 'local' | 'paid';
  description: string;
  defaultModel: string;
  availableModels: AIModelOption[];
  requiresApiKey: boolean;
  apiKeyPlaceholder?: string;
  apiKeyHelpUrl?: string;
  apiKeyHelpTitle?: string;
  apiKeyHelpSteps?: string[];
  supportsCustomBaseUrl?: boolean;
  defaultBaseUrl?: string;
}

export interface ProviderSettingItem {
  apiKey: string;
  model: string;
  customBaseUrl?: string;
}

export interface UserAISettings {
  activeProvider: AIProviderId;
  providers: Record<AIProviderId, ProviderSettingItem>;
}

export interface ExamGenerationRequest {
  schoolName: string;
  educationLevel: EducationLevel;
  grade: string;
  subject: string;
  curriculum: CurriculumType;
  examCategory: ExamCategory;
  semester: string;
  academicYear: string;
  durationMinutes: number;
  topic: string;
  specificMaterial?: string;
  pgCount: number;
  essayCount: number;
  difficultyRatio: {
    lots: number;
    mots: number;
    hots: number;
  };
  additionalInstructions?: string;
  userApiKey?: string;
  aiProvider?: AIProviderId;
  aiModel?: string;
  customBaseUrl?: string;
}

