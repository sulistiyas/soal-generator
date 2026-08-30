'use client';

import React, { useState, useRef } from 'react';
import { QuestionItem } from '@/types/exam';
import {
  CheckCircle2,
  Edit3,
  Save,
  HelpCircle,
  Layers,
  Award,
  Image as ImageIcon,
  Trash2,
  Upload,
  Box,
  Code2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { GEOMETRY_TEMPLATES } from '@/lib/geometry-templates';

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
  const [imageSvg, setImageSvg] = useState(question.imageSvg || '');
  const [imageUrl, setImageUrl] = useState(question.imageUrl || '');
  const [imageCaption, setImageCaption] = useState(question.imageCaption || '');
  
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showSvgEditor, setShowSvgEditor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdateQuestion({
      ...question,
      question: text,
      stimulus: stimulus.trim() ? stimulus : undefined,
      explanation,
      imageSvg: imageSvg.trim() ? imageSvg.trim() : undefined,
      imageUrl: imageUrl.trim() ? imageUrl.trim() : undefined,
      imageCaption: imageCaption.trim() ? imageCaption.trim() : undefined,
    });
    setIsEditing(false);
    setShowTemplatePicker(false);
    setShowSvgEditor(false);
  };

  const handleSelectTemplate = (templateId: string) => {
    const t = GEOMETRY_TEMPLATES.find((item) => item.id === templateId);
    if (t) {
      setImageSvg(t.svg);
      setImageUrl(''); // reset file image
      if (!imageCaption) {
        setImageCaption(t.defaultCaption);
      }
      setShowTemplatePicker(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImageUrl(event.target.result);
        setImageSvg(''); // reset SVG
        if (!imageCaption) {
          setImageCaption(`Gambar Soal No. ${question.number}`);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageSvg('');
    setImageUrl('');
    setImageCaption('');
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

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'pg':
        return {
          label: 'Pilihan Ganda',
          className: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      case 'isian':
        return {
          label: 'Isian Singkat',
          className: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'uraian':
      case 'essay':
      default:
        return {
          label: 'Uraian / Essay',
          className: 'bg-purple-50 text-purple-800 border-purple-200',
        };
    }
  };

  const typeInfo = getTypeBadge(question.type);
  const hasVisual = Boolean(
    (isEditing ? imageSvg || imageUrl : question.imageSvg || question.imageUrl)
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all p-5 space-y-4">
      {/* Header Soal */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-sm shadow-sm shadow-blue-500/20">
            {question.number}
          </span>
          <span className={`text-xs font-semibold uppercase px-2.5 py-1 rounded-md border ${typeInfo.className}`}>
            {typeInfo.label}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-md border ${getCognitiveBadgeColor(
              String(question.cognitiveLevel)
            )}`}
          >
            {question.cognitiveLevel}
          </span>
          {hasVisual && (
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              <span>Ada Gambar</span>
            </span>
          )}
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
            title={isEditing ? 'Simpan Perubahan' : 'Edit Soal & Gambar'}
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
              className="w-full text-base sm:text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            <p className="italic leading-relaxed whitespace-pre-wrap">{question.stimulus}</p>
          )}
        </div>
      )}

      {/* Visual Diagram / Gambar Geometri */}
      {hasVisual && (
        <div className="my-3 p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center">
          <div className="max-w-xs sm:max-w-sm w-full flex flex-col items-center">
            {isEditing ? (
              imageSvg ? (
                <div
                  className="w-full flex justify-center [&>svg]:max-h-44 [&>svg]:w-auto [&>svg]:rounded-lg [&>svg]:shadow-xs"
                  dangerouslySetInnerHTML={{ __html: imageSvg }}
                />
              ) : imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={imageCaption || `Ilustrasi Soal No ${question.number}`}
                  className="max-h-48 rounded-lg object-contain border border-slate-200 shadow-xs"
                />
              ) : null
            ) : question.imageSvg ? (
              <div
                className="w-full flex justify-center [&>svg]:max-h-44 [&>svg]:w-auto [&>svg]:rounded-lg [&>svg]:shadow-xs"
                dangerouslySetInnerHTML={{ __html: question.imageSvg }}
              />
            ) : question.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={question.imageUrl}
                alt={question.imageCaption || `Ilustrasi Soal No ${question.number}`}
                className="max-h-48 rounded-lg object-contain border border-slate-200 shadow-xs"
              />
            ) : null}

            {/* Caption Gambar */}
            {(isEditing ? imageCaption : question.imageCaption) && (
              <span className="text-[11px] font-medium text-slate-500 italic mt-2 text-center">
                {isEditing ? imageCaption : question.imageCaption}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Editor Tambahan untuk Gambar / SVG saat mode isEditing */}
      {isEditing && (
        <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="font-semibold text-blue-900 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
              Kelola Gambar / Diagram Visual:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setShowTemplatePicker(!showTemplatePicker)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 font-medium text-xs shadow-2xs transition-colors cursor-pointer"
              >
                <Box className="w-3.5 h-3.5 text-blue-600" />
                <span>Pilih Template Geometri</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium text-xs shadow-2xs transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>Upload Foto / Gambar</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />

              {hasVisual && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-medium text-xs transition-colors cursor-pointer"
                  title="Hapus gambar dari soal ini"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              )}
            </div>
          </div>

          {/* Template Picker Grid Modal/Dropdown */}
          {showTemplatePicker && (
            <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-sm space-y-2">
              <span className="font-bold text-slate-800 block text-[11px]">
                Pilih Bangun Ruang / Bangun Datar / Diagram:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                {GEOMETRY_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className="p-2 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-left transition-all flex flex-col items-center text-center cursor-pointer group"
                  >
                    <div
                      className="w-16 h-12 flex items-center justify-center [&>svg]:max-h-12 [&>svg]:w-auto"
                      dangerouslySetInnerHTML={{ __html: tpl.svg }}
                    />
                    <span className="text-[10px] font-semibold text-slate-700 group-hover:text-blue-600 mt-1 line-clamp-1">
                      {tpl.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Caption Input */}
          {(imageSvg || imageUrl) && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-600 block">
                Keterangan / Caption Gambar:
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Contoh: Gambar Kubus ABCD.EFGH..."
                className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>
          )}

          {/* Collapsible SVG Raw Code Editor */}
          {imageSvg && (
            <div>
              <button
                type="button"
                onClick={() => setShowSvgEditor(!showSvgEditor)}
                className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 font-medium cursor-pointer"
              >
                <Code2 className="w-3 h-3" />
                <span>{showSvgEditor ? 'Sembunyikan Kode SVG' : 'Edit Kode SVG (Lanjutan)'}</span>
                {showSvgEditor ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
              {showSvgEditor && (
                <textarea
                  value={imageSvg}
                  onChange={(e) => setImageSvg(e.target.value)}
                  rows={4}
                  className="w-full text-[11px] font-mono p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white mt-1.5"
                  placeholder="<svg>...</svg>"
                />
              )}
            </div>
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
            className="w-full text-base sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
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
                className={`min-h-[44px] flex items-start gap-3 p-3 rounded-xl border text-sm transition-all ${
                  showAnswer && isCorrect
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium'
                    : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50/60 active:bg-slate-100'
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

      {/* Isian Singkat - Mode Siswa (Placeholder Jawaban) */}
      {!showAnswer && question.type === 'isian' && (
        <div className="pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50/80 border border-dashed border-slate-300 rounded-xl p-3">
            <span className="font-semibold text-slate-700">Jawaban:</span>
            <div className="flex-1 border-b border-dashed border-slate-400 h-4" />
          </div>
        </div>
      )}

      {/* Uraian / Essay - Mode Siswa (Placeholder Garis Tulis) */}
      {!showAnswer && (question.type === 'uraian' || question.type === 'essay') && (
        <div className="pt-2 space-y-2">
          <div className="space-y-3 pt-1">
            <div className="border-b border-dashed border-slate-300 w-full h-3" />
            <div className="border-b border-dashed border-slate-300 w-full h-3" />
            <div className="border-b border-dashed border-slate-300 w-full h-3" />
          </div>
        </div>
      )}

      {/* Kunci & Pembahasan Lengkap */}
      {showAnswer && (
        <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-3.5 space-y-2 text-xs text-slate-700">
          <div className="flex items-center gap-1.5 font-semibold text-blue-900">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Kunci Jawaban & Pembahasan:</span>
          </div>

          <div className="font-medium text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/80 inline-block">
            <span className="font-bold">Kunci: </span>
            <span>{String(question.correctAnswer || '-')}</span>
          </div>

          {isEditing ? (
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={2}
              className="w-full text-base sm:text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
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

