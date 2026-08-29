'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sparkles,
  Zap,
  Globe,
  HardDrive,
  Cpu,
  Bot,
  Settings2,
  Menu,
  X,
  FileQuestion,
  Layers,
  HeartHandshake,
} from 'lucide-react';
import { AI_PROVIDERS } from '@/lib/constants';
import { AIProviderId, UserAISettings } from '@/types/exam';
import { openDonationModal } from '@/lib/donation';

interface NavbarProps {
  aiSettings?: UserAISettings;
  onOpenApiKeyModal?: () => void;
  showBackToHub?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  aiSettings,
  onOpenApiKeyModal,
}) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navLinks = [
    { href: '/', label: 'Beranda Hub', active: pathname === '/' },
    { href: '/#katalog', label: 'Katalog Tools', active: false },
    { href: '/tools/soal-generator', label: 'Generator Soal AI', active: pathname.startsWith('/tools/soal-generator') },
    { href: '/#aspirasi', label: 'Request Tool', active: false },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-2xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  Teacher Tools <span className="text-blue-600">Hub</span>
                </span>
                <span className="hidden xs:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                  AI Guru
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Portal Kumpulan Alat Bantu Guru Berbasis AI
              </p>
            </div>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                link.active
                  ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200/70 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions (AI Settings & Mobile Menu Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenApiKeyModal && (
            <button
              type="button"
              onClick={onOpenApiKeyModal}
              title="Konfigurasi Model & API Key AI"
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                isConnected
                  ? 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 hover:border-slate-300 shadow-2xs'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 animate-pulse'
              }`}
            >
              {getProviderIcon(activeConfig.id)}
              <span className="hidden sm:inline-block max-w-[130px] truncate">
                {activeConfig.name} {isConnected ? `(${activeConfig.tierBadge.split(' ')[0]})` : ''}
              </span>
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}
              />
              <Settings2 className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}

          {/* Quick link button to tool when on home, or back to hub when on tool */}
          {pathname === '/' ? (
            <Link
              href="/tools/soal-generator"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all"
            >
              <FileQuestion className="w-3.5 h-3.5" />
              <span>Buka Generator Soal</span>
            </Link>
          ) : (
            <Link
              href="/"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all border border-slate-200"
            >
              <span>Semua Tools</span>
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white/98 px-4 py-3 space-y-2 animate-fade-in shadow-lg">
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                  link.active
                    ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              Portal Guru Cerdas Indonesia
            </span>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openDonationModal();
              }}
              className="text-amber-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <HeartHandshake className="w-3 h-3" />
              <span>Dukung Kami</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
