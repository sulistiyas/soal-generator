import { ExamData, ExamGenerationRequest } from '@/types/exam';

export interface SavedExam {
  id: string;
  classSlug: string;
  url: string;
  createdAt: string;
  updatedAt?: string;
  exam: ExamData;
  requestData?: ExamGenerationRequest;
}

export interface SavedExamSummary {
  id: string;
  classSlug: string;
  url: string;
  title: string;
  subject: string;
  grade: string;
  questionCount: number;
  createdAt: string;
}

const STORAGE_PREFIX = 'edusoal_exam_';
const HISTORY_KEY = 'edusoal_exam_history';
const MAX_HISTORY_ITEMS = 30;

/**
 * Generate a clean, URL-friendly slug for class/grade
 * e.g. "Kelas 7 (Fase D)" + "smp" -> "kelas-7-smp"
 */
export function generateClassSlug(grade: string, educationLevel?: string): string {
  if (!grade) return 'kelas-umum';

  // Check if grade contains "Kelas X" pattern
  const classMatch = grade.match(/kelas\s*(\d+|[ivxcdm]+)/i);
  const phaseMatch = grade.match(/fase\s*([a-f])/i);

  let base = '';
  if (classMatch) {
    base = `kelas-${classMatch[1].toLowerCase()}`;
  } else {
    base = grade
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  if (educationLevel && !base.includes(educationLevel.toLowerCase())) {
    base = `${base}-${educationLevel.toLowerCase()}`;
  } else if (phaseMatch && !base.includes('fase')) {
    base = `${base}-fase-${phaseMatch[1].toLowerCase()}`;
  }

  return base || 'kelas-umum';
}

/**
 * Generate a secure, unique short alphanumeric ID (e.g. 10 chars)
 */
export function generateUniqueId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID().replace(/-/g, '').slice(0, 10);
  }
  return (
    Math.random().toString(36).substring(2, 8) +
    Math.random().toString(36).substring(2, 6)
  );
}

/**
 * Save a newly generated exam to localStorage and history
 */
export function saveGeneratedExam(
  exam: ExamData,
  requestData?: ExamGenerationRequest
): { id: string; classSlug: string; url: string } {
  const id = generateUniqueId();
  const classSlug = generateClassSlug(exam.grade || requestData?.grade || '', exam.educationLevel || requestData?.educationLevel);
  const url = `/generated/${classSlug}/${id}`;
  const now = new Date().toISOString();

  const savedItem: SavedExam = {
    id,
    classSlug,
    url,
    createdAt: now,
    exam,
    requestData,
  };

  if (typeof window !== 'undefined') {
    try {
      // 1. Save full exam data
      localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(savedItem));

      // 2. Update recent history index
      const history = getExamHistory();
      const summary: SavedExamSummary = {
        id,
        classSlug,
        url,
        title: exam.examTitle || 'Paket Soal Ujian',
        subject: exam.subject || 'Mata Pelajaran',
        grade: exam.grade || 'Kelas',
        questionCount: exam.questions?.length || 0,
        createdAt: now,
      };

      const updatedHistory = [summary, ...history.filter((h) => h.id !== id)].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

      // Dispatch custom event for reactive UI updates
      window.dispatchEvent(new Event('edusoal_history_updated'));
    } catch (error) {
      console.error('Failed to save exam to localStorage:', error);
    }
  }

  return { id, classSlug, url };
}

/**
 * Retrieve a saved exam by ID from localStorage
 */
export function getGeneratedExam(id: string): SavedExam | null {
  if (typeof window === 'undefined' || !id) return null;

  try {
    const cleanId = decodeURIComponent(id).trim();
    let raw = localStorage.getItem(`${STORAGE_PREFIX}${cleanId}`);
    
    if (!raw && cleanId !== id) {
      raw = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    }

    // Fallback: search all storage keys if prefix format changed
    if (!raw) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX) && key.includes(cleanId)) {
          raw = localStorage.getItem(key);
          break;
        }
      }
    }

    if (!raw) return null;
    return JSON.parse(raw) as SavedExam;
  } catch (error) {
    console.error(`Failed to parse saved exam for ID ${id}:`, error);
    return null;
  }
}

/**
 * Update an existing saved exam in localStorage
 */
export function updateGeneratedExam(id: string, updatedExam: ExamData): void {
  if (typeof window === 'undefined' || !id) return;

  try {
    const cleanId = decodeURIComponent(id).trim();
    const existing = getGeneratedExam(cleanId);
    if (!existing) return;

    const now = new Date().toISOString();
    const updated: SavedExam = {
      ...existing,
      updatedAt: now,
      exam: updatedExam,
    };

    localStorage.setItem(`${STORAGE_PREFIX}${cleanId}`, JSON.stringify(updated));

    // Update history entry if title/questionCount changed
    const history = getExamHistory();
    const historyIndex = history.findIndex((h) => h.id === cleanId || h.id === id);
    if (historyIndex >= 0) {
      history[historyIndex] = {
        ...history[historyIndex],
        title: updatedExam.examTitle || history[historyIndex].title,
        questionCount: updatedExam.questions?.length || history[historyIndex].questionCount,
      };
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }

    window.dispatchEvent(new Event('edusoal_history_updated'));
  } catch (error) {
    console.error(`Failed to update exam for ID ${id}:`, error);
  }
}

/**
 * Get list of recent generated exams from history
 */
export function getExamHistory(): SavedExamSummary[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedExamSummary[];
  } catch (error) {
    console.error('Failed to read exam history:', error);
    return [];
  }
}

/**
 * Delete a specific generated exam from storage and history
 */
export function deleteGeneratedExam(id: string): void {
  if (typeof window === 'undefined' || !id) return;

  try {
    const cleanId = decodeURIComponent(id).trim();
    localStorage.removeItem(`${STORAGE_PREFIX}${cleanId}`);
    localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
    const history = getExamHistory().filter((h) => h.id !== cleanId && h.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    window.dispatchEvent(new Event('edusoal_history_updated'));
  } catch (error) {
    console.error(`Failed to delete exam ID ${id}:`, error);
  }
}
