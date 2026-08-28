'use client';

import React from 'react';
import { BookOpen, Sparkles, Zap, Globe, HardDrive, Cpu, Bot, Settings2 } from 'lucide-react';
import { AI_PROVIDERS } from '@/lib/constants';
import { AIProviderId, UserAISettings } from '@/types/exam';

interface NavbarProps {
  aiSettings: UserAISettings;
  onOpenApiKeyModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ aiSettings, onOpenApiKeyModal }) => {
  const activeProviderId: AIProviderId = aiSettings?.activeProvider || 'gemini';
  const activeConfig = AI_PROVIDERS.find((p) => p.id === activeProviderId) || AI_PROVIDERS[0];
  const activeSetting = aiSettings?.providers?.[activeProviderId];
  
  const isConnected = !activeConfig.requiresApiKey || !!activeSetting?.apiKey;

  const getProviderIcon = (id: AIProviderId) => {
    switch (id) {
      case 'gemini':
        return <Sparkles className="w-3.5 h-3.5 text-blue-500" />;
      case 'groq':
        return <Zap className="w-3.5 h-3.5 text-amber-500" />;
      case 'openrouter':
        return <Globe className="w-3.5 h-3.5 text-purple-500" />;
      case 'ollama':
        return <HardDrive className="w-3.5 h-3.5 text-emerald-500" />;
      case 'deepseek':
        return <Cpu className="w-3.5 h-3.5 text-cyan-500" />;
      case 'openai':
        return <Bot className="w-3.5 h-3.5 text-emerald-600" />;
      case 'anthropic':
        return <Bot className="w-3.5 h-3.5 text-orange-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur shadow-xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">EduSoal AI</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                <Sparkles className="w-3 h-3 text-blue-500" />
                SD • SMP • SMA
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Generator Soal Ujian, Kisi-Kisi, & Kunci Jawaban Berbasis Multi-AI
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenApiKeyModal}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
              isConnected
                ? 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 hover:border-slate-300 shadow-2xs'
                : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 animate-pulse'
            }`}
          >
            {getProviderIcon(activeConfig.id)}
            <span className="max-w-[150px] sm:max-w-none truncate">
              {activeConfig.name} {isConnected ? `(${activeConfig.tierBadge.split(' ')[0]})` : ': Belum Terhubung'}
            </span>
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}
            />
            <Settings2 className="w-3 h-3 text-slate-400 ml-0.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
