'use client';

import React, { useState, useEffect, useMemo, useSyncExternalStore, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { ExamPreview } from '@/components/ExamPreview';
import { DonateWidget } from '@/components/DonateWidget';
import { ExamData, UserAISettings, AIProviderId } from '@/types/exam';
import { DEFAULT_AI_SETTINGS, AI_PROVIDERS } from '@/lib/constants';
import {
  updateGeneratedExam,
  SavedExam,
} from '@/lib/exam-storage';
import { trackEvent } from '@/lib/analytics';
import {
  ArrowLeft,
  Share2,
  Check,
  Sparkles,
  Clock,
  FileQuestion,
  Home,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

function subscribeToAISettings(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('edusoal_settings_updated', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('edusoal_settings_updated', callback);
  };
}

function getAISettingsSnapshot(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('edusoal_ai_settings') || '';
}

function getAISettingsServerSnapshot(): string {
  return '';
}

function parseStoredSettings(rawJson: string): UserAISettings {
  if (!rawJson) return DEFAULT_AI_SETTINGS;
  try {
    const parsed = JSON.parse(rawJson);
    const activeProv: AIProviderId = AI_PROVIDERS.some((p) => p.id === parsed?.activeProvider)
      ? parsed.activeProvider
      : 'gemini';

    const mergedProviders: Record<AIProviderId, { apiKey: string; model: string; customBaseUrl?: string }> = {
      ...DEFAULT_AI_SETTINGS.providers,
    };

    for (const prov of AI_PROVIDERS) {
      const savedProv = parsed?.providers?.[prov.id];
      const availableModelIds = prov.availableModels.map((m) => m.id);
      let model = savedProv?.model || prov.defaultModel;

      // If the cached model is invalid or legacy, migrate to the latest default model
      if (!availableModelIds.includes(model) && model !== 'custom') {
        if (prov.id === 'openrouter' && model.startsWith('google/gemini-')) {
          model = prov.defaultModel;
        } else if (prov.id !== 'ollama' && !model.includes(':')) {
          model = prov.defaultModel;
        }
      }

      mergedProviders[prov.id] = {
        apiKey: savedProv?.apiKey || '',
        model: model,
        customBaseUrl: savedProv?.customBaseUrl || prov.defaultBaseUrl || '',
      };
    }

    return {
      activeProvider: activeProv,
      providers: mergedProviders,
    };
  } catch (e) {
    console.error('Failed to parse AI settings:', e);
    return DEFAULT_AI_SETTINGS;
  }
}

function subscribeToExam(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('edusoal_history_updated', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('edusoal_history_updated', callback);
  };
}

/**
 * Premium Shimmer Loading Skeleton for Exam Preview
 */
function ExamLoadingSkeleton({ id }: { id: string }) {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Banner Skeleton */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="h-4 w-28 bg-slate-200 rounded-md" />
            <div className="h-4 w-4 bg-slate-200 rounded-md" />
            <div className="h-4 w-20 bg-blue-100 rounded-md" />
            <div className="h-4 w-16 bg-slate-100 rounded-md font-mono text-[11px] text-slate-400 flex items-center justify-center">
              {id || '...'}
            </div>
          </div>
          <div className="h-6 w-64 sm:w-80 bg-slate-200 rounded-lg" />
          <div className="h-3.5 w-40 bg-slate-100 rounded-md" />
        </div>

        <div className="flex items-center gap-2.5">
          <div className="h-9 w-28 bg-slate-100 rounded-xl" />
          <div className="h-9 w-32 bg-slate-200 rounded-xl" />
        </div>
      </div>

      {/* Floating Loading Center Card */}
      <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-200/80 rounded-2xl p-4 flex items-center justify-center gap-3 text-blue-900 shadow-xs">
        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        <div className="text-xs sm:text-sm font-semibold flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>Memuat Naskah Soal & Kisi-Kisi Ujian...</span>
        </div>
      </div>

      {/* Action Toolbar Skeleton */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="h-5 w-48 bg-slate-200 rounded-md" />
        <div className="flex gap-2">
          <div className="h-8 w-36 bg-blue-100 rounded-xl" />
          <div className="h-8 w-24 bg-slate-100 rounded-xl" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 border-b border-slate-200 pb-px">
        <div className="h-9 w-40 bg-white border border-slate-200 rounded-t-xl" />
        <div className="h-9 w-36 bg-slate-100 rounded-t-xl" />
        <div className="h-9 w-36 bg-slate-100 rounded-t-xl" />
      </div>

      {/* Naskah Paper Skeleton */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="text-center border-b-2 border-slate-200 pb-4 space-y-2">
          <div className="h-6 w-72 bg-slate-200 rounded-lg mx-auto" />
          <div className="h-4 w-48 bg-slate-100 rounded-md mx-auto" />
          <div className="h-3 w-56 bg-slate-100 rounded-md mx-auto" />
        </div>

        {/* Question Cards Skeleton */}
        <div className="space-y-4 pt-2">
          {[1, 2, 3].map((num) => (
            <div key={num} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-5 w-16 bg-blue-100 rounded-md" />
                <div className="h-4 w-20 bg-slate-200 rounded-md" />
              </div>
              <div className="h-4 w-full bg-slate-200 rounded-md" />
              <div className="h-4 w-4/5 bg-slate-200 rounded-md" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {[1, 2, 3, 4].map((opt) => (
                  <div key={opt} className="h-8 bg-white border border-slate-200 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function GeneratedExamPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : (rawId as string) || '';
  const classSlug = Array.isArray(params?.classSlug) ? params.classSlug[0] : (params?.classSlug as string) || '';

  const storedJson = useSyncExternalStore(
    subscribeToAISettings,
    getAISettingsSnapshot,
    getAISettingsServerSnapshot
  );
  const aiSettings = useMemo(() => parseStoredSettings(storedJson), [storedJson]);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const getExamSnapshot = useCallback(() => {
    if (typeof window === 'undefined' || !id) return '';
    return (
      localStorage.getItem(`edusoal_exam_${id}`) ||
      localStorage.getItem(`edusoal_exam_${decodeURIComponent(id).trim()}`) ||
      ''
    );
  }, [id]);

  const rawExamJson = useSyncExternalStore(subscribeToExam, getExamSnapshot, () => '');

  const savedExam = useMemo(() => {
    if (!rawExamJson) return null;
    try {
      return JSON.parse(rawExamJson) as SavedExam;
    } catch {
      return null;
    }
  }, [rawExamJson]);

  const [localExamData, setLocalExamData] = useState<ExamData | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Smooth loading check on mount or ID change
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [id]);

  const examData = localExamData || savedExam?.exam || null;

  const handleSaveSettings = (newSettings: UserAISettings) => {
    try {
      localStorage.setItem('edusoal_ai_settings', JSON.stringify(newSettings));
      if (newSettings.providers.gemini?.apiKey) {
        localStorage.setItem('edusoal_gemini_api_key', newSettings.providers.gemini.apiKey);
      }
      window.dispatchEvent(new Event('edusoal_settings_updated'));
    } catch (e) {
      console.error('Failed to save AI settings:', e);
    }
  };

  const handleUpdateExam = (updated: ExamData) => {
    setLocalExamData(updated);
    if (id) {
      updateGeneratedExam(id, updated);
      setSaveStatus('Tersimpan otomatis');
      setTimeout(() => setSaveStatus(null), 2500);
    }
  };

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    trackEvent('share_exam_link', {
      exam_id: id as string,
    });
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar
        aiSettings={aiSettings}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        aiSettings={aiSettings}
        onSaveSettings={handleSaveSettings}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Loading Skeleton during refresh / initial storage resolution */}
        {isChecking && !examData ? (
          <ExamLoadingSkeleton id={id} />
        ) : examData ? (
          /* Loaded State: Interactive Exam Preview with Breadcrumbs */
          <>
            {/* Navigation Bar & Link Info Banner */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
              <div className="space-y-1.5">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Portal Hub</span>
                  </Link>
                  <span>/</span>
                  <Link
                    href="/tools/soal-generator"
                    className="inline-flex items-center gap-1 hover:text-blue-600 transition-colors"
                  >
                    <FileQuestion className="w-3.5 h-3.5" />
                    <span>Generator Soal</span>
                  </Link>
                  <span>/</span>
                  <span className="text-slate-700 font-semibold">Hasil Generate</span>
                  <span>/</span>
                  <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                    {classSlug || 'kelas'}
                  </span>
                  <span>/</span>
                  <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                    {id}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {examData.subject} - {examData.grade}
                  </h1>
                  {saveStatus && (
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1 animate-fade-in">
                      <Check className="w-3 h-3 text-emerald-600" />
                      {saveStatus}
                    </span>
                  )}
                </div>

                {savedExam?.createdAt && (
                  <p className="text-[11.5px] text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Dibuat: {formatDateTime(savedExam.createdAt)}</span>
                    {savedExam.updatedAt && (
                      <span>• Diedit: {formatDateTime(savedExam.updatedAt)}</span>
                    )}
                  </p>
                )}
              </div>

              {/* Action Buttons: Salin Link & Buat Soal Baru */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    copiedLink
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                  title="Salin link unik hasil generate soal ini"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Link Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-blue-600" />
                      <span>Salin Link Unik</span>
                    </>
                  )}
                </button>

                <Link
                  href="/tools/soal-generator"
                  className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-semibold shadow-xs hover:shadow active:scale-[0.99] transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Buat Soal Baru</span>
                </Link>
              </div>
            </div>

            {/* Complete Interactive Preview */}
            <ExamPreview
              exam={examData}
              onUpdateExam={handleUpdateExam}
              onReset={() => router.push('/tools/soal-generator')}
            />
          </>
        ) : (
          /* Empty / Not Found State (Only shown after checking finishes and no data exists) */
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-xs space-y-5 max-w-xl mx-auto my-8 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
              <FileQuestion className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Naskah Soal Tidak Ditemukan
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Naskah soal dengan ID <code className="bg-slate-100 px-2 py-0.5 rounded text-blue-700 font-mono font-bold text-xs">{id}</code>{' '}
                tidak tersimpan di browser ini atau mungkin telah dihapus. Data soal disimpan secara lokal di perangkat yang membuat naskah tersebut.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/tools/soal-generator"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm hover:shadow transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Buka Generator & Buat Soal</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 print:hidden">
        <p>Teacher Tools Hub • EduSoal AI &copy; 2026 • Dirancang untuk Guru & Sekolah Indonesia</p>
      </footer>

      {/* Floating Donate Widget & Modal (Auto-open on page load/refresh) */}
      <DonateWidget autoOpenOnMount={true} />
    </div>
  );
}
