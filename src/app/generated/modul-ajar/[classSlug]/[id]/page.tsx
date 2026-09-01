'use client';

import React, { useState, useEffect, useMemo, useSyncExternalStore, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { ModulAjarPreview } from '@/components/modul-ajar/ModulAjarPreview';
import { RecentModulAjarHistory } from '@/components/modul-ajar/RecentModulAjarHistory';
import { DonateWidget } from '@/components/DonateWidget';
import { ModulAjarData } from '@/types/modul-ajar';
import { UserAISettings, AIProviderId } from '@/types/exam';
import { DEFAULT_AI_SETTINGS, AI_PROVIDERS } from '@/lib/constants';
import {
  getSavedModulAjarById,
  updateGeneratedModulAjar,
  SavedModulAjar,
} from '@/lib/modul-ajar-storage';
import { trackEvent } from '@/lib/analytics';
import {
  ArrowLeft,
  Share2,
  Check,
  Sparkles,
  Clock,
  BookOpen,
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

      if (!availableModelIds.includes(model) && model !== 'custom') {
        if (prov.id === 'openrouter' && model.startsWith('google/gemini-')) {
          model = prov.defaultModel;
        } else if (prov.id === 'groq') {
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

function subscribeToModul(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('edusoal_modul_history_updated', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('edusoal_modul_history_updated', callback);
  };
}

function ModulLoadingSkeleton({ id }: { id: string }) {
  return (
    <div className="space-y-6 animate-pulse">
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

      <div className="bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10 border border-blue-200/80 rounded-2xl p-4 flex items-center justify-center gap-3 text-blue-900 shadow-xs">
        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        <div className="text-xs sm:text-sm font-semibold flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>Memuat Dokumen Modul Ajar & RPP...</span>
        </div>
      </div>
    </div>
  );
}

export default function GeneratedModulAjarViewPage() {
  const params = useParams();
  const router = useRouter();

  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const classSlug = typeof params?.classSlug === 'string' ? params.classSlug : Array.isArray(params?.classSlug) ? params.classSlug[0] : '';

  const [savedData, setSavedData] = useState<SavedModulAjar | null>(null);
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const storedJson = useSyncExternalStore(
    subscribeToAISettings,
    getAISettingsSnapshot,
    getAISettingsServerSnapshot
  );
  const aiSettings = useMemo(() => parseStoredSettings(storedJson), [storedJson]);

  const loadData = useCallback(() => {
    if (!id) return;
    const loaded = getSavedModulAjarById(id);
    setSavedData(loaded);
    setHasAttemptedLoad(true);

    if (loaded?.modul) {
      trackEvent('view_saved_modul_ajar', {
        subject: loaded.modul.identitas?.mataPelajaran || '',
        grade: loaded.modul.identitas?.faseKelas || '',
      });
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useSyncExternalStore(
    subscribeToModul,
    () => (id ? localStorage.getItem(`edusoal_modul_${id}`) || '' : ''),
    () => ''
  );

  const handleUpdateModul = (updated: ModulAjarData) => {
    if (!id) return;
    updateGeneratedModulAjar(id, updated);
    if (savedData) {
      setSavedData({
        ...savedData,
        modul: updated,
      });
    }
  };

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

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      <Navbar
        aiSettings={aiSettings}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 flex-wrap">
            <Link href="/" className="hover:text-blue-600 flex items-center gap-1">
              <Home className="w-3.5 h-3.5" />
              <span>Hub</span>
            </Link>
            <span>/</span>
            <Link href="/tools/modul-ajar" className="hover:text-blue-600">
              Generator Modul Ajar
            </Link>
            <span>/</span>
            <span className="text-blue-600 font-bold max-w-[200px] sm:max-w-xs truncate">
              {savedData?.modul?.identitas?.topikMateri || id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copiedLink ? 'Link Tersalin!' : 'Bagikan'}</span>
            </button>

            <Link
              href="/tools/modul-ajar"
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 active:bg-blue-800 transition-all flex items-center justify-center gap-1 shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Buat Baru</span>
            </Link>
          </div>
        </div>

        {/* Content View */}
        {!hasAttemptedLoad ? (
          <ModulLoadingSkeleton id={id} />
        ) : savedData?.modul ? (
          <div className="space-y-6">
            <ModulAjarPreview
              modul={savedData.modul}
              onUpdateModul={handleUpdateModul}
              shareUrl={savedData.url}
            />

            <RecentModulAjarHistory currentModulId={id} />
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-4 max-w-xl mx-auto shadow-md">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8" />
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Modul Ajar Tidak Ditemukan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Dokumen modul ajar dengan ID <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">{id}</code> tidak tersimpan di browser ini atau telah dibersihkan.
            </p>
            <div className="pt-2">
              <Link
                href="/tools/modul-ajar"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Generator Modul Ajar</span>
              </Link>
            </div>
          </div>
        )}
      </main>

      <DonateWidget />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        aiSettings={aiSettings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}
