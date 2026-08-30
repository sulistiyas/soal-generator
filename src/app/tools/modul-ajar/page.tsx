'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { ModulAjarForm } from '@/components/modul-ajar/ModulAjarForm';
import { ModulAjarPreview } from '@/components/modul-ajar/ModulAjarPreview';
import { RecentModulAjarHistory } from '@/components/modul-ajar/RecentModulAjarHistory';
import { ModulAjarGeneratingModal } from '@/components/modul-ajar/ModulAjarGeneratingModal';
import { DonateWidget } from '@/components/DonateWidget';
import { ModulAjarData, ModulAjarGenerationRequest } from '@/types/modul-ajar';
import { UserAISettings, AIProviderId } from '@/types/exam';
import { DEFAULT_AI_SETTINGS, AI_PROVIDERS } from '@/lib/constants';
import { saveGeneratedModulAjar, updateGeneratedModulAjar } from '@/lib/modul-ajar-storage';
import { trackEvent } from '@/lib/analytics';
import {
  Sparkles,
  BookOpen,
  ArrowLeft,
  Share2,
  Check,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Award,
  Layers,
  HelpCircle,
} from 'lucide-react';

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

export default function ModulAjarToolPage() {
  const storedJson = useSyncExternalStore(
    subscribeToAISettings,
    getAISettingsSnapshot,
    getAISettingsServerSnapshot
  );

  const aiSettings = useMemo(() => parseStoredSettings(storedJson), [storedJson]);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRequest, setActiveRequest] = useState<ModulAjarGenerationRequest | null>(null);
  const [modulData, setModulData] = useState<ModulAjarData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<{
    id: string;
    classSlug: string;
    url: string;
    title: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

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

  const handleGenerate = async (requestData: ModulAjarGenerationRequest) => {
    setIsLoading(true);
    setActiveRequest(requestData);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-modul-ajar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal generate modul ajar');
      }

      const generatedData: ModulAjarData = result.data;
      setModulData(generatedData);

      // Track event analytics
      trackEvent('generate_modul_ajar', {
        subject: requestData.subject,
        grade: requestData.grade,
        format: requestData.format,
        provider: requestData.aiProvider || 'gemini',
      });

      // Save to localStorage
      const savedInfo = saveGeneratedModulAjar(generatedData, requestData);
      setLastGenerated({
        id: savedInfo.id,
        classSlug: savedInfo.classSlug,
        url: savedInfo.url,
        title: generatedData.identitas?.topikMateri || requestData.topic,
      });

      // Automatically open in a new tab if supported
      if (typeof window !== 'undefined') {
        const newTab = window.open(savedInfo.url, '_blank');
        if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
          console.warn('Popup was blocked by browser, user can click banner button');
        }
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat menghubungi server.';
      setErrorMessage(msg);

      const activeProvider = AI_PROVIDERS.find((p) => p.id === aiSettings.activeProvider);
      const activeProviderSetting = aiSettings.providers[aiSettings.activeProvider];
      if (activeProvider?.requiresApiKey && !activeProviderSetting?.apiKey) {
        setIsApiKeyModalOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateModul = (updated: ModulAjarData) => {
    setModulData(updated);
    if (lastGenerated?.id) {
      updateGeneratedModulAjar(lastGenerated.id, updated);
    }
  };

  const handleCopyShareLink = () => {
    if (!lastGenerated) return;
    const fullUrl = `${window.location.origin}${lastGenerated.url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header Navigation */}
      <Navbar
        aiSettings={aiSettings}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb & Navigation Back */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-blue-600 flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda Hub</span>
            </Link>
            <span>/</span>
            <span className="text-slate-400">Administrasi Guru</span>
            <span>/</span>
            <span className="text-blue-600 font-bold">Generator Modul Ajar & RPP</span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs text-slate-500">Butuh buat naskah soal ujian?</span>
            <Link
              href="/tools/soal-generator"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 underline"
            >
              Buka Generator Soal AI
            </Link>
          </div>
        </div>

        {/* Error notification banner */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3 animate-shake">
            <div className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
              !
            </div>
            <div className="flex-1">
              <strong className="block font-bold mb-0.5">Pembuatan Modul Ajar Gagal</strong>
              <p>{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700 font-bold text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Success / Last Generated Banner */}
        {lastGenerated && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-5 rounded-3xl shadow-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider block">
                  Modul Ajar Berhasil Dibuat & Disimpan!
                </span>
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  {lastGenerated.title}
                </h3>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 active:bg-white/40 text-white text-xs font-semibold backdrop-blur border border-white/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Link Tersalin!' : 'Salin Link'}</span>
              </button>

              <Link
                href={lastGenerated.url}
                target="_blank"
                className="min-h-[40px] px-4 py-2 rounded-xl bg-white text-emerald-800 hover:bg-emerald-50 active:bg-emerald-100 text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <span>Buka di Tab Baru</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* MAIN FORM */}
        <ModulAjarForm
          onSubmit={handleGenerate}
          isLoading={isLoading}
          aiSettings={aiSettings}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        />

        {/* LIVE PREVIEW IF GENERATED */}
        {modulData && (
          <div className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-extrabold text-slate-900">
                  Hasil Modul Ajar AI
                </h2>
              </div>
              <span className="text-xs text-slate-500">
                Siap diedit, dicetak, atau diekspor ke Microsoft Word
              </span>
            </div>

            <ModulAjarPreview
              modul={modulData}
              onUpdateModul={handleUpdateModul}
              shareUrl={lastGenerated?.url}
            />
          </div>
        )}

        {/* RECENT HISTORY SECTION */}
        <RecentModulAjarHistory currentModulId={lastGenerated?.id} />

        {/* EDUKASI & FAQ KURIKULUM MERDEKA */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Panduan Modul Ajar Kurikulum Merdeka & RPP 1 Lembar
              </h3>
              <p className="text-xs text-slate-500">
                Komponen esensial sesuai Panduan Pembelajaran dan Asesmen (PPA) Kemendikbudristek
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 leading-relaxed">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                1. Komponen Lengkap & Ringkas
              </h4>
              <p>
                Modul ajar memuat Informasi Umum, Capaian & Tujuan Pembelajaran (TP), Pemahaman Bermakna, Pertanyaan Pemantik, Kegiatan Pembelajaran Berdiferensiasi, Asesmen, dan Lampiran LKPD.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600" />
                2. Berdiferensiasi & Berpusat pada Murid
              </h4>
              <p>
                Kegiatan inti disusun dengan model pembelajaran aktif (PBL, PjBL, Discovery) serta memuat diferensiasi konten, proses, dan produk guna memfasilitasi keragaman gaya belajar siswa.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                3. Rubrik & Tindak Lanjut KKTP
              </h4>
              <p>
                Dilengkapi dengan tabel rubrik penilaian autentik dan skala interval Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) untuk menentukan intervensi remedial maupun pengayaan.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Donate Widget */}
      <DonateWidget />

      {/* AI Key & Model Settings Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        aiSettings={aiSettings}
        onSaveSettings={handleSaveSettings}
      />

      {/* Generating Loading Modal */}
      <ModulAjarGeneratingModal
        isOpen={isLoading}
        requestData={activeRequest}
      />
    </div>
  );
}
