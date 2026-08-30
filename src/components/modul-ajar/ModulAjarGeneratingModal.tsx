'use client';

import React, { useState, useEffect } from 'react';
import { ModulAjarGenerationRequest } from '@/types/modul-ajar';
import { AI_PROVIDERS } from '@/lib/constants';
import { AIProviderId } from '@/types/exam';
import {
  Sparkles,
  Clock,
  Zap,
  CheckCircle2,
  Lightbulb,
  BookOpen,
} from 'lucide-react';
import { DonationSection } from '@/components/DonationSection';

interface ModulAjarGeneratingModalProps {
  isOpen: boolean;
  requestData: ModulAjarGenerationRequest | null;
}

const GENERATION_STEPS = [
  { id: 1, label: 'Menghubungkan ke Engine AI & Menyelaraskan Kurikulum', threshold: 0 },
  { id: 2, label: 'Menganalisis Capaian (CP) & Alur Tujuan Pembelajaran (ATP)', threshold: 3 },
  { id: 3, label: 'Merumuskan Pemahaman Bermakna & Pertanyaan Pemantik', threshold: 6 },
  { id: 4, label: 'Menyusun Skenario Sintaks & Diferensiasi Pembelajaran', threshold: 10 },
  { id: 5, label: 'Merancang Asesmen, Rubrik KKTP, dan Lampiran LKPD', threshold: 15 },
];

const ROTATING_TIPS = [
  'Modul Ajar dirancang sesuai Panduan Pembelajaran dan Asesmen (PPA) Kemendikbudristek terbaru.',
  'Setelah proses selesai, Modul Ajar dapat langsung diekspor rapi ke Microsoft Word (.docx) siap cetak.',
  'Sintaks model pembelajaran (PBL, PjBL, Discovery) dipetakan otomatis per alokasi menit.',
  'Lembar Kerja Peserta Didik (LKPD) dan Rubrik KKTP sudah terintegrasi dalam satu paket.',
  'Tersedia Lembar Pengesahan Kepala Sekolah dan Guru Pengampu di bagian akhir dokumen.',
];

function getEstimatedTime(providerId?: AIProviderId): { min: number; max: number; text: string } {
  let min = 8;
  let max = 16;

  if (providerId === 'groq') {
    min = 4;
    max = 8;
  } else if (providerId === 'gemini') {
    min = 6;
    max = 14;
  } else if (providerId === 'deepseek') {
    min = 12;
    max = 24;
  } else if (providerId === 'ollama') {
    min = 15;
    max = 35;
  }

  return {
    min,
    max,
    text: `${min} - ${max} detik`,
  };
}

export const ModulAjarGeneratingModal: React.FC<ModulAjarGeneratingModalProps> = ({
  isOpen,
  requestData,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const providerId = requestData?.aiProvider || 'gemini';
  const providerConfig = AI_PROVIDERS.find((p) => p.id === providerId) || AI_PROVIDERS[0];
  const est = getEstimatedTime(providerId);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let tipTimer: NodeJS.Timeout;

    if (isOpen) {
      setElapsedSeconds(0);
      setCurrentTipIndex(0);

      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);

      tipTimer = setInterval(() => {
        setCurrentTipIndex((prev) => (prev + 1) % ROTATING_TIPS.length);
      }, 4000);
    }

    return () => {
      clearInterval(timer);
      clearInterval(tipTimer);
    };
  }, [isOpen]);

  if (!isOpen || !requestData) return null;

  const currentStep = GENERATION_STEPS.reduce((acc, step) => {
    return elapsedSeconds >= step.threshold ? step.id : acc;
  }, 1);

  const progressPercent = Math.min(
    95,
    Math.round((elapsedSeconds / est.max) * 90) + 5
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative overflow-hidden border border-slate-100 my-auto">
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header animation */}
        <div className="text-center space-y-3">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 animate-bounce">
              <BookOpen className="w-8 h-8" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white" />
            </span>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Menyusun Modul Ajar AI
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {requestData.subject} • {requestData.grade}
            </p>
          </div>
        </div>

        {/* Progress Bar & Timer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              {providerConfig.name} ({requestData.aiModel || providerConfig.defaultModel})
            </span>
            <span className="font-mono font-bold text-blue-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {elapsedSeconds}s (Estimasi: {est.text})
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Generation Steps Checklist */}
        <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/70 space-y-2.5">
          {GENERATION_STEPS.map((step) => {
            const isDone = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-2.5 text-xs transition-colors ${
                  isDone
                    ? 'text-emerald-700 font-semibold'
                    : isCurrent
                    ? 'text-blue-900 font-bold'
                    : 'text-slate-400'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : isCurrent ? (
                  <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                )}
                <span className="line-clamp-1">{step.label}</span>
              </div>
            );
          })}
        </div>

        {/* Rotating Teacher Tips */}
        <div className="bg-amber-50/60 border border-amber-200/60 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-amber-950">
          <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 flex-1">
            <strong className="block text-[11px] font-bold text-amber-900 uppercase">
              Tips Administrasi Guru:
            </strong>
            <p className="text-amber-900/90 leading-relaxed min-h-[36px] transition-all">
              {ROTATING_TIPS[currentTipIndex]}
            </p>
          </div>
        </div>

        {/* Saweria Support Widget */}
        <DonationSection />
      </div>
    </div>
  );
};
