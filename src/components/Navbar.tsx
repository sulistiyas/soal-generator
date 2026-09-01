'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Heart,
  BookText,
  ListChecks,
  GraduationCap,
  Gamepad2,
  ChevronDown,
  ArrowLeft,
  Lightbulb,
  FileSpreadsheet,
  ArrowRight,
} from 'lucide-react';
import { AI_PROVIDERS } from '@/lib/constants';
import { AIProviderId, UserAISettings } from '@/types/exam';
import { openDonationModal } from '@/lib/donation';

interface NavbarProps {
  aiSettings?: UserAISettings;
  onOpenApiKeyModal?: () => void;
  showBackToHub?: boolean;
}

const TICKER_ITEMS = [
  {
    id: 1,
    icon: Sparkles,
    badge: '6+ Alat AI Guru',
    text: 'Alat Bantu Guru Terstruktur & Lengkap',
    sub: '100% Gratis & Tanpa Login',
    tagClass: 'bg-blue-50 text-blue-700 border-blue-200',
    iconColor: 'text-blue-600',
  },
  {
    id: 2,
    icon: Zap,
    badge: 'Multi-AI Engine',
    text: 'Didukung Gemini 2.5, Groq Llama 3 & Ollama',
    sub: 'Pilihan Fleksibel & Cepat',
    tagClass: 'bg-amber-50 text-amber-700 border-amber-200',
    iconColor: 'text-amber-500',
  },
  {
    id: 3,
    icon: Layers,
    badge: 'Kurikulum Nasional',
    text: 'Standar Kurikulum Merdeka & K-13',
    sub: 'Sesuai Pedoman Kemendikbud',
    tagClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconColor: 'text-emerald-600',
  },
  {
    id: 4,
    icon: FileSpreadsheet,
    badge: 'Format Word .docx',
    text: 'Ekspor Naskah & Rubrik Otomatis ke Word',
    sub: 'Rapi & Siap Cetak Langsung',
    tagClass: 'bg-purple-50 text-purple-700 border-purple-200',
    iconColor: 'text-purple-600',
  },
];

export const Navbar: React.FC<NavbarProps> = ({
  aiSettings,
  onOpenApiKeyModal,
}) => {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [isHoveredTicker, setIsHoveredTicker] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeProviderId: AIProviderId = aiSettings?.activeProvider || 'gemini';
  const activeConfig = AI_PROVIDERS.find((p) => p.id === activeProviderId) || AI_PROVIDERS[0];
  const activeSetting = aiSettings?.providers?.[activeProviderId];
  const isConnected = !activeConfig.requiresApiKey || !!activeSetting?.apiKey;

  // Auto rotate ticker every 3.5s if not hovered
  useEffect(() => {
    if (!isHome || isHoveredTicker) return;
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % TICKER_ITEMS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [isHome, isHoveredTicker]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScrollToKatalog = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const katalogSection = document.getElementById('katalog');
    if (katalogSection) {
      katalogSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = '/#katalog';
    }
  };

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

  const currentTicker = TICKER_ITEMS[tickerIndex];
  const TickerIcon = currentTicker.icon;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md shadow-2xs print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* LEFT: Brand Logo & Subtitle */}
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  Teacher Tools <span className="text-blue-600">Hub</span>
                </span>
                <span className="hidden xs:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs">
                  <Sparkles className="w-2.5 h-2.5 text-blue-500" />
                  AI Guru 🇮🇩
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Portal Kumpulan Alat Bantu Guru Berbasis AI
              </p>
            </div>
          </Link>

          {!isHome && (
            <Link
              href="/"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors ml-2"
              title="Kembali ke Beranda Hub"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beranda Hub</span>
            </Link>
          )}
        </div>

        {/* CENTER: Dynamic Live Spotlight Ticker (on Home Page) */}
        {isHome ? (
          <div className="hidden md:flex items-center flex-1 justify-center max-w-xl mx-auto">
            {/* Live Ticker Spotlight Pill */}
            <button
              type="button"
              onClick={handleScrollToKatalog}
              onMouseEnter={() => setIsHoveredTicker(true)}
              onMouseLeave={() => setIsHoveredTicker(false)}
              className="group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-50/95 hover:bg-blue-50/90 border border-slate-200/90 hover:border-blue-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs text-left"
              title="Klik untuk melihat katalog alat bantu"
            >
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${currentTicker.tagClass}`}>
                  {currentTicker.badge}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-700 group-hover:text-blue-900 transition-colors">
                <TickerIcon className={`w-3.5 h-3.5 shrink-0 ${currentTicker.iconColor}`} />
                <span className="font-semibold text-slate-800 group-hover:text-blue-950 truncate max-w-[280px] sm:max-w-none">
                  {currentTicker.text}
                </span>
                <span className="text-[11px] text-slate-400 font-normal hidden xl:inline">
                  • {currentTicker.sub}
                </span>
              </div>
            </button>
          </div>
        ) : (
          /* On Subpages: Compact Quick Tool Switcher */
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Alat Ajar Aktif:</span>
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100/80 text-blue-700 text-xs font-bold border border-blue-200 transition-all cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  {pathname.startsWith('/tools/soal-generator') || pathname.startsWith('/generated/')
                    ? 'Generator Soal AI'
                    : pathname.startsWith('/tools/rubrik-penilaian') || pathname.startsWith('/generated/rubrik')
                    ? 'Kisi-Kisi & Rubrik'
                    : pathname.startsWith('/tools/modul-ajar') || pathname.startsWith('/generated/modul-ajar')
                    ? 'Modul Ajar & RPP'
                    : 'Pilih Alat Ajar'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in space-y-1">
                  <Link
                    href="/tools/soal-generator"
                    onClick={() => setToolsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-blue-50 text-slate-800 hover:text-blue-700 transition-colors"
                  >
                    <FileQuestion className="w-4 h-4 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-bold">Generator Soal AI</div>
                      <div className="text-[10px] text-slate-500 font-normal">PG, Essay, Kisi-kisi, DOCX</div>
                    </div>
                  </Link>
                  <Link
                    href="/tools/rubrik-penilaian"
                    onClick={() => setToolsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-blue-50 text-slate-800 hover:text-blue-700 transition-colors"
                  >
                    <ListChecks className="w-4 h-4 text-emerald-600" />
                    <div className="flex-1">
                      <div className="font-bold">Kisi-Kisi & Rubrik</div>
                      <div className="text-[10px] text-slate-500 font-normal">Matriks Asesmen & KKTP</div>
                    </div>
                  </Link>
                  <Link
                    href="/tools/modul-ajar"
                    onClick={() => setToolsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-blue-50 text-slate-800 hover:text-blue-700 transition-colors"
                  >
                    <BookText className="w-4 h-4 text-purple-600" />
                    <div className="flex-1">
                      <div className="font-bold">Modul Ajar & RPP</div>
                      <div className="text-[10px] text-slate-500 font-normal">Kurikulum Merdeka & P5</div>
                    </div>
                  </Link>
                  <div className="border-t border-slate-100 my-1 pt-1">
                    <Link
                      href="/"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <span>Lihat Semua Katalog</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RIGHT: Actions (Jelajahi Mega-Menu, Usul Alat, Dukung Kami, AI Settings) */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Jelajahi Tools Dropdown Menu (on Home Page) */}
          {isHome && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  toolsDropdownOpen
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                    : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200/90 shadow-2xs'
                }`}
              >
                <Layers className={`w-3.5 h-3.5 ${toolsDropdownOpen ? 'text-white' : 'text-blue-600'}`} />
                <span>Jelajahi Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mega Dropdown Menu */}
              {toolsDropdownOpen && (
                <div className="absolute right-0 top-full mt-2.5 w-[540px] bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-50 animate-fade-in space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 px-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                        Katalog Asisten Guru AI
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      6 Alat Bantu
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Tool 1 */}
                    <Link
                      href="/tools/soal-generator"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="p-3 rounded-2xl bg-slate-50/70 hover:bg-blue-50/80 border border-slate-200/70 hover:border-blue-300 transition-all group flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        <FileQuestion className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900 group-hover:text-blue-700 truncate">
                            Generator Soal
                          </span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800">
                            HOT 🔥
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          Naskah soal, kisi-kisi, kunci & Word .docx
                        </p>
                      </div>
                    </Link>

                    {/* Tool 2 */}
                    <Link
                      href="/tools/rubrik-penilaian"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="p-3 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200/70 hover:border-emerald-300 transition-all group flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        <ListChecks className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 truncate">
                            Kisi-Kisi & Rubrik
                          </span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800">
                            BARU ✨
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          Rubrik analitik 4 skala & KKTP
                        </p>
                      </div>
                    </Link>

                    {/* Tool 3 */}
                    <Link
                      href="/tools/modul-ajar"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="p-3 rounded-2xl bg-purple-50/70 hover:bg-purple-100/80 border border-purple-200/70 hover:border-purple-300 transition-all group flex items-start gap-3"
                    >
                      <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        <BookText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900 group-hover:text-purple-700 truncate">
                            Modul Ajar & RPP
                          </span>
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-800">
                            SIAP ⚡
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                          CP, ATP & Dimensi Profil Pancasila
                        </p>
                      </div>
                    </Link>

                    {/* Tool 4: Deskripsi Rapor */}
                    <div className="p-3 rounded-2xl bg-slate-50/40 border border-slate-200/50 flex items-start gap-3 opacity-70">
                      <div className="w-8 h-8 rounded-xl bg-slate-400 text-white flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-700 truncate">
                            Deskripsi Rapor
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600">
                            SEGERA
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          Narasi e-Rapor otomatis & positif
                        </p>
                      </div>
                    </div>

                    {/* Tool 5: Ice Breaking */}
                    <div className="p-3 rounded-2xl bg-slate-50/40 border border-slate-200/50 flex items-start gap-3 opacity-70">
                      <div className="w-8 h-8 rounded-xl bg-slate-400 text-white flex items-center justify-center shrink-0">
                        <Gamepad2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-700 truncate">
                            Ice Breaking Kelas
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600">
                            SEGERA
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          Ide game penyemangat belajar
                        </p>
                      </div>
                    </div>

                    {/* Tool 6: LKPD */}
                    <div className="p-3 rounded-2xl bg-slate-50/40 border border-slate-200/50 flex items-start gap-3 opacity-70">
                      <div className="w-8 h-8 rounded-xl bg-slate-400 text-white flex items-center justify-center shrink-0">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-700 truncate">
                            Penyusun LKPD
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600">
                            SEGERA
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          Lembar kerja aktivitas siswa
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Footer Links */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs px-1">
                    <a
                      href="#aspirasi"
                      onClick={() => setToolsDropdownOpen(false)}
                      className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold hover:underline"
                    >
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                      <span>Usul Ide Alat Baru</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        setToolsDropdownOpen(false);
                        openDonationModal();
                      }}
                      className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900 font-bold hover:underline cursor-pointer"
                    >
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>Traktir Kopi / Donasi</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick "Usul Alat" Pill (on Home Page) */}
          {isHome && (
            <a
              href="#aspirasi"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/90 hover:bg-amber-100/90 text-amber-800 border border-amber-200/80 text-xs font-semibold transition-all shadow-2xs"
              title="Kirim saran atau ide alat baru"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>Usul Alat</span>
            </a>
          )}

          {/* Dukung Kami Glow Button */}
          <button
            type="button"
            onClick={() => openDonationModal()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-xs font-bold shadow-xs hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer group"
            title="Dukung Pengembangan Teacher Tools Hub"
          >
            <Heart className="w-3.5 h-3.5 fill-white/90 group-hover:scale-110 transition-transform" />
            <span className="hidden xs:inline">Dukung Kami</span>
          </button>

          {/* AI Settings / Model Status Button */}
          {onOpenApiKeyModal && (
            <button
              type="button"
              onClick={onOpenApiKeyModal}
              title="Konfigurasi Model & API Key AI"
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                isConnected
                  ? 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100 hover:border-slate-300 shadow-2xs'
                  : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 animate-pulse'
              }`}
            >
              {getProviderIcon(activeConfig.id)}
              <span className="hidden sm:inline-block max-w-[110px] truncate font-medium">
                {activeConfig.name}
              </span>
              <span
                className={`w-2 h-2 rounded-full shrink-0 ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}
              />
              <Settings2 className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
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

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3.5 space-y-3.5 animate-fade-in shadow-xl">
          {/* Tools List */}
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1">
              Daftar Alat Bantu AI Guru
            </div>

            <Link
              href="/tools/soal-generator"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileQuestion className="w-4 h-4 text-blue-600" />
                <span>Generator Soal AI & Kisi-Kisi</span>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Populer
              </span>
            </Link>

            <Link
              href="/tools/rubrik-penilaian"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ListChecks className="w-4 h-4 text-emerald-600" />
                <span>Kisi-Kisi & Rubrik Penilaian</span>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Baru
              </span>
            </Link>

            <Link
              href="/tools/modul-ajar"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 hover:bg-purple-50 hover:text-purple-700 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <BookText className="w-4 h-4 text-purple-600" />
                <span>Generator Modul Ajar & RPP</span>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                Siap
              </span>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
            <a
              href="#aspirasi"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>Usul Alat Baru</span>
            </a>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openDonationModal();
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>Dukung Kami</span>
            </button>
          </div>

          {/* AI Settings Config */}
          {onOpenApiKeyModal && (
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenApiKeyModal();
                }}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 flex items-center justify-between transition-colors cursor-pointer text-slate-800"
              >
                <div className="flex items-center gap-2">
                  {getProviderIcon(activeConfig.id)}
                  <span>Model AI: <strong>{activeConfig.name}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <Settings2 className="w-4 h-4 text-slate-400" />
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
