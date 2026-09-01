'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, CircleDashed, Award, FileSpreadsheet, ListChecks, Check } from 'lucide-react';
import { KisiKisiRubrikGenerationRequest } from '@/types/rubrik';

interface RubrikGeneratingModalProps {
  isOpen: boolean;
  request: KisiKisiRubrikGenerationRequest | null;
}

const STEPS = [
  { id: 'analyze', label: 'Menganalisis Capaian Pembelajaran (CP) & Taksonomi Bloom' },
  { id: 'blueprint', label: 'Menyusun Matriks Kisi-Kisi Soal (Audience, Behavior, Condition, Degree)' },
  { id: 'levels', label: 'Menyeimbangkan Distribusi Tingkat Kesukaran (LOTS, MOTS, HOTS)' },
  { id: 'rubric', label: 'Merumuskan Rubrik Penilaian Analitik & Deskriptor Kualitatif' },
  { id: 'scoring', label: 'Menyusun Pedoman Penskoran, Kunci Jawaban & Interval KKTP' },
  { id: 'finalize', label: 'Memformat Dokumen Siap Cetak dan Ekspor Microsoft Word' },
];

const QUOTES = [
  '“Penilaian yang baik bukan sekadar memberi angka, melainkan memandu murid memahami langkah perbaikan selanjutnya.”',
  '“Kisi-kisi yang terstruktur menjamin keadilan, kejelasan, dan objektivitas dalam setiap evaluasi belajar.”',
  '“Rubrik deskriptif memberdayakan murid untuk merefleksikan proses belajar mereka secara mandiri.”',
  '“Kombinasi kisi-kisi terukur dan rubrik analitik menghasilkan pembelajaran yang lebih bermakna.”',
];

export const RubrikGeneratingModal: React.FC<RubrikGeneratingModalProps> = ({ isOpen, request }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      return;
    }

    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 2800);

    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
    }, 4500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(quoteInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full p-6 sm:p-8 text-center relative overflow-hidden">
        {/* Top Gradient Ribbon */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

        {/* Pulsing Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 mb-5 relative shadow-inner">
          <Sparkles className="w-8 h-8 animate-pulse text-blue-600" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600"></span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-1">
          Sedang Menyusun Kisi-Kisi & Rubrik...
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          AI sedang merancang instrumen evaluasi <span className="font-semibold text-blue-600">{request?.subject || 'Mata Pelajaran'}</span> untuk <span className="font-semibold text-slate-700">Kelas {request?.grade || ''}</span>
        </p>

        {/* Step Progress Checklist */}
        <div className="space-y-3 text-left bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 transition-all duration-300 ${
                  isCurrent
                    ? 'text-blue-700 font-semibold scale-[1.01]'
                    : isCompleted
                    ? 'text-emerald-700 font-medium'
                    : 'text-slate-400 text-xs'
                }`}
              >
                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <CircleDashed className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0" />
                )}
                <span className="text-xs sm:text-sm truncate">{step.label}</span>
              </div>
            );
          })}
        </div>

        {/* Inspirational Quote Card */}
        <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100/80 text-xs text-slate-600 italic">
          <p className="transition-opacity duration-500 min-h-[36px] flex items-center justify-center">
            {QUOTES[quoteIndex]}
          </p>
        </div>
      </div>
    </div>
  );
};
