'use client';

import React, { useState, useEffect } from 'react';
import { ExamGenerationRequest, AIProviderId } from '@/types/exam';
import { AI_PROVIDERS } from '@/lib/constants';
import {
  Sparkles,
  Clock,
  Zap,
  CheckCircle2,
  Lightbulb,
} from 'lucide-react';
import { DonationSection } from '@/components/DonationSection';

interface GeneratingModalProps {
  isOpen: boolean;
  requestData: ExamGenerationRequest | null;
}

const GENERATION_STEPS = [
  { id: 1, label: 'Menghubungkan ke AI Engine & Analisis Kurikulum', threshold: 0 },
  { id: 2, label: 'Merancang Stimulus Bacaan & Butir Soal', threshold: 3 },
  { id: 3, label: 'Mengukur Distribusi Kognitif (LOTS / MOTS / HOTS)', threshold: 6 },
  { id: 4, label: 'Menyusun Kunci Jawaban & Pembahasan Lengkap', threshold: 10 },
  { id: 5, label: 'Membuat Matriks Kisi-Kisi & Rubrik Penskoran', threshold: 14 },
];

const ROTATING_TIPS = [
  'Format naskah ujian otomatis disesuaikan dengan standar asesmen sekolah formal di Indonesia.',
  'Setelah proses selesai, naskah soal akan otomatis dibuka di Tab Baru dengan link dan ID unik.',
  'Setiap butir soal dilengkapi indikator capaian pembelajaran untuk lampiran administrasi guru.',
  'Setelah proses selesai, naskah dapat langsung diunduh rapi ke Microsoft Word (.docx) atau dicetak.',
  'Bobot tingkat kognitif Bloom (C1-C6) terdistribusi otomatis sesuai pilihan karakteristik ujian.',
  'Soal uraian dilengkapi panduan penskoran objektif untuk mempermudah koreksi guru.',
];

function getEstimatedTime(providerId?: AIProviderId, totalQuestions: number = 10): { min: number; max: number; text: string } {
  let min = 7;
  let max = 14;

  if (providerId === 'groq') {
    min = 4;
    max = 8;
  } else if (providerId === 'gemini') {
    min = 6;
    max = 12;
  } else if (providerId === 'anthropic') {
    min = 8;
    max = 16;
  } else if (providerId === 'openai') {
    min = 9;
    max = 18;
  } else if (providerId === 'deepseek' || providerId === 'openrouter') {
    min = 12;
    max = 24;
  } else if (providerId === 'ollama') {
    min = 18;
    max = 35;
  }

  // Adjust by questions count
  if (totalQuestions > 15) {
    min += 4;
    max += 8;
  } else if (totalQuestions > 10) {
    min += 2;
    max += 4;
  } else if (totalQuestions <= 5) {
    min = Math.max(3, min - 2);
    max = Math.max(6, max - 3);
  }

  return { min, max, text: `~${min} - ${max} detik` };
}

export const GeneratingModal: React.FC<GeneratingModalProps> = ({ isOpen, requestData }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  // Timer counter based on start time
  useEffect(() => {
    if (!isOpen) return;

    const start = Date.now();
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - start) / 1000));
    }, 500);

    return () => {
      clearInterval(interval);
      setElapsedSeconds(0);
    };
  }, [isOpen]);

  // Rotate tips
  useEffect(() => {
    if (!isOpen) return;

    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % ROTATING_TIPS.length);
    }, 4500);

    return () => clearInterval(tipInterval);
  }, [isOpen]);

  if (!isOpen || !requestData) return null;

  const totalQuestions = (requestData.pgCount || 0) + (requestData.essayCount || 0);
  const provider = AI_PROVIDERS.find((p) => p.id === requestData.aiProvider) || AI_PROVIDERS[0];
  const estimate = getEstimatedTime(requestData.aiProvider, totalQuestions);

  // Calculate realistic progress percentage advancing smoothly towards 95%
  const avgEstimate = (estimate.min + estimate.max) / 2;
  const progressPercent = Math.min(95, Math.round((elapsedSeconds / (avgEstimate * 1.15)) * 90) + 5);

  // Format seconds as MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m > 0 ? `${m}m ` : ''}${s} detik`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-4 md:p-6 flex min-h-screen items-center justify-center bg-slate-950/70 backdrop-blur-md transition-all">
      <div className="relative max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3rem)] overflow-y-auto w-full max-w-md md:max-w-lg rounded-3xl bg-white/95 backdrop-blur-xl p-4 sm:p-6 shadow-2xl border border-slate-200/90 space-y-3.5 sm:space-y-4 my-auto text-slate-800">
        {/* Top Glowing Gradient Bar */}
        <div className="sticky top-0 -mt-4 sm:-mt-6 -mx-4 sm:-mx-6 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 animate-pulse z-10" />

        {/* Header Spinner & Icon */}
        <div className="flex flex-col items-center text-center space-y-2 pt-1">
          <div className="relative flex items-center justify-center">
            {/* Outer Spinning Ring */}
            <div className="w-14 h-14 rounded-full border-3 border-blue-500/20 border-t-blue-600 border-r-indigo-500 animate-spin" />
            
            {/* Inner Pulsing Core */}
            <div className="absolute w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30 animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
          </div>

          <div className="space-y-0.5">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
              Menyusun Naskah Soal & Kisi-Kisi
            </h3>
            <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
              <span>Engine:</span>
              <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60">
                {provider.name} ({requestData.aiModel || provider.defaultModel})
              </span>
            </p>
          </div>
        </div>

        {/* Info Cards: Waktu Berjalan & Estimasi Waktu */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
          <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-2.5 sm:p-3 text-center space-y-0.5">
            <div className="flex items-center justify-center gap-1 text-[10.5px] font-semibold text-slate-500 uppercase tracking-wide">
              <Clock className="w-3 h-3 text-blue-600 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Waktu Berjalan</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-slate-900 font-mono">
              {formatTime(elapsedSeconds)}
            </div>
          </div>

          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-2.5 sm:p-3 text-center space-y-0.5">
            <div className="flex items-center justify-center gap-1 text-[10.5px] font-semibold text-blue-700 uppercase tracking-wide">
              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span>Estimasi Waktu</span>
            </div>
            <div className="text-base sm:text-lg font-extrabold text-blue-900 font-mono">
              {estimate.text}
            </div>
          </div>
        </div>

        {/* Progress Bar with Shimmer */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
            <span>Proses Penyusunan Konten</span>
            <span className="text-blue-600 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/80 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-700 ease-out shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Dynamic Generation Steps */}
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-3 space-y-1.5">
          <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-200/60 flex items-center justify-between">
            <span>Tahapan Pengerjaan AI</span>
            <span>{totalQuestions} Butir Soal</span>
          </div>

          <div className="space-y-1.5 pt-0.5">
            {GENERATION_STEPS.map((step) => {
              const isDone = elapsedSeconds > step.threshold + 3;
              const isCurrent = elapsedSeconds >= step.threshold && !isDone;

              return (
                <div key={step.id} className="flex items-center gap-2 text-[11.5px]">
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : isCurrent ? (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 shrink-0" />
                  )}

                  <span
                    className={`leading-tight ${
                      isDone
                        ? 'text-slate-500 line-through decoration-slate-300'
                        : isCurrent
                        ? 'font-bold text-blue-900'
                        : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Target Information Pill */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-slate-600 bg-slate-100/70 py-1.5 px-3 rounded-xl border border-slate-200/60">
          <span className="font-bold text-slate-800">{requestData.subject}</span>
          <span>•</span>
          <span>{requestData.grade}</span>
          <span>•</span>
          <span className="text-blue-700 font-semibold truncate max-w-[200px]">{requestData.topic}</span>
        </div>

        {/* Rotating Educational Tips */}
        <div className="flex items-start gap-2 p-2.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900">
          <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-semibold text-amber-950">Tahukah Anda? </span>
            <span className="transition-opacity duration-300">{ROTATING_TIPS[tipIndex]}</span>
          </div>
        </div>

        {/* Dukung Pengembangan Aplikasi Ini Section */}
        <DonationSection />
      </div>
    </div>
  );
};
