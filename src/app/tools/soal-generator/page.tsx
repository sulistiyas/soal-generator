'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { ExamForm } from '@/components/ExamForm';
import { ExamPreview } from '@/components/ExamPreview';
import { GeneratingModal } from '@/components/GeneratingModal';
import { RecentExamsHistory } from '@/components/RecentExamsHistory';
import { DonateWidget } from '@/components/DonateWidget';
import { ExamData, ExamGenerationRequest, UserAISettings, AIProviderId } from '@/types/exam';
import { DEFAULT_AI_SETTINGS, AI_PROVIDERS } from '@/lib/constants';
import { saveGeneratedExam } from '@/lib/exam-storage';
import { trackEvent } from '@/lib/analytics';
import {
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  Share2,
  Check,
  ArrowLeft,
  LayoutGrid,
  FileQuestion,
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

export default function SoalGeneratorToolPage() {
  const storedJson = useSyncExternalStore(
    subscribeToAISettings,
    getAISettingsSnapshot,
    getAISettingsServerSnapshot
  );

  const aiSettings = useMemo(() => parseStoredSettings(storedJson), [storedJson]);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRequest, setActiveRequest] = useState<ExamGenerationRequest | null>(null);
  const [examData, setExamData] = useState<ExamData | null>(null);
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

  const handleGenerate = async (requestData: ExamGenerationRequest) => {
    setIsLoading(true);
    setActiveRequest(requestData);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal generate soal');
      }

      const generatedData: ExamData = result.data;
      setExamData(generatedData);

      // Track event di Google Analytics
      trackEvent('generate_exam', {
        subject: requestData.subject,
        grade: requestData.grade,
        curriculum: requestData.curriculum,
        pg_count: requestData.pgCount,
        essay_count: requestData.essayCount,
        provider: requestData.aiProvider || 'gemini',
      });

      // Save to localStorage and get unique URL
      const savedInfo = saveGeneratedExam(generatedData, requestData);
      setLastGenerated({
        id: savedInfo.id,
        classSlug: savedInfo.classSlug,
        url: savedInfo.url,
        title: generatedData.examTitle || `${generatedData.subject} - ${generatedData.grade}`,
      });

      // Automatically open in a new tab
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

  const handleCopyLink = () => {
    if (!lastGenerated || typeof window === 'undefined') return;
    const fullUrl = `${window.location.origin}${lastGenerated.url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLink(true);
    trackEvent('share_exam_link', {
      exam_id: lastGenerated.id,
    });
    setTimeout(() => setCopiedLink(false), 2500);
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

      <GeneratingModal
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
                <FileQuestion className="w-3.5 h-3.5 text-blue-600" />
                Generator Soal AI
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
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">Gagal Membuat Soal:</span>
              <span>{errorMessage}</span>
            </div>
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
                    🎉 Paket Soal Berhasil Digenerate & Dibuka di Tab Baru!
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
                onClick={handleCopyLink}
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

        {examData ? (
          <ExamPreview
            exam={examData}
            onUpdateExam={(updated) => setExamData(updated)}
            onReset={() => {
              setExamData(null);
              setLastGenerated(null);
            }}
          />
        ) : (
          <div className="space-y-6">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-semibold text-blue-100">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Kurikulum Merdeka & Kurikulum 2013 • Multi-AI Engine
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Buat Paket Soal Ujian & Kisi-Kisi Sekolah dalam Hitungan Detik.
                </h1>
                <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                  Pilih AI gratis favorit Anda (Gemini, Groq, OpenRouter, atau Ollama Offline). Lengkap dengan level kognitif (LOTS/HOTS), kunci jawaban, rubrik, dan ekspor langsung ke <strong>Microsoft Word (.docx)</strong>.
                </p>
              </div>

              {/* Decorative Circle */}
              <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* Form Input */}
            <ExamForm
              onGenerate={handleGenerate}
              isLoading={isLoading}
              aiSettings={aiSettings}
              onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
            />

            {/* Recent Exams History */}
            <RecentExamsHistory />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 print:hidden">
        <p>Teacher Tools Hub • EduSoal AI &copy; 2026 • Dirancang untuk Guru & Sekolah Indonesia</p>
      </footer>

      {/* Floating Donate Widget & Modal */}
      <DonateWidget />
    </div>
  );
}
