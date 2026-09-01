'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExamData, QuestionItem } from '@/types/exam';
import { QuestionCard } from '@/components/QuestionCard';
import { exportExamToDocx } from '@/lib/docx-generator';
import { trackEvent } from '@/lib/analytics';
import {
  FileText,
  Key,
  Table as TableIcon,
  Download,
  Printer,
  Copy,
  Check,
  RefreshCw,
  BookText,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExamPreviewProps {
  exam: ExamData;
  onUpdateExam: (updated: ExamData) => void;
  onReset: () => void;
}

export const ExamPreview: React.FC<ExamPreviewProps> = ({ exam, onUpdateExam, onReset }) => {
  const [activeTab, setActiveTab] = useState<'naskah' | 'kunci' | 'kisi'>('naskah');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleUpdateQuestion = (updatedQ: QuestionItem) => {
    const newQuestions = exam.questions.map((q) => (q.id === updatedQ.id ? updatedQ : q));
    onUpdateExam({
      ...exam,
      questions: newQuestions,
    });
  };

  const handleExportDocx = async () => {
    try {
      setIsExporting(true);
      await exportExamToDocx(exam);
      trackEvent('export_docx', {
        subject: exam.subject,
        grade: exam.grade,
        question_count: exam.questions?.length,
      });
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.8 } });
    } catch (err) {
      console.error(err);
      alert('Gagal mengunduh file Word.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    let plainText = `${exam.schoolName || 'SEKOLAH'}\n${exam.examTitle || 'UJIAN'}\nMata Pelajaran: ${exam.subject || '-'} | Kelas: ${exam.grade || '-'}\n\n`;

    (exam.questions || []).forEach((q) => {
      plainText += `${q.number}. ${q.question || ''}\n`;
      if (q.type === 'pg' && Array.isArray(q.options)) {
        q.options.forEach((opt) => {
          if (opt) plainText += `   ${opt.key}. ${opt.text || ''}\n`;
        });
      } else if (q.type === 'isian') {
        plainText += `   Jawaban: ........................................................\n`;
      }
      plainText += '\n';
    });

    plainText += '\n--- KUNCI JAWABAN & PEMBAHASAN ---\n';
    (exam.questions || []).forEach((q) => {
      const typeLabel = q.type === 'pg' ? 'PG' : q.type === 'isian' ? 'ISIAN' : 'URAIAN';
      plainText += `No ${q.number} (${typeLabel}): ${q.correctAnswer || '-'} - ${q.explanation || '-'}\n`;
    });

    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Cross-tool deep link to Modul Ajar Generator with matching subject, grade, and topic
  const modulAjarUrl = `/tools/modul-ajar?fromExam=true&schoolName=${encodeURIComponent(
    exam.schoolName || ''
  )}&level=${encodeURIComponent(
    exam.educationLevel || ''
  )}&grade=${encodeURIComponent(
    exam.grade || ''
  )}&subject=${encodeURIComponent(
    exam.subject || ''
  )}&curriculum=${encodeURIComponent(
    exam.curriculum || 'merdeka'
  )}&topic=${encodeURIComponent(
    exam.topic || ''
  )}`;

  return (
    <div className="space-y-6">
      {/* Cross-Tool Connection Recommendation Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 print:hidden animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
            <BookText className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xs font-semibold text-purple-200 uppercase tracking-wider block">
              Integrasi Administrasi Guru Cerdas
            </span>
            <h3 className="font-bold text-sm sm:text-base text-white">
              Butuh Modul Ajar & RPP untuk materi &quot;{exam.topic || exam.subject}&quot;?
            </h3>
            <p className="text-xs text-purple-100/90 hidden sm:block">
              Buat dokumen Modul Ajar resmi lengkap dengan langkah pembelajaran dan LKPD dengan 1 klik.
            </p>
          </div>
        </div>

        <Link
          href={modulAjarUrl}
          className="min-h-[42px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-purple-50 active:bg-purple-100 text-purple-900 font-bold text-xs sm:text-sm shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Buat Modul Ajar untuk Materi Ini</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Action Toolbar Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-bold text-slate-900 text-base sm:text-lg">
              {exam.subject} - {exam.grade}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              {exam.questions.length} Butir Soal Siap
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{exam.examTitle}</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
          <button
            type="button"
            onClick={handleExportDocx}
            disabled={isExporting}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Memproses...' : 'Download Word (.docx)'}</span>
          </button>

          <div className="grid grid-cols-3 sm:flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-medium text-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Cetak</span>
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-medium text-xs transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copied ? 'Tersalin!' : 'Salin'}</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-xs transition-colors cursor-pointer"
              title="Buat Soal Baru"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2 border-b border-slate-200 pb-px print:hidden overflow-x-auto no-scrollbar scroll-smooth">
        <button
          type="button"
          onClick={() => setActiveTab('naskah')}
          className={`min-h-[44px] flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'naskah'
              ? 'bg-white text-blue-600 border-t-2 border-t-blue-600 border-x border-slate-200 shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>📝 Naskah Soal ({exam.questions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kunci')}
          className={`min-h-[44px] flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'kunci'
              ? 'bg-white text-emerald-600 border-t-2 border-t-emerald-600 border-x border-slate-200 shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>🔑 Kunci & Pembahasan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kisi')}
          className={`min-h-[44px] flex items-center gap-2 px-3.5 sm:px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'kisi'
              ? 'bg-white text-indigo-600 border-t-2 border-t-indigo-600 border-x border-slate-200 shadow-xs font-bold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <TableIcon className="w-4 h-4" />
          <span>📊 Kisi-Kisi & Rubrik</span>
        </button>
      </div>

      {/* ================= TAB 1: NASKAH SOAL SISWA ================= */}
      {activeTab === 'naskah' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-4 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
            <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
              <h1 className="font-extrabold text-base sm:text-xl text-slate-900 tracking-wide uppercase">
                {exam.schoolName || 'NAMA SEKOLAH'}
              </h1>
              <h2 className="font-bold text-sm sm:text-base text-slate-800">{exam.examTitle}</h2>
              <p className="text-xs text-slate-600">
                TAHUN AJARAN {exam.academicYear} • SEMESTER {exam.semester.toUpperCase()}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800 py-2 border-b border-slate-200">
              <div className="space-y-1">
                <p><strong>Mata Pelajaran:</strong> {exam.subject}</p>
                <p><strong>Kelas / Fase:</strong> {exam.grade}</p>
                <p><strong>Kurikulum:</strong> {exam.curriculum}</p>
              </div>
              <div className="space-y-1">
                <p><strong>Hari / Tanggal:</strong> .....................................</p>
                <p><strong>Alokasi Waktu:</strong> {exam.durationMinutes} Menit</p>
                <p><strong>Nama Peserta:</strong> .....................................</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {exam.questions.map((q) => (
              <QuestionCard
                key={q.id || q.number}
                question={q}
                onUpdateQuestion={handleUpdateQuestion}
                showAnswer={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: KUNCI JAWABAN & PEMBAHASAN ================= */}
      {activeTab === 'kunci' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Kunci Jawaban Singkat
                </h3>
                <p className="text-xs text-slate-500">Rekap cepat jawaban Pilihan Ganda</p>
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2">
              {exam.questions
                .filter((q) => q.type === 'pg')
                .map((q) => (
                  <div
                    key={q.id || q.number}
                    className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-center"
                  >
                    <span className="text-[10px] text-slate-400 block font-medium">No {q.number}</span>
                    <span className="text-sm font-extrabold text-blue-600">{q.correctAnswer}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="space-y-4">
            {exam.questions.map((q) => (
              <QuestionCard
                key={q.id || q.number}
                question={q}
                onUpdateQuestion={handleUpdateQuestion}
                showAnswer={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: KISI-KISI & RUBRIK PENILAIAN ================= */}
      {activeTab === 'kisi' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Matriks Kisi-Kisi Penulisan Soal
                </h3>
                <p className="text-xs text-slate-500">
                  Standar administrasi kurikulum asesmen sekolah
                </p>
              </div>
              <span className="text-xs text-slate-400 hidden sm:inline">
                Geser tabel jika terpotong 👉
              </span>
            </div>

            <div className="overflow-x-auto thin-scrollbar">
              <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden min-w-[700px]">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3 w-12 text-center">No</th>
                    <th className="p-3 w-32">Bentuk</th>
                    <th className="p-3 w-28">Kognitif</th>
                    <th className="p-3">Capaian / Tujuan Pembelajaran</th>
                    <th className="p-3">Indikator Soal</th>
                    <th className="p-3 w-16 text-center">Bobot</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {exam.questions.map((q) => (
                    <tr key={q.id || q.number} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 text-center font-bold text-slate-900">{q.number}</td>
                      <td className="p-3 font-semibold text-slate-700">
                        {q.type === 'pg' ? 'Pilihan Ganda' : q.type === 'isian' ? 'Isian Singkat' : 'Uraian / Essay'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            q.cognitiveLevel === 'HOTS'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : q.cognitiveLevel === 'MOTS'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {q.cognitiveLevel || 'MOTS'}
                        </span>
                      </td>
                      <td className="p-3 text-slate-800">{q.learningObjective || '-'}</td>
                      <td className="p-3 text-slate-700">{q.indicator || '-'}</td>
                      <td className="p-3 text-center font-bold text-blue-700">{q.scoreWeight || 1}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rubrik Penilaian Uraian / Essay */}
          {exam.rubrics && exam.rubrics.length > 0 && (
            <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base border-b border-slate-100 pb-3">
                Pedoman & Rubrik Penskoran Soal Uraian
              </h3>

              <div className="space-y-4">
                {exam.rubrics.map((r, rIdx) => (
                  <div key={rIdx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-blue-900">Soal Nomor {r.questionNumber} (Uraian)</span>
                      <span className="text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        Skor Maksimal: {r.maxScore}
                      </span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium">{r.criteria}</p>

                    <div className="pt-2">
                      <span className="text-[11px] font-bold text-slate-600 uppercase block mb-1">
                        Kriteria Pembagian Skor:
                      </span>
                      <div className="space-y-1">
                        {r.scoringGuide?.map((guide, idx) => (
                          <div key={idx} className="text-xs flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200/70">
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] shrink-0">
                              Skor {guide.score}
                            </span>
                            <span className="text-slate-700">{guide.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
