'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { DonateWidget } from '@/components/DonateWidget';
import { TEACHER_TOOLS, CATEGORIES } from '@/data/tools';
import { TeacherTool, ToolCategory } from '@/types/tool';
import { openDonationModal } from '@/lib/donation';
import {
  Sparkles,
  FileQuestion,
  BookText,
  ListChecks,
  GraduationCap,
  Gamepad2,
  Layers,
  ArrowRight,
  Search,
  CheckCircle2,
  Clock,
  Zap,
  ShieldCheck,
  FileSpreadsheet,
  Heart,
  Send,
  MessageSquarePlus,
  HelpCircle,
  Users,
  Check,
  X,
  Bot,
  Compass,
} from 'lucide-react';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Aspirasi / Tool Request Form State
  const [requestName, setRequestName] = useState('');
  const [requestRole, setRequestRole] = useState('');
  const [requestToolIdea, setRequestToolIdea] = useState('');
  const [requestDescription, setRequestDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Filter tools based on category and search query
  const filteredTools = useMemo(() => {
    return TEACHER_TOOLS.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'all' || tool.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        tool.categoryLabel.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<ToolCategory, number> = {
      all: TEACHER_TOOLS.length,
      evaluasi: 0,
      administrasi: 0,
      kreatif: 0,
    };
    TEACHER_TOOLS.forEach((tool) => {
      if (counts[tool.category] !== undefined) {
        counts[tool.category]++;
      }
    });
    return counts;
  }, []);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestToolIdea.trim()) return;

    try {
      const existing = localStorage.getItem('edusoal_teacher_requests');
      const requests = existing ? JSON.parse(existing) : [];
      requests.push({
        id: Date.now().toString(),
        name: requestName || 'Bapak/Ibu Guru',
        role: requestRole || 'Guru',
        toolIdea: requestToolIdea,
        description: requestDescription,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('edusoal_teacher_requests', JSON.stringify(requests));
    } catch (err) {
      console.warn('Storage not accessible for feedback submission', err);
    }

    setIsSubmitted(true);
    setRequestName('');
    setRequestRole('');
    setRequestToolIdea('');
    setRequestDescription('');
  };

  const renderToolIcon = (iconName: string, className = 'w-6 h-6') => {
    switch (iconName) {
      case 'FileQuestion':
        return <FileQuestion className={className} />;
      case 'BookText':
        return <BookText className={className} />;
      case 'ListChecks':
        return <ListChecks className={className} />;
      case 'GraduationCap':
        return <GraduationCap className={className} />;
      case 'Gamepad2':
        return <Gamepad2 className={className} />;
      case 'Layers':
        return <Layers className={className} />;
      default:
        return <Bot className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Header Navigation */}
      <Navbar />

      <main className="flex-1 w-full space-y-16 pb-20">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-900 via-indigo-900 to-slate-900 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-indigo-800/50">
          {/* Subtle Ambient Light Gradients */}
          <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-10 translate-y-1/3 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-5xl mx-auto text-center space-y-6">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-blue-200 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Portal Alat Bantu Cerdas & Praktis untuk Guru Indonesia</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              Satu Portal untuk Segala Kebutuhan <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-200">
                Administrasi & Asesmen Guru AI
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="max-w-3xl mx-auto text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-normal">
              Otomatisasi pembuatan naskah soal ujian, kisi-kisi, modul ajar, rubrik asesmen, dan ide pembelajaran interaktif. Hemat waktu administrasi hingga <strong>80%</strong> agar Anda bisa lebih fokus mendampingi murid bertumbuh.
            </p>

            {/* Quick Badges / Feature Counters */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-blue-100">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/15">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>6+ Alat Bantu Terstruktur</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/15">
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Multi-AI (Gemini, Groq, Ollama)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/15">
                <ShieldCheck className="w-4 h-4 text-cyan-300" />
                <span>100% Gratis & Tanpa Login Ribet</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/15">
                <FileSpreadsheet className="w-4 h-4 text-pink-300" />
                <span>Kurikulum Merdeka & K-13</span>
              </div>
            </div>

            {/* Quick Hero CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/tools/soal-generator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:scale-[1.02] transition-all cursor-pointer"
              >
                <FileQuestion className="w-5 h-5 text-amber-300" />
                <span>Buka Generator Soal AI (Aktif)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#katalog"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur text-white font-semibold text-sm sm:text-base border border-white/20 transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 text-blue-300" />
                <span>Jelajahi Katalog Tools</span>
              </a>
            </div>
          </div>
        </section>

        {/* KATALOG TOOLS SECTION */}
        <section id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                Katalog Alat Bantu AI
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Pilih Alat Bantu yang Anda Butuhkan
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                Setiap tool dirancang khusus untuk mempermudah alur kerja guru, mulai dari asesmen, perangkat ajar, hingga aktivitas kreatif kelas.
              </p>
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full md:w-80 shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama tool, tag, atau mapel..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-2xs placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count = categoryCounts[cat.id] || 0;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                      : 'bg-white text-slate-700 border-slate-200/90 hover:bg-slate-100/80 hover:border-slate-300'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Tools Grid */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => {
                const isActive = tool.status === 'active';

                return (
                  <div
                    key={tool.id}
                    className={`relative rounded-3xl bg-white border transition-all flex flex-col justify-between overflow-hidden group ${
                      isActive
                        ? 'border-blue-200 shadow-md shadow-blue-500/5 hover:shadow-xl hover:border-blue-400 hover:-translate-y-1'
                        : 'border-slate-200/80 shadow-2xs hover:shadow-md hover:border-slate-300'
                    }`}
                  >
                    {/* Top Status Header Banner */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        {/* Icon Container */}
                        <div
                          className={`w-13 h-13 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${
                            isActive
                              ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/20'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {renderToolIcon(tool.iconName, 'w-6 h-6')}
                        </div>

                        {/* Status Badge */}
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Siap Pakai
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Segera Hadir
                          </span>
                        )}
                      </div>

                      {/* Tool Title & Category */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                          {tool.categoryLabel}
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed line-clamp-3">
                          {tool.description}
                        </p>
                      </div>

                      {/* Features Bullets */}
                      {tool.features && tool.features.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-1.5">
                          {tool.features.slice(0, 3).map((feat, idx) => (
                            <div
                              key={idx}
                              className="text-[11.5px] text-slate-600 flex items-start gap-1.5"
                            >
                              <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                              <span className="line-clamp-1">{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {tool.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10.5px] font-medium px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-6 pt-0 border-t border-slate-100 bg-slate-50/50 mt-4 rounded-b-3xl">
                      <div className="pt-4 flex items-center justify-between gap-3">
                        <span className="text-[11px] text-slate-400">
                          {tool.targetAudience || 'Untuk Seluruh Guru'}
                        </span>

                        {isActive ? (
                          <Link
                            href={tool.path}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow transition-all group-hover:gap-2 cursor-pointer"
                          >
                            <span>Buka Tool</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <a
                            href="#aspirasi"
                            onClick={() => {
                              setRequestToolIdea(tool.title);
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                            title="Klik untuk voting / memberi saran fitur tool ini"
                          >
                            <MessageSquarePlus className="w-3.5 h-3.5 text-slate-400" />
                            <span>Request Rilis</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">
                  Tidak Ada Alat Bantu Ditemukan
                </h3>
                <p className="text-xs text-slate-500">
                  Tidak ada tool yang cocok dengan kata kunci &quot;{searchQuery}&quot;. Coba cari kata kunci lain atau kirimkan request tool di bawah.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Reset Filter
              </button>
            </div>
          )}
        </section>

        {/* KEUNGGULAN / VALUE PROPOSITION SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-blue-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Mengapa Memilih Teacher Tools Hub?
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Didesain Spesifik Mengikuti Standar Pendidikan Indonesia
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Bukan sekadar AI umum biasa. Setiap modul telah disesuaikan dengan taksonomi pembelajaran, format standar naskah asesmen, serta kaidah Kurikulum Merdeka & Kurikulum 2013.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 relative z-10">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/15 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/30 text-blue-200 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm">Multi-AI Fleksibel</h4>
                <p className="text-xs text-blue-100/90 leading-relaxed">
                  Gunakan Google Gemini, Groq ultra-cepat, Ollama Offline (tanpa internet), atau OpenRouter.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/15 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/30 text-emerald-200 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm">Privasi & Data Aman</h4>
                <p className="text-xs text-blue-100/90 leading-relaxed">
                  API Key & riwayat naskah tersimpan lokal di browser Anda. Tidak ada data rahasia ujian yang bocor ke cloud.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/15 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/30 text-purple-200 flex items-center justify-center font-bold">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm">Ekspor Word (.docx)</h4>
                <p className="text-xs text-blue-100/90 leading-relaxed">
                  Hasil langsung siap dicetak atau diedit di Microsoft Word dengan tabel kisi-kisi dan layout rapi.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/15 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-pink-500/30 text-pink-200 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm">100% Terbuka & Gratis</h4>
                <p className="text-xs text-blue-100/90 leading-relaxed">
                  Inisiatif nirlaba didedikasikan untuk seluruh pendidik di seluruh penjuru Indonesia dari Sabang sampai Merauke.
                </p>
              </div>
            </div>

            {/* Decorative background blob */}
            <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
          </div>
        </section>

        {/* SECTION ASPIRASI & REQUEST TOOL GURU */}
        <section id="aspirasi" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                <MessageSquarePlus className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  Aspirasi Guru: Butuh Alat Bantu Lain?
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Kami terus mengembangkan alat bantu baru berdasarkan kebutuhan nyata Bapak/Ibu Guru di lapangan. Beritahu kami fitur atau alat apa yang paling Anda harapkan segera hadir!
                </p>
              </div>
            </div>

            {isSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 animate-fade-in text-center sm:text-left flex flex-col sm:flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-sm">Terima Kasih Banyak atas Masukan Anda!</h4>
                  <p className="text-xs text-emerald-800">
                    Aspirasi Anda telah kami catat. Tim pengembang akan memprioritaskan pembuatan alat bantu sesuai saran terbanyak dari Bapak/Ibu Guru.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-900 text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer shrink-0"
                >
                  Kirim Ide Lain
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Nama Bapak/Ibu Guru (Opsional)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Ibu Rina, S.Pd."
                      value={requestName}
                      onChange={(e) => setRequestName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Jenjang / Mata Pelajaran Mengajar
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Guru Matematika SMP / Wali Kelas SD"
                      value={requestRole}
                      onChange={(e) => setRequestRole(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Nama Alat Bantu / Fitur AI yang Diinginkan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pembuat Rubrik Praktikum IPA / Generator Soal AKM Literasi"
                    value={requestToolIdea}
                    onChange={(e) => setRequestToolIdea(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">
                    Ceritakan Kebutuhan atau Format yang Diharapkan
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Contoh: Saya ingin tool yang bisa otomatis membuat format penilaian sikap dan keterampilan dengan skala 1-4 sesuai Kurikulum Merdeka..."
                    value={requestDescription}
                    onChange={(e) => setRequestDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-all resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-4 flex-wrap">
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                    Setiap usulan sangat berarti untuk perkembangan platform gratis ini.
                  </p>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs hover:shadow transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirimkan Aspirasi</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-10 text-slate-600 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-slate-900 text-base">
                  Teacher Tools Hub
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  v1.0 Modular
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Portal Kumpulan Alat Bantu Cerdas Berbasis AI untuk Guru & Tenaga Pendidik Indonesia.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 flex-wrap justify-center">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Beranda Hub
              </Link>
              <span>•</span>
              <a href="#katalog" className="hover:text-blue-600 transition-colors">
                Katalog Tools
              </a>
              <span>•</span>
              <Link href="/tools/soal-generator" className="hover:text-blue-600 transition-colors">
                Generator Soal AI
              </Link>
              <span>•</span>
              <a href="#aspirasi" className="hover:text-blue-600 transition-colors">
                Request Tool
              </a>
              <span>•</span>
              <button
                type="button"
                onClick={() => openDonationModal()}
                className="text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                title="Buka Modal Donasi & Dukungan"
              >
                <Heart className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Dukung Pengembang</span>
              </button>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6 text-center text-xs text-slate-400 space-y-1">
            <p>
              Teacher Tools Hub &copy; 2026 • Dirancang dengan penuh dedikasi untuk mendukung kemajuan pendidikan Indonesia.
            </p>
            <p className="text-[11px]">
              Mendukung Kurikulum Merdeka & Kurikulum 2013 • SD • SMP • SMA • SMK • Madrasah
            </p>
          </div>
        </div>
      </footer>

      {/* Floating Donate Widget */}
      <DonateWidget />
    </div>
  );
}
