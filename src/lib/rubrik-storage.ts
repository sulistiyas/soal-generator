import { KisiKisiRubrikData, SavedRubrikItem } from '@/types/rubrik';

export type { SavedRubrikItem };

const STORAGE_KEY = 'edusoal_saved_rubrik_history';

export function getSavedRubrikHistory(): SavedRubrikItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get saved rubrik history:', e);
    return [];
  }
}

export function saveGeneratedRubrik(data: KisiKisiRubrikData): SavedRubrikItem {
  const history = getSavedRubrikHistory();
  const classSlug = `kelas-${(data.identitas.kelas || 'umum').toLowerCase().replace(/\s+/g, '-')}`;
  
  const newItem: SavedRubrikItem = {
    id: data.id,
    title: `Kisi-Kisi & Rubrik ${data.identitas.mataPelajaran || 'Mata Pelajaran'} Kelas ${data.identitas.kelas || ''}`,
    subject: data.identitas.mataPelajaran || 'Umum',
    grade: data.identitas.kelas || '',
    phase: data.identitas.fase || '',
    educationLevel: (data.identitas.fase?.toLowerCase().includes('fase a') || data.identitas.fase?.toLowerCase().includes('fase b') || data.identitas.fase?.toLowerCase().includes('fase c')) ? 'sd' : 'smp',
    assessmentType: data.identitas.jenisAsesmen || 'formatif',
    assessmentTypeLabel: data.identitas.jenisAsesmenLabel || 'Asesmen',
    topic: data.identitas.topikMateri || '',
    totalQuestions: data.identitas.jumlahSoal || data.kisiKisi?.length || 0,
    createdAt: data.createdAt || new Date().toISOString(),
    classSlug,
    data,
  };

  // Filter existing duplicates and keep newest 20 items
  const filtered = history.filter((item) => item.id !== data.id);
  const updated = [newItem, ...filtered].slice(0, 20);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('edusoal_rubrik_history_updated'));
  } catch (e) {
    console.error('Failed to save rubrik history:', e);
  }

  return newItem;
}

export function updateGeneratedRubrik(data: KisiKisiRubrikData): SavedRubrikItem | null {
  const history = getSavedRubrikHistory();
  const index = history.findIndex((item) => item.id === data.id);
  if (index === -1) {
    return saveGeneratedRubrik(data);
  }

  const updatedItem: SavedRubrikItem = {
    ...history[index],
    title: `Kisi-Kisi & Rubrik ${data.identitas.mataPelajaran || 'Mata Pelajaran'} Kelas ${data.identitas.kelas || ''}`,
    subject: data.identitas.mataPelajaran || 'Umum',
    grade: data.identitas.kelas || '',
    phase: data.identitas.fase || '',
    assessmentType: data.identitas.jenisAsesmen || 'formatif',
    assessmentTypeLabel: data.identitas.jenisAsesmenLabel || 'Asesmen',
    topic: data.identitas.topikMateri || '',
    totalQuestions: data.identitas.jumlahSoal || data.kisiKisi?.length || 0,
    data,
  };

  history[index] = updatedItem;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    window.dispatchEvent(new Event('edusoal_rubrik_history_updated'));
    return updatedItem;
  } catch (e) {
    console.error('Failed to update rubrik history:', e);
    return null;
  }
}

export function getSavedRubrikById(id: string): SavedRubrikItem | null {
  const history = getSavedRubrikHistory();
  return history.find((item) => item.id === id) || null;
}

export function deleteSavedRubrikById(id: string): boolean {
  const history = getSavedRubrikHistory();
  const filtered = history.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event('edusoal_rubrik_history_updated'));
    return true;
  } catch (e) {
    console.error('Failed to delete rubrik history:', e);
    return false;
  }
}
