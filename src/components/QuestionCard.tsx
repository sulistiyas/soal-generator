'use client';

import React, { useState } from 'react';
import { QuestionItem } from '@/types/exam';
import { CheckCircle2, Edit3, Save, HelpCircle, Layers, Award } from 'lucide-react';

interface QuestionCardProps {
  question: QuestionItem;
  onUpdateQuestion: (updated: QuestionItem) => void;
  showAnswer?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onUpdateQuestion,
  showAnswer = true,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(question.question);
  const [stimulus, setStimulus] = useState(question.stimulus || '');
  const [explanation, setExplanation] = useState(question.explanation || '');

  const handleSave = () => {
    onUpdateQuestion({
      ...question,
      question: text,
      stimulus: stimulus.trim() ? stimulus : undefined,
      explanation,
    });
    setIsEditing(false);
  };

  const getCognitiveBadgeColor = (level: string) => {
    const l = level.toUpperCase();
    if (l.includes('HOTS') || l.includes('C5') || l.includes('C6')) {
      return 'bg-purple-100 text-purple-700 border-purple-200';
    }
    if (l.includes('MOTS') || l.includes('C3') || l.includes('C4')) {
      return 'bg-amber-100 text-amber-700 border-amber-200';
    }
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 space-y-4">
      {/* Header Soal */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shadow-blue-500/20">
            {question.number}
          </span>
          <span className="text-xs font-semibold uppercase px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
            {question.type === 'pg' ? 'Pilihan Ganda' : 'Uraian / Essay'}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-md border ${getCognitiveBadgeColor(
              String(question.cognitiveLevel)
            )}`}
          >
            {question.cognitiveLevel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium bg-slate-50 px-2 py-1 rounded-lg">
            <Award className="w-3.5 h-3.5 text-slate-400" />
            Bobot: {question.scoreWeight} Poin
          </span>
          <button
            type="button"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
            title={isEditing ? 'Simpan Perubahan' : 'Edit Soal'}
          >
            {isEditing ? <Save className="w-4 h-4 text-blue-600" /> : <Edit3 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Stimulus / Teks Bacaan */}
      {(question.stimulus || isEditing) && (
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            <Layers className="w-3 h-3" />
            <span>Stimulus / Teks Bacaan Soal</span>
          </div>
          {isEditing ? (
            <textarea
              value={stimulus}
              onChange={(e) => setStimulus(e.target.value)}
              placeholder="Teks pengantar atau stimulus bacaan (opsional)..."
              rows={2}
              className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            <p className="italic leading-relaxed whitespace-pre-wrap">{question.stimulus}</p>
          )}
        </div>
      )}

      {/* Pertanyaan */}
      <div className="text-slate-800 text-sm font-medium leading-relaxed">
        {isEditing ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        ) : (
          <p className="whitespace-pre-wrap">{question.question}</p>
        )}
      </div>

      {/* Pilihan Ganda (Opsi) */}
      {question.type === 'pg' && Array.isArray(question.options) && (
        <div className="grid grid-cols-1 gap-2 pt-1">
          {question.options.map((opt) => {
            const isCorrect =
              String(question.correctAnswer || '').trim().toUpperCase() ===
              String(opt.key || '').trim().toUpperCase();
            return (
              <div
                key={opt.key}
                className={`flex items-start gap-3 p-3 rounded-xl border text-sm transition-all ${
                  showAnswer && isCorrect
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium'
                    : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50/60'
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                    showAnswer && isCorrect
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {opt.key}
                </span>
                <span className="flex-1 pt-0.5">{opt.text}</span>
                {showAnswer && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Kunci & Pembahasan Lengkap */}
      {showAnswer && (
        <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-3.5 space-y-2 text-xs text-slate-700">
          <div className="flex items-center gap-1.5 font-semibold text-blue-900">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Kunci Jawaban & Pembahasan:</span>
          </div>

          <div className="font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/70 inline-block">
            Kunci: {String(question.correctAnswer || '-')}
          </div>

          {isEditing ? (
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={2}
              className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            <p className="text-slate-600 leading-relaxed pl-1">{question.explanation || '-'}</p>
          )}

          {/* Indikator Kisi-kisi */}
          {question.indicator && (
            <div className="text-[11px] text-slate-500 border-t border-blue-100/80 pt-2 mt-2">
              <span className="font-semibold text-slate-600">Indikator Soal: </span>
              {question.indicator}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
