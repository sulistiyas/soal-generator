'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  Globe,
  HardDrive,
  Cpu,
  Bot,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { AI_PROVIDERS, DEFAULT_AI_SETTINGS } from '@/lib/constants';
import { AIProviderId, UserAISettings } from '@/types/exam';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiSettings: UserAISettings;
  onSaveSettings: (newSettings: UserAISettings) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  aiSettings,
  onSaveSettings,
}) => {
  const [activeTab, setActiveTab] = useState<AIProviderId>(aiSettings.activeProvider || 'gemini');
  const [currentSettings, setCurrentSettings] = useState<UserAISettings>(aiSettings);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setCurrentSettings(aiSettings);
    setActiveTab(aiSettings.activeProvider || 'gemini');
  }, [aiSettings, isOpen]);

  if (!isOpen) return null;

  const activeConfig = AI_PROVIDERS.find((p) => p.id === activeTab) || AI_PROVIDERS[0];
  const activeProviderSettings = currentSettings.providers[activeTab] || {
    apiKey: '',
    model: activeConfig.defaultModel,
    customBaseUrl: activeConfig.defaultBaseUrl || '',
  };

  const handleApiKeyChange = (val: string) => {
    setCurrentSettings((prev) => ({
      ...prev,
      providers: {
        ...prev.providers,
        [activeTab]: {
          ...prev.providers[activeTab],
          apiKey: val,
        },
      },
    }));
  };

  const handleModelChange = (modelId: string) => {
    setCurrentSettings((prev) => ({
      ...prev,
      providers: {
        ...prev.providers,
        [activeTab]: {
          ...prev.providers[activeTab],
          model: modelId,
        },
      },
    }));
  };

  const handleBaseUrlChange = (url: string) => {
    setCurrentSettings((prev) => ({
      ...prev,
      providers: {
        ...prev.providers,
        [activeTab]: {
          ...prev.providers[activeTab],
          customBaseUrl: url,
        },
      },
    }));
  };

  const handleSetActiveProvider = (providerId: AIProviderId) => {
    setActiveTab(providerId);
    setCurrentSettings((prev) => ({
      ...prev,
      activeProvider: providerId,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(currentSettings);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const getProviderIcon = (id: AIProviderId) => {
    switch (id) {
      case 'gemini':
        return <Sparkles className="w-4 h-4 text-blue-500" />;
      case 'groq':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'openrouter':
        return <Globe className="w-4 h-4 text-purple-500" />;
      case 'ollama':
        return <HardDrive className="w-4 h-4 text-emerald-500" />;
      case 'deepseek':
        return <Cpu className="w-4 h-4 text-cyan-500" />;
      case 'openai':
        return <Bot className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base text-slate-900">Pengaturan AI & Multi-Provider</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                Pilih AI Sesuai Kebutuhan
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Utamakan opsi <strong>Gratis</strong> (Google Gemini, Groq, OpenRouter, atau Ollama Offline).
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Provider Tabs / Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Pilih Provider AI yang Ingin Digunakan:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AI_PROVIDERS.map((provider) => {
                const isSelected = activeTab === provider.id;
                const isCurrentActive = currentSettings.activeProvider === provider.id;

                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => handleSetActiveProvider(provider.id)}
                    className={`p-2.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                        {getProviderIcon(provider.id)}
                        <span className="truncate">{provider.name}</span>
                      </div>
                      {isCurrentActive && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200 shrink-0" title="Provider Aktif" />
                      )}
                    </div>
                    <div className="text-[10px] font-medium text-slate-500">
                      {provider.tierBadge}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Provider Config Box */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/40 p-4 sm:p-5 space-y-4">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-white shadow-xs border border-slate-200">
                  {getProviderIcon(activeConfig.id)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">{activeConfig.name}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {activeConfig.tierBadge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{activeConfig.tagline}</p>
                </div>
              </div>

              {currentSettings.activeProvider !== activeConfig.id && (
                <button
                  type="button"
                  onClick={() => handleSetActiveProvider(activeConfig.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-xl transition-colors shrink-0 cursor-pointer"
                >
                  Jadikan AI Utama
                </button>
              )}
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pilih Model AI
              </label>
              <select
                value={activeProviderSettings.model || activeConfig.defaultModel}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white font-medium"
              >
                {activeConfig.availableModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.badge ? `[${m.badge}]` : ''} - {m.description}
                  </option>
                ))}
              </select>
            </div>

            {/* API Key or Endpoint Input */}
            {activeConfig.requiresApiKey ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>API Key {activeConfig.name}</span>
                  {activeProviderSettings.apiKey && (
                    <span className="text-[11px] text-emerald-600 font-normal flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Tersimpan di Browser
                    </span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={activeProviderSettings.apiKey || ''}
                    onChange={(e) => handleApiKeyChange(e.target.value)}
                    placeholder={activeConfig.apiKeyPlaceholder || 'Masukkan API Key...'}
                    className="w-full px-3.5 py-2.5 pr-10 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  URL Endpoint Ollama (Localhost)
                </label>
                <input
                  type="text"
                  value={activeProviderSettings.customBaseUrl || activeConfig.defaultBaseUrl || ''}
                  onChange={(e) => handleBaseUrlChange(e.target.value)}
                  placeholder="http://localhost:11434/v1"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono bg-white"
                />
                <p className="mt-1 text-[11px] text-slate-500">
                  Tidak memerlukan API Key. Pastikan Ollama sudah berjalan di laptop/komputer Anda.
                </p>
              </div>
            )}

            {/* Step by step guide box */}
            {activeConfig.apiKeyHelpSteps && (
              <div className="rounded-xl bg-blue-50/70 border border-blue-200/70 p-3.5 space-y-2 text-xs text-blue-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-semibold text-blue-950">
                    <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{activeConfig.apiKeyHelpTitle}</span>
                  </div>
                  {activeConfig.apiKeyHelpUrl && (
                    <a
                      href={activeConfig.apiKeyHelpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium underline inline-flex items-center gap-0.5 text-blue-700 hover:text-blue-900"
                    >
                      Buka Web <ExternalLink className="w-3 h-3 inline" />
                    </a>
                  )}
                </div>
                <ol className="list-decimal list-inside space-y-1 text-blue-800/90 pl-1">
                  {activeConfig.apiKeyHelpSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Provider Aktif:{' '}
            <strong className="text-slate-800">
              {AI_PROVIDERS.find((p) => p.id === currentSettings.activeProvider)?.name}
            </strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <span>Simpan Pengaturan</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
