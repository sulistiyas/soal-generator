import { ModulAjarData, ModulAjarGenerationRequest } from '@/types/modul-ajar';
import { generateClassSlug, generateUniqueId } from './exam-storage';

export interface SavedModulAjar {
  id: string;
  classSlug: string;
  url: string;
  createdAt: string;
  updatedAt?: string;
  modul: ModulAjarData;
  requestData?: ModulAjarGenerationRequest;
}

export interface SavedModulAjarSummary {
  id: string;
  classSlug: string;
  url: string;
  title: string;
  subject: string;
  grade: string;
  format: string;
  meetingCount: number;
  createdAt: string;
}

const STORAGE_PREFIX = 'edusoal_modul_';
const HISTORY_KEY = 'edusoal_modul_history';
const MAX_HISTORY_ITEMS = 30;

/**
 * Save a newly generated Modul Ajar to localStorage and history index
 */
export function saveGeneratedModulAjar(
  modul: ModulAjarData,
  requestData?: ModulAjarGenerationRequest
): { id: string; classSlug: string; url: string } {
  const id = generateUniqueId();
  const gradeStr = modul.identitas?.faseKelas || requestData?.grade || 'Umum';
  const classSlug = generateClassSlug(gradeStr, requestData?.educationLevel);
  const url = `/generated/modul-ajar/${classSlug}/${id}`;
  const now = new Date().toISOString();

  // Attach id to modul object
  const modulWithId: ModulAjarData = {
    ...modul,
    id,
  };

  const savedItem: SavedModulAjar = {
    id,
    classSlug,
    url,
    createdAt: now,
    modul: modulWithId,
    requestData,
  };

  if (typeof window !== 'undefined') {
    try {
      // 1. Save full data
      localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(savedItem));

      // 2. Update history summary
      const history = getModulAjarHistory();
      const summary: SavedModulAjarSummary = {
        id,
        classSlug,
        url,
        title: modul.identitas?.topikMateri || requestData?.topic || 'Modul Ajar',
        subject: modul.identitas?.mataPelajaran || requestData?.subject || 'Mata Pelajaran',
        grade: modul.identitas?.faseKelas || requestData?.grade || 'Kelas',
        format: modul.format || 'kurikulum_merdeka',
        meetingCount: modul.identitas?.jumlahPertemuan || modul.kegiatanPembelajaran?.length || 1,
        createdAt: now,
      };

      const filteredHistory = history.filter((h) => h.id !== id);
      const updatedHistory = [summary, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));

      window.dispatchEvent(new Event('edusoal_modul_history_updated'));
    } catch (e) {
      console.warn('Failed to save modul ajar to localStorage:', e);
    }
  }

  return { id, classSlug, url };
}

/**
 * Get full Modul Ajar by ID
 */
export function getSavedModulAjarById(id: string): SavedModulAjar | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved modul ajar:', e);
    return null;
  }
}

/**
 * Update an existing Modul Ajar in localStorage
 */
export function updateGeneratedModulAjar(id: string, updatedModul: ModulAjarData): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const existing = getSavedModulAjarById(id);
    if (!existing) return false;

    const now = new Date().toISOString();
    const updatedItem: SavedModulAjar = {
      ...existing,
      updatedAt: now,
      modul: updatedModul,
    };

    localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(updatedItem));

    // Update history entry if title/subject changed
    const history = getModulAjarHistory();
    const idx = history.findIndex((h) => h.id === id);
    if (idx !== -1) {
      history[idx].title = updatedModul.identitas?.topikMateri || history[idx].title;
      history[idx].subject = updatedModul.identitas?.mataPelajaran || history[idx].subject;
      history[idx].grade = updatedModul.identitas?.faseKelas || history[idx].grade;
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }

    window.dispatchEvent(new Event('edusoal_modul_history_updated'));
    return true;
  } catch (e) {
    console.error('Failed to update modul ajar:', e);
    return false;
  }
}

/**
 * Get all history summaries
 */
export function getModulAjarHistory(): SavedModulAjarSummary[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get modul ajar history:', e);
    return [];
  }
}

/**
 * Delete a Modul Ajar by ID
 */
export function deleteSavedModulAjar(id: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${id}`);
    const history = getModulAjarHistory().filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    window.dispatchEvent(new Event('edusoal_modul_history_updated'));
    return true;
  } catch (e) {
    console.error('Failed to delete modul ajar:', e);
    return false;
  }
}
