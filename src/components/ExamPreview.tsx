'use client';

import React, { useState } from 'react';
import { ExamData, QuestionItem } from '@/types/exam';
import { QuestionCard } from '@/components/QuestionCard';
import { exportExamToDocx } from '@/lib/docx-generator';
import {
  FileText,
  Key,
  Table as TableIcon,
  Download,
  Printer,
  Copy,
  Check,
  RefreshCw,
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
      if (Array.isArray(q.options)) {
        q.options.forEach((opt) => {
          if (opt) plainText += `   ${opt.key}. ${opt.text || ''}\n`;
        });
      }
      plainText += '\n';
    });

    plainText += '\n--- KUNCI JAWABAN ---\n';
    (exam.questions || []).forEach((q) => {
      plainText += `No ${q.number}: ${q.correctAnswer || '-'} - ${q.explanation || '-'}\n`;
    });

    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar Header */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-900 text-base sm:text-lg">
              {exam.subject} - {exam.grade}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              {exam.questions.length} Butir Soal Siap
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{exam.examTitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportDocx}
            disabled={isExporting}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm hover:shadow transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Memproses...' : 'Download Word (.docx)'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / PDF</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium text-xs transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs transition-colors cursor-pointer"
            title="Buat Soal Baru"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Buat Baru</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-px print:hidden">
        <button
          type="button"
          onClick={() => setActiveTab('naskah')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'naskah'
              ? 'bg-white text-blue-600 border-t-2 border-t-blue-600 border-x border-slate-200 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>📝 Naskah Soal Siswa ({exam.questions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kunci')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'kunci'
              ? 'bg-white text-emerald-600 border-t-2 border-t-emerald-600 border-x border-slate-200 shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>🔑 Kunci & Pembahasan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('kisi')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all cursor-pointer ${
            activeTab === 'kisi'
              ? 'bg-white text-indigo-600 border-t-2 border-t-indigo-600 border-x border-slate-200 shadow-xs'
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
          {/* Header Cetak Standar Naskah Ujian (Kop Surat) */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
            <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
              <h1 className="font-extrabold text-lg sm:text-xl text-slate-900 tracking-wide uppercase">
                {exam.schoolName || 'NAMA SEKOLAH'}
              </h1>
              <h2 className="font-bold text-sm sm:text-base text-slate-800">{exam.examTitle}</h2>
              <p className="text-xs text-slate-600">
                TAHUN AJARAN {exam.academicYear} • SEMESTER {exam.semester.toUpperCase()}
              </p>
            </div>

            {/* Identitas Ujian */}
            <div className="grid grid-cols-2 text-xs text-slate-800 py-2 border-b border-slate-200">
              <div className="space-y-1">
                <div>
                  <span className="font-bold inline-block w-28">Mata Pelajaran</span>: {exam.subject}
                </div>
                <div>
                  <span className="font-bold inline-block w-28">Kelas / Fase</span>: {exam.grade}
                </div>
              </div>
              <div className="space-y-1">
                <div>
                  <span className="font-bold inline-block w-28">Alokasi Waktu</span>: {exam.durationMinutes} Menit
                </div>
                <div>
                  <span className="font-bold inline-block w-28">Hari, Tanggal</span>: ........................................
                </div>
              </div>
            </div>

            {/* Petunjuk Pengerjaan */}
            <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-700 space-y-1">
              <span className="font-bold underline block mb-1">PETUNJUK UMUM:</span>
              {(exam.instructions || []).map((inst, i) => (
                <div key={i} className="flex gap-2">
                  <span>{i + 1}.</span>
                  <span>{inst}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daftar Soal */}
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
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-xs text-emerald-950 flex items-center justify-between">
            <div>
              <span className="font-bold text-sm block">Lembar Kunci Jawaban & Pembahasan Lengkap</span>
              <span>Gunakan lembar ini sebagai pedoman koreksi nilai dan analisis butir soal.</span>
            </div>
            <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-xs">
              {exam.questions.length} Soal
            </span>
          </div>

          {exam.questions.map((q) => (
            <QuestionCard
              key={q.id || q.number}
              question={q}
              onUpdateQuestion={handleUpdateQuestion}
              showAnswer={true}
            />
          ))}
        </div>
      )}

      {/* ================= TAB 3: KISI-KISI SOAL & RUBRIK ================= */}
      {activeTab === 'kisi' && (
        <div className="space-y-6">
          {/* Tabel Kisi-Kisi */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Matriks Kisi-Kisi Penulisan Soal
                </h3>
                <p className="text-xs text-slate-500">
                  Format standar instrumen penilaian (Capaian Pembelajaran, Indikator, & Level Kognitif)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5 w-10 text-center">No</th>
                    <th className="p-2.5 w-1/4">Capaian / Tujuan Pembelajaran</th>
                    <th className="p-2.5 w-1/3">Indikator Soal</th>
                    <th className="p-2.5 text-center">Level</th>
                    <th className="p-2.5 text-center">Bentuk</th>
                    <th className="p-2.5 text-center">No Soal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {exam.questions.map((q, idx) => (
                    <tr key={q.id || idx} className="hover:bg-slate-50/80">
                      <td className="p-2.5 text-center font-medium">{idx + 1}</td>
                      <td className="p-2.5">{q.learningObjective || exam.topic}</td>
                      <td className="p-2.5">{q.indicator || `Menjawab soal materi ${exam.topic}`}</td>
                      <td className="p-2.5 text-center font-semibold">{q.cognitiveLevel}</td>
                      <td className="p-2.5 text-center uppercase font-medium">{q.type}</td>
                      <td className="p-2.5 text-center font-bold text-blue-600">{q.number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rubrik Penilaian Uraian */}
          {exam.rubrics && exam.rubrics.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Pedoman Penskoran & Rubrik Penilaian Uraian
                </h3>
                <p className="text-xs text-slate-500">
                  Kriteria penilaian bertingkat untuk objektivitas koreksi guru
                </p>
              </div>

              <div className="space-y-4">
                {exam.rubrics.map((rubric, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Soal Uraian Nomor {rubric.questionNumber}</span>
                      <span className="text-blue-600">Skor Maksimal: {rubric.maxScore}</span>
                    </div>
                    <p className="text-slate-600">
                      <span className="font-semibold">Kriteria Penilaian:</span> {rubric.criteria}
                    </p>

                    <div className="pt-2 space-y-1.5">
                      {rubric.scoringGuide.map((sg, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-start gap-2 bg-white p-2 rounded-lg border border-slate-200/80"
                        >
                          <span className="font-bold text-blue-700 w-14 shrink-0">
                            Skor {sg.score} :
                          </span>
                          <span className="text-slate-700">{sg.description}</span>
                        </div>
                      ))}
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
