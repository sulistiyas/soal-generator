'use client';

import React, { useState, useMemo, useSyncExternalStore, Suspense } from 'react';
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
  LayoutGrid,
  FileText,
  ShieldAlert,
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
    if (!lastGenerated || typeof window === 'undefined') return;
    const fullUrl = `${window.location.origin}${lastGenerated.url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    trackEvent('share_modul_ajar_link', {
      modul_id: lastGenerated.id,
    });
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header Navigation */}
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

      <ModulAjarGeneratingModal
        isOpen={isLoading}
        requestData={activeRequest}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Breadcrumb & Return to Hub Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Portal Tools</span>
            </Link>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1 text-slate-500 font-medium">
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Teacher Tools Hub</span>
              <span>/</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                Generator Modul Ajar & RPP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Tool Aktif & Siap Pakai
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm flex items-start gap-3 shadow-xs animate-shake">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">Gagal Membuat Modul Ajar:</span>
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-700 font-bold text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Success Alert with New Tab Link */}
        {lastGenerated && !isLoading && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-emerald-950">
                    🎉 Modul Ajar Berhasil Digenerate & Dibuka di Tab Baru!
                  </span>
                  <span className="font-mono text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                    ID: {lastGenerated.id}
                  </span>
                </div>
                <p className="text-xs text-emerald-800">
                  {lastGenerated.title} • Link:{' '}
                  <code className="font-mono text-emerald-900 font-semibold">{lastGenerated.url}</code>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-emerald-100/60 active:bg-emerald-200/60 text-emerald-900 border border-emerald-300 transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Link Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Salin Link</span>
                  </>
                )}
              </button>

              <a
                href={lastGenerated.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[40px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-xs hover:shadow transition-all"
              >
                <span>Buka di Tab Baru</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {modulData ? (
          <ModulAjarPreview
            modul={modulData}
            onUpdateModul={handleUpdateModul}
            onReset={() => {
              setModulData(null);
              setLastGenerated(null);
            }}
            shareUrl={lastGenerated?.url}
          />
        ) : (
          <div className="space-y-6">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold text-blue-100">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Kurikulum Merdeka & K-13 • PPA Kemendikbudristek
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Susun Modul Ajar & RPP Resmi Sekolah dalam Hitungan Detik.
                </h1>
                <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                  Pilih model pembelajaran (PBL, PjBL, Discovery), profil P5, dan diferensiasi kelas. Lengkap dengan sintaks mengajar, rubrik KKTP, LKPD siswa, dan ekspor langsung ke <strong>Microsoft Word (.docx)</strong>.
                </p>
              </div>

              {/* Decorative Circle */}
              <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* Main Form */}
            <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">Memuat formulir generator modul ajar...</div>}>
              <ModulAjarForm
                onSubmit={handleGenerate}
                isLoading={isLoading}
                aiSettings={aiSettings}
                onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
              />
            </Suspense>

            {/* Recent History Section */}
            <RecentModulAjarHistory currentModulId={lastGenerated?.id} />

            {/* Edukasi & FAQ Kurikulum Merdeka */}
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
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 print:hidden">
        <p>Teacher Tools Hub • EduSoal AI &copy; 2026 • Dirancang untuk Guru & Sekolah Indonesia</p>
      </footer>

      {/* Floating Donate Widget */}
      <DonateWidget />
    </div>
  );
}
