'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { ExamForm } from '@/components/ExamForm';
import { ExamPreview } from '@/components/ExamPreview';
import { ExamData, ExamGenerationRequest, UserAISettings, AIProviderId } from '@/types/exam';
import { DEFAULT_AI_SETTINGS, AI_PROVIDERS } from '@/lib/constants';
import { Sparkles, ShieldAlert } from 'lucide-react';

function getInitialAISettings(): UserAISettings {
  if (typeof window === 'undefined') return DEFAULT_AI_SETTINGS;
  try {
    const savedSettings = localStorage.getItem('edusoal_ai_settings');
    let loaded: UserAISettings = { ...DEFAULT_AI_SETTINGS };

    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
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
        if (!availableModelIds.includes(model) && model !== 'custom' && !model.includes(':')) {
          model = prov.defaultModel;
        }

        mergedProviders[prov.id] = {
          apiKey: savedProv?.apiKey || '',
          model: model,
          customBaseUrl: savedProv?.customBaseUrl || prov.defaultBaseUrl || '',
        };
      }

      loaded = {
        activeProvider: activeProv,
        providers: mergedProviders,
      };
    } else {
      // Check for legacy single gemini key
      const legacyGeminiKey = localStorage.getItem('edusoal_gemini_api_key');
      if (legacyGeminiKey) {
        loaded.providers.gemini.apiKey = legacyGeminiKey;
      }
    }
    return loaded;
  } catch (e) {
    console.error('Failed to load/migrate saved AI settings:', e);
    return DEFAULT_AI_SETTINGS;
  }
}

export default function Home() {
  const [aiSettings, setAiSettings] = useState<UserAISettings>(getInitialAISettings);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSaveSettings = (newSettings: UserAISettings) => {
    setAiSettings(newSettings);
    try {
      localStorage.setItem('edusoal_ai_settings', JSON.stringify(newSettings));
      // Sync legacy gemini key just in case
      if (newSettings.providers.gemini?.apiKey) {
        localStorage.setItem('edusoal_gemini_api_key', newSettings.providers.gemini.apiKey);
      }
    } catch (e) {
      console.error('Failed to save AI settings:', e);
    }
  };

  const handleGenerate = async (requestData: ExamGenerationRequest) => {
    setIsLoading(true);
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

      setExamData(result.data);
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
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

        {examData ? (
          <ExamPreview
            exam={examData}
            onUpdateExam={(updated) => setExamData(updated)}
            onReset={() => setExamData(null)}
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
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 print:hidden">
        <p>EduSoal AI &copy; 2026 • Dirancang untuk Guru & Sekolah Indonesia</p>
      </footer>
    </div>
  );
}
