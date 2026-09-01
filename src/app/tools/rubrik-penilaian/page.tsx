'use client';

import React, { useState, useMemo, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { RubrikForm } from '@/components/rubrik/RubrikForm';
import { RubrikPreview } from '@/components/rubrik/RubrikPreview';
import { RecentRubrikHistory } from '@/components/rubrik/RecentRubrikHistory';
import { RubrikGeneratingModal } from '@/components/rubrik/RubrikGeneratingModal';
import { DonateWidget } from '@/components/DonateWidget';
import { KisiKisiRubrikData, KisiKisiRubrikGenerationRequest } from '@/types/rubrik';
import { UserAISettings, AIProviderId } from '@/types/exam';
import { DEFAULT_AI_SETTINGS, AI_PROVIDERS } from '@/lib/constants';
import { saveGeneratedRubrik } from '@/lib/rubrik-storage';
import { trackEvent } from '@/lib/analytics';
import {
  Sparkles,
  ListChecks,
  ArrowLeft,
  Share2,
  Check,
  ExternalLink,
  Award,
  BookOpen,
  FileSpreadsheet,
  CheckCircle2,
  ShieldCheck,
  Layers,
  HelpCircle,
  Clock,
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

export default function RubrikToolPage() {
  const storedJson = useSyncExternalStore(
    subscribeToAISettings,
    getAISettingsSnapshot,
    getAISettingsServerSnapshot
  );

  const aiSettings = useMemo(() => parseStoredSettings(storedJson), [storedJson]);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeRequest, setActiveRequest] = useState<KisiKisiRubrikGenerationRequest | null>(null);
  const [rubrikData, setRubrikData] = useState<KisiKisiRubrikData | null>(null);
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

  const handleGenerate = async (requestData: KisiKisiRubrikGenerationRequest) => {
    setIsLoading(true);
    setActiveRequest(requestData);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-rubrik', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal membuat kisi-kisi dan rubrik penilaian');
      }

      const generatedData: KisiKisiRubrikData = result.data;
      setRubrikData(generatedData);

      // Track event analytics
      trackEvent('generate_rubrik', {
        subject: requestData.subject,
        grade: requestData.grade,
        assessment_type: requestData.assessmentType,
        provider: requestData.aiProvider,
      });

      // Save to local storage history
      const saved = saveGeneratedRubrik(generatedData);
      const permalink = `/generated/rubrik/${saved.classSlug}/${saved.id}`;
      setLastGenerated({
        id: saved.id,
        classSlug: saved.classSlug,
        url: permalink,
        title: saved.title,
      });

      // Smooth scroll to top of preview
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      console.error('Generate Rubrik Error:', err);
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan saat memproses permintaan AI.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyShareLink = () => {
    if (!lastGenerated) return;
    const fullUrl = `${window.location.origin}${lastGenerated.url}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar
        aiSettings={aiSettings}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Beranda Hub</span>
          </Link>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Evaluasi & Ujian
          </span>
        </div>

        {/* Hero Header */}
        {!rubrikData && (
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-bold shadow-2xs">
              <ListChecks className="w-4 h-4 text-blue-600" />
              <span>Standar BSKAP & Kemendikbudristek</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Pembuat <span className="text-blue-600">Kisi-Kisi Soal</span> & <span className="text-indigo-600">Rubrik Penilaian AI</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Rancang matriks kisi-kisi soal (ABCD), rubrik analitik 4 skala capaian, pedoman penskoran uraian, interval KKTP, dan ekspor langsung ke <strong>Microsoft Word (.docx)</strong> rapi siap cetak.
            </p>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3 shadow-xs">
            <div className="w-5 h-5 rounded-full bg-red-200 text-red-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
              !
            </div>
            <div className="flex-1">
              <strong className="font-bold block">Gagal Membuat Kisi-Kisi & Rubrik:</strong>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Share Link Banner when generated */}
        {rubrikData && lastGenerated && (
          <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base">Kisi-Kisi & Rubrik Penilaian Berhasil Disusun!</h3>
                <p className="text-xs text-blue-100">
                  Tersimpan di peramban Anda. Anda dapat membuka atau membagikan tautan dokumen ini kapan saja.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyShareLink}
                className="px-3.5 py-2 rounded-xl bg-white text-blue-900 text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? 'Link Tersalin!' : 'Salin Link Unik'}</span>
              </button>
              <Link
                href={lastGenerated.url}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
                title="Buka Halaman Dokumen"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Main Content: Form or Preview */}
        {rubrikData ? (
          <RubrikPreview
            data={rubrikData}
            onReset={() => setRubrikData(null)}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <RubrikForm
                onSubmit={handleGenerate}
                isLoading={isLoading}
                aiSettings={aiSettings}
                onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
              />
            </div>

            {/* Sidebar Cards */}
            <div className="space-y-6">
              {/* History Card */}
              <RecentRubrikHistory
                onSelect={(item) => {
                  setRubrikData(item.data);
                  setLastGenerated({
                    id: item.id,
                    classSlug: item.classSlug,
                    url: `/generated/rubrik/${item.classSlug}/${item.id}`,
                    title: item.title,
                  });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              {/* Educational Card: Kaidah ABCD */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50/60 rounded-3xl p-6 border border-blue-100/90 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5 text-blue-900 font-bold text-sm">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">
                    <ListChecks className="w-4 h-4" />
                  </div>
                  <span>Kaidah Indikator Soal (ABCD)</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <strong className="text-blue-700 w-5">A:</strong>
                    <span><strong>Audience</strong> — Peserta didik / siswa sebagai subjek evaluasi.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <strong className="text-blue-700 w-5">B:</strong>
                    <span><strong>Behavior</strong> — Kata Kerja Operasional (KKO) yang terukur.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <strong className="text-blue-700 w-5">C:</strong>
                    <span><strong>Condition</strong> — Stimulus, teks bacaan, tabel, atau kasus.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <strong className="text-blue-700 w-5">D:</strong>
                    <span><strong>Degree</strong> — Tingkat ketepatan atau standar keberhasilan.</span>
                  </li>
                </ul>
              </div>

              {/* Educational Card: 4 Skala Rubrik Analitik */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span>Kategori Rubrik yang Dihasilkan</span>
                </div>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <strong className="text-slate-800 block mb-0.5">1. Matriks Kisi-Kisi Soal</strong>
                    <span>Distribusi nomor soal, level kognitif C1-C6, dan bentuk tes.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <strong className="text-slate-800 block mb-0.5">2. Rubrik Analitik 4 Skala</strong>
                    <span>Sangat Baik (4), Baik (3), Cukup (2), Perlu Bimbingan (1).</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <strong className="text-slate-800 block mb-0.5">3. Pedoman Penskoran Uraian</strong>
                    <span>Kunci jawaban dan rincian poin tiap langkah penyelesaian.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <strong className="text-slate-800 block mb-0.5">4. Interval KKTP & Remedial</strong>
                    <span>Rentang persentase nilai dan tindak lanjut pembelajaran.</span>
                  </div>
                </div>
              </div>

              {/* Saweria Donate Widget */}
              <DonateWidget />
            </div>
          </div>
        )}
      </main>

      {/* Generating Progress Modal */}
      <RubrikGeneratingModal
        isOpen={isLoading}
        request={activeRequest}
      />

      {/* AI Key & Settings Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        aiSettings={aiSettings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}
