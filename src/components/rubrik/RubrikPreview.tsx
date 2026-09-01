'use client';

import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Printer,
  Share2,
  Sparkles,
  FileText,
  ListChecks,
  Award,
  BookOpen,
  CheckCircle2,
  TableProperties,
  ArrowLeft,
  ChevronRight,
  Info,
  Calendar,
  School,
  User,
  ExternalLink,
} from 'lucide-react';
import { KisiKisiRubrikData } from '@/types/rubrik';
import { exportKisiKisiRubrikToDocx } from '@/lib/docx-rubrik';
import { trackEvent } from '@/lib/analytics';

interface RubrikPreviewProps {
  data: KisiKisiRubrikData;
  onReset?: () => void;
  isPermalinkView?: boolean;
}

type TabKey = 'overview' | 'kisi-kisi' | 'rubrik-analitik' | 'pedoman-penskoran' | 'kktp' | 'lembar-siswa';

export const RubrikPreview: React.FC<RubrikPreviewProps> = ({
  data,
  onReset,
  isPermalinkView = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [isExporting, setIsExporting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [filterBentuk, setFilterBentuk] = useState<string>('all');

  const { identitas, ringkasanKisiKisi, kisiKisi, rubrikAnalitik, rubrikHolistik, pedomanPenskoran, intervalKktp, lembarPenilaianSiswa } = data;

  const handleExportDocx = async () => {
    setIsExporting(true);
    try {
      await exportKisiKisiRubrikToDocx(data);
      trackEvent('export_rubrik_docx', {
        subject: identitas.mataPelajaran,
        grade: identitas.kelas,
      });
    } catch (e) {
      console.error('Failed to export DOCX:', e);
      alert('Gagal mengekspor dokumen Word. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyMarkdown = () => {
    let md = `# KISI-KISI PENULISAN SOAL & RUBRIK PENILAIAN\n`;
    md += `**Satuan Pendidikan**: ${identitas.namaSekolah}\n`;
    md += `**Mata Pelajaran**: ${identitas.mataPelajaran} | **Kelas/Fase**: ${identitas.kelas} (${identitas.fase})\n`;
    md += `**Jenis Asesmen**: ${identitas.jenisAsesmenLabel} | **Alokasi Waktu**: ${identitas.alokasiWaktu}\n`;
    md += `**Materi Pokok**: ${identitas.topikMateri}\n\n`;

    md += `## I. MATRIKS KISI-KISI SOAL\n`;
    md += `| No | Capaian Pembelajaran / KD | Materi | Indikator Soal | Level | Bentuk | No. Soal |\n`;
    md += `|---|---|---|---|---|---|---|\n`;
    (kisiKisi || []).forEach((k) => {
      md += `| ${k.no} | ${k.kdOrCp} | ${k.materi} | ${k.indikatorSoal} | ${k.levelKognitif} | ${k.bentukSoal} | ${k.nomorSoal} |\n`;
    });

    if (rubrikAnalitik && rubrikAnalitik.length > 0) {
      md += `\n## II. RUBRIK PENILAIAN ANALITIK\n`;
      rubrikAnalitik.forEach((r) => {
        md += `### Aspek: ${r.aspect} (Bobot: ${r.weight || 0}%)\n`;
        r.levels.forEach((l) => {
          md += `- **${l.title} (${l.scoreRange})**: ${l.descriptor}\n`;
        });
      });
    }

    if (intervalKktp && intervalKktp.length > 0) {
      md += `\n## III. KRITERIA KKTP & TINDAK LANJUT\n`;
      md += `| Interval Nilai | Kategori | Intervensi Tindak Lanjut |\n`;
      md += `|---|---|---|\n`;
      intervalKktp.forEach((it) => {
        md += `| ${it.interval} | ${it.kategori} | ${it.intervensi} |\n`;
      });
    }

    navigator.clipboard.writeText(md).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredKisiKisi = (kisiKisi || []).filter((item) => {
    if (filterBentuk === 'all') return true;
    return item.bentukSoal.toLowerCase().includes(filterBentuk.toLowerCase());
  });

  const availableBentukSoal = Array.from(new Set((kisiKisi || []).map((k) => k.bentukSoal)));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Action Bar & Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="p-2.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Kembali ke Form"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {identitas.jenisAsesmenLabel}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Kelas {identitas.kelas} ({identitas.fase})
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
              {identitas.mataPelajaran} - {identitas.topikMateri}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'Tersalin!' : 'Salin Teks'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak</span>
          </button>

          <button
            type="button"
            onClick={handleExportDocx}
            disabled={isExporting}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Mengekspor...' : 'Unduh MS Word (.docx)'}</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 print:hidden">
        {[
          { key: 'overview', label: 'Ringkasan & Dokumen Lengkap', icon: FileText },
          { key: 'kisi-kisi', label: `Matriks Kisi-Kisi (${kisiKisi?.length || 0})`, icon: ListChecks },
          { key: 'rubrik-analitik', label: `Rubrik Analitik (${rubrikAnalitik?.length || 0})`, icon: Award },
          { key: 'pedoman-penskoran', label: `Pedoman Penskoran (${pedomanPenskoran?.length || 0})`, icon: CheckCircle2 },
          { key: 'kktp', label: 'Interval KKTP', icon: TableProperties },
          { key: 'lembar-siswa', label: 'Lembar Nilai Siswa', icon: User },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: OVERVIEW & FULL DOCUMENT ================= */}
      {(activeTab === 'overview' || typeof window === 'undefined') && (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 print:hidden">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
              <span className="text-[11px] font-bold text-blue-700">Total Butir Soal</span>
              <div className="text-2xl font-extrabold text-blue-900 mt-1">{ringkasanKisiKisi?.totalSoal || kisiKisi?.length || 0}</div>
              <span className="text-[10px] text-blue-600">Terdistribusi berjenjang</span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
              <span className="text-[11px] font-bold text-indigo-700">Level Kognitif</span>
              <div className="text-xs font-bold text-indigo-900 mt-1 space-y-0.5">
                <div>LOTS: {ringkasanKisiKisi?.distribusiLevel?.lots || 30}%</div>
                <div>MOTS: {ringkasanKisiKisi?.distribusiLevel?.mots || 40}% • HOTS: {ringkasanKisiKisi?.distribusiLevel?.hots || 30}%</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
              <span className="text-[11px] font-bold text-purple-700">Aspek Rubrik</span>
              <div className="text-2xl font-extrabold text-purple-900 mt-1">{rubrikAnalitik?.length || 0}</div>
              <span className="text-[10px] text-purple-600">Kriteria Analitik 4 Skala</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-[11px] font-bold text-emerald-700">Alokasi Waktu</span>
              <div className="text-lg font-extrabold text-emerald-900 mt-1">{identitas.alokasiWaktu || '90 Menit'}</div>
              <span className="text-[10px] text-emerald-600">Sesuai jam pelajaran</span>
            </div>
          </div>

          {/* Printable Document Container */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm print:border-none print:shadow-none print:p-0">
            {/* Kop Surat */}
            <div className="text-center pb-4 mb-6 border-b-4 border-double border-slate-900">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-wider">
                {identitas.namaSekolah ? identitas.namaSekolah.toUpperCase() : 'SATUAN PENDIDIKAN'}
              </h2>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 mt-0.5">
                KISI-KISI PENULISAN SOAL & RUBRIK PENILAIAN ASESMEN
              </h1>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">
                TAHUN AJARAN {identitas.tahunAjaran || '2024/2025'} - SEMESTER {(identitas.semester || 'GANJIL').toUpperCase()}
              </p>
            </div>

            {/* Identitas Info Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs mb-6 pb-4 border-b border-slate-200">
              <div className="space-y-1">
                <div className="flex"><span className="w-32 font-bold text-slate-600">Mata Pelajaran</span><span>: {identitas.mataPelajaran}</span></div>
                <div className="flex"><span className="w-32 font-bold text-slate-600">Kelas / Fase</span><span>: Kelas {identitas.kelas} ({identitas.fase})</span></div>
                <div className="flex"><span className="w-32 font-bold text-slate-600">Kurikulum</span><span>: {identitas.kurikulum === 'merdeka' ? 'Kurikulum Merdeka' : 'Kurikulum 2013'}</span></div>
                <div className="flex"><span className="w-32 font-bold text-slate-600">Materi Pokok</span><span>: {identitas.topikMateri}</span></div>
              </div>
              <div className="space-y-1">
                <div className="flex"><span className="w-32 font-bold text-slate-600">Jenis Asesmen</span><span>: {identitas.jenisAsesmenLabel}</span></div>
                <div className="flex"><span className="w-32 font-bold text-slate-600">Alokasi Waktu</span><span>: {identitas.alokasiWaktu}</span></div>
                <div className="flex"><span className="w-32 font-bold text-slate-600">Jumlah Soal</span><span>: {identitas.jumlahSoal || kisiKisi?.length || 0} Butir</span></div>
                <div className="flex"><span className="w-32 font-bold text-slate-600">Guru Pengampu</span><span>: {identitas.namaGuru}</span></div>
              </div>
            </div>

            {/* Bagian I: Matriks Kisi-Kisi */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs">I</span>
                  MATRIKS KISI-KISI PENULISAN SOAL
                </h3>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100/90 text-slate-800 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5 text-center w-10 border-r border-slate-200">No</th>
                      <th className="p-2.5 border-r border-slate-200 min-w-[140px]">Capaian / KD</th>
                      <th className="p-2.5 border-r border-slate-200 min-w-[120px]">Materi Pokok</th>
                      <th className="p-2.5 border-r border-slate-200 min-w-[200px]">Indikator Soal (ABCD)</th>
                      <th className="p-2.5 text-center border-r border-slate-200 w-24">Level</th>
                      <th className="p-2.5 text-center border-r border-slate-200 w-24">Bentuk</th>
                      <th className="p-2.5 text-center w-16">No. Soal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {(kisiKisi || []).map((k, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="p-2.5 text-center font-bold border-r border-slate-200">{k.no || idx + 1}</td>
                        <td className="p-2.5 border-r border-slate-200 leading-relaxed text-slate-700">{k.kdOrCp}</td>
                        <td className="p-2.5 border-r border-slate-200 font-medium text-slate-800">
                          <div>{k.materi}</div>
                          {k.subMateri && <div className="text-[11px] text-slate-500 font-normal">({k.subMateri})</div>}
                        </td>
                        <td className="p-2.5 border-r border-slate-200 leading-relaxed text-slate-700">{k.indikatorSoal}</td>
                        <td className="p-2.5 text-center border-r border-slate-200">
                          <span className="font-bold text-[11px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {k.levelKognitif}
                          </span>
                        </td>
                        <td className="p-2.5 text-center border-r border-slate-200 text-slate-600 font-medium">{k.bentukSoal}</td>
                        <td className="p-2.5 text-center font-extrabold text-slate-800">{k.nomorSoal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bagian II: Rubrik Analitik */}
            {rubrikAnalitik && rubrikAnalitik.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs">II</span>
                  RUBRIK PENILAIAN ANALITIK
                </h3>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-100/90 text-slate-800 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5 border-r border-slate-200 min-w-[140px]">Aspek / Kriteria</th>
                        <th className="p-2.5 border-r border-slate-200 min-w-[150px] bg-blue-50/50 text-blue-900">Sangat Baik (4)</th>
                        <th className="p-2.5 border-r border-slate-200 min-w-[150px] bg-emerald-50/50 text-emerald-900">Baik (3)</th>
                        <th className="p-2.5 border-r border-slate-200 min-w-[150px] bg-amber-50/50 text-amber-900">Cukup (2)</th>
                        <th className="p-2.5 min-w-[150px] bg-red-50/50 text-red-900">Perlu Bimbingan (1)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {rubrikAnalitik.map((crit, idx) => {
                        const l4 = crit.levels?.find((l) => l.level === 4) || crit.levels?.[0];
                        const l3 = crit.levels?.find((l) => l.level === 3) || crit.levels?.[1];
                        const l2 = crit.levels?.find((l) => l.level === 2) || crit.levels?.[2];
                        const l1 = crit.levels?.find((l) => l.level === 1) || crit.levels?.[3];

                        return (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                            <td className="p-2.5 border-r border-slate-200 font-bold text-slate-800 align-top">
                              <div>{crit.aspect}</div>
                              {crit.weight && <div className="text-[11px] text-blue-600 font-normal mt-0.5">Bobot: {crit.weight}%</div>}
                            </td>
                            <td className="p-2.5 border-r border-slate-200 text-slate-700 leading-relaxed align-top">
                              {l4?.descriptor}
                            </td>
                            <td className="p-2.5 border-r border-slate-200 text-slate-700 leading-relaxed align-top">
                              {l3?.descriptor}
                            </td>
                            <td className="p-2.5 border-r border-slate-200 text-slate-700 leading-relaxed align-top">
                              {l2?.descriptor}
                            </td>
                            <td className="p-2.5 text-slate-700 leading-relaxed align-top">
                              {l1?.descriptor}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bagian III: Pedoman Penskoran */}
            {pedomanPenskoran && pedomanPenskoran.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-lg bg-purple-600 text-white flex items-center justify-center text-xs">III</span>
                  PEDOMAN PENSKORAN & KUNCI JAWABAN
                </h3>

                <div className="space-y-3">
                  {pedomanPenskoran.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center">
                            {item.nomorSoal}
                          </span>
                          <span className="text-xs font-bold text-slate-800">{item.indikator}</span>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                          Skor Maks: {item.skorMaksimal}
                        </span>
                      </div>

                      <div className="text-xs text-slate-700 space-y-2 mt-2">
                        {item.kunciJawaban && (
                          <div>
                            <strong className="text-slate-900">Kunci Jawaban: </strong>
                            <span>{item.kunciJawaban}</span>
                          </div>
                        )}

                        {Array.isArray(item.langkahPenyelesaian) && item.langkahPenyelesaian.length > 0 && (
                          <div className="bg-white p-3 rounded-lg border border-slate-200/80">
                            <strong className="text-slate-800 block mb-1.5 text-[11px]">Rincian Langkah Penskoran:</strong>
                            <ul className="space-y-1">
                              {item.langkahPenyelesaian.map((st, sIdx) => {
                                if (typeof st === 'object' && st !== null && 'step' in st) {
                                  return (
                                    <li key={sIdx} className="flex items-center justify-between text-slate-600">
                                      <span>• {st.step}</span>
                                      <span className="font-bold text-blue-600">(Skor {st.points})</span>
                                    </li>
                                  );
                                }
                                return <li key={sIdx} className="text-slate-600">• {String(st)}</li>;
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bagian IV: Interval KKTP */}
            {intervalKktp && intervalKktp.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs">IV</span>
                  KRITERIA KETERCAPAIAN TUJUAN PEMBELAJARAN (KKTP) & TINDAK LANJUT
                </h3>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-slate-100/90 text-slate-800 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5 text-center border-r border-slate-200 w-28">Interval Nilai</th>
                        <th className="p-2.5 border-r border-slate-200 w-44">Kategori Ketercapaian</th>
                        <th className="p-2.5">Rencana Intervensi / Tindak Lanjut Guru</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {intervalKktp.map((it, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}>
                          <td className="p-2.5 text-center font-bold text-blue-800 border-r border-slate-200 bg-blue-50/30">
                            {it.interval}
                          </td>
                          <td className="p-2.5 font-bold text-slate-800 border-r border-slate-200">
                            {it.kategori}
                          </td>
                          <td className="p-2.5 text-slate-700 leading-relaxed">
                            {it.intervensi}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tanda Tangan */}
            <div className="grid grid-cols-2 gap-8 text-center text-xs pt-8 mt-8 border-t border-slate-200">
              <div>
                <p className="text-slate-600">Mengetahui,</p>
                <p className="font-bold text-slate-800 mt-0.5">Kepala Satuan Pendidikan</p>
                <div className="h-20" />
                <p className="font-bold text-slate-900 underline">{identitas.namaKepalaSekolah || '................................................'}</p>
                <p className="text-slate-500">NIP. {identitas.nipKepalaSekolah || '........................................'}</p>
              </div>

              <div>
                <p className="text-slate-600">
                  {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
                <p className="font-bold text-slate-800 mt-0.5">Guru Mata Pelajaran</p>
                <div className="h-20" />
                <p className="font-bold text-slate-900 underline">{identitas.namaGuru || '................................................'}</p>
                <p className="text-slate-500">NIP. {identitas.nipGuru || '........................................'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: MATRIKS KISI-KISI DETAIL ================= */}
      {activeTab === 'kisi-kisi' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Matriks Kisi-Kisi Penulisan Soal</h2>
              <p className="text-xs text-slate-500">Kaidah penyusunan indikator soal (ABCD) dan level kognitif</p>
            </div>

            {/* Filter Bentuk Soal */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Bentuk:</span>
              <select
                value={filterBentuk}
                onChange={(e) => setFilterBentuk(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:border-blue-500"
              >
                <option value="all">Semua Bentuk ({kisiKisi?.length || 0})</option>
                {availableBentukSoal.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredKisiKisi.map((k, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-blue-300 transition-all shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                      #{k.nomorSoal}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-blue-100 text-blue-800">
                      {k.bentukSoal}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-purple-100 text-purple-800">
                      {k.levelKognitif}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    Bobot: {k.bobotSkor || 1} Poin
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Capaian / KD</span>
                    <p className="text-slate-800 font-medium leading-relaxed">{k.kdOrCp}</p>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Materi Pokok</span>
                    <p className="text-slate-800 font-bold">{k.materi}</p>
                    {k.subMateri && <p className="text-slate-500 text-[11px]">Sub: {k.subMateri}</p>}
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block mb-1">Rumusan Indikator Soal (ABCD)</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{k.indikatorSoal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 3: RUBRIK ANALITIK ================= */}
      {activeTab === 'rubrik-analitik' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Rubrik Penilaian Analitik (4 Tingkatan Capaian)</h2>
            <p className="text-xs text-slate-500">Deskriptor kualitatif terukur untuk memandu umpan balik pembelajaran</p>
          </div>

          <div className="space-y-6">
            {(rubrikAnalitik || []).map((crit, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 p-4 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/10 text-white flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">{crit.aspect}</h3>
                      {crit.weight && <span className="text-[11px] text-blue-300">Bobot Penilaian: {crit.weight}%</span>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 p-4 bg-slate-50/30 gap-4">
                  {crit.levels.map((lvl) => (
                    <div key={lvl.level} className="space-y-2 p-3 bg-white rounded-xl border border-slate-100 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          lvl.level === 4
                            ? 'bg-blue-100 text-blue-800'
                            : lvl.level === 3
                            ? 'bg-emerald-100 text-emerald-800'
                            : lvl.level === 2
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {lvl.title}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">{lvl.scoreRange}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{lvl.descriptor}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: PEDOMAN PENSKORAN ================= */}
      {activeTab === 'pedoman-penskoran' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Pedoman Penskoran & Kunci Jawaban</h2>
            <p className="text-xs text-slate-500">Panduan koreksi objektif langkah demi langkah untuk butir soal</p>
          </div>

          <div className="space-y-4">
            {(pedomanPenskoran || []).map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                      #{item.nomorSoal}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{item.indikator}</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                    Skor Maksimal: {item.skorMaksimal}
                  </span>
                </div>

                {item.kunciJawaban && (
                  <div className="bg-slate-50 p-3.5 rounded-xl text-xs text-slate-800">
                    <span className="font-bold text-slate-900 block mb-1 text-[11px] uppercase tracking-wider text-purple-700">Kunci Jawaban / Kriteria</span>
                    <p className="leading-relaxed">{item.kunciJawaban}</p>
                  </div>
                )}

                {Array.isArray(item.langkahPenyelesaian) && item.langkahPenyelesaian.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Rincian Pembobotan Langkah:</span>
                    <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 overflow-hidden">
                      {item.langkahPenyelesaian.map((st, sIdx) => {
                        if (typeof st === 'object' && st !== null && 'step' in st) {
                          return (
                            <div key={sIdx} className="p-2.5 bg-white text-xs flex items-center justify-between">
                              <span className="text-slate-700">• {st.step}</span>
                              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-[11px]">+{st.points} Poin</span>
                            </div>
                          );
                        }
                        return (
                          <div key={sIdx} className="p-2.5 bg-white text-xs text-slate-700">
                            • {String(st)}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: INTERVAL KKTP ================= */}
      {activeTab === 'kktp' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) & Rencana Tindak Lanjut</h2>
            <p className="text-xs text-slate-500">Pedoman tindak lanjut pembelajaran berdiferensiasi (Remedial & Pengayaan)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(intervalKktp || []).map((it, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-blue-700 bg-blue-100/70 px-2.5 py-1 rounded-xl">
                    Interval: {it.interval}
                  </span>
                  <span className="text-xs font-bold text-slate-800">{it.kategori}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-bold text-emerald-700 block mb-1">Rencana Intervensi Guru:</span>
                  <p className="text-xs text-slate-700 leading-relaxed">{it.intervensi}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 6: LEMBAR NILAI SISWA ================= */}
      {activeTab === 'lembar-siswa' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Format Lembar Rekap Penilaian Siswa</h2>
              <p className="text-xs text-slate-500">Blangko tabel penilaian siswa yang siap dicetak dan diisi guru di kelas</p>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Blangko</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-slate-900 text-white font-bold">
                <tr>
                  <th className="p-3 text-center w-12 border-r border-slate-800">No</th>
                  <th className="p-3 border-r border-slate-800 min-w-[200px]">Nama Peserta Didik</th>
                  <th className="p-3 text-center border-r border-slate-800 w-24">Krit. 1</th>
                  <th className="p-3 text-center border-r border-slate-800 w-24">Krit. 2</th>
                  <th className="p-3 text-center border-r border-slate-800 w-24">Krit. 3</th>
                  <th className="p-3 text-center border-r border-slate-800 w-24">Krit. 4</th>
                  <th className="p-3 text-center border-r border-slate-800 w-24">Total Skor</th>
                  <th className="p-3 text-center border-r border-slate-800 w-24">Nilai Akhir</th>
                  <th className="p-3 text-center min-w-[140px]">Ketercapaian / Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {Array.from({ length: 10 }, (_, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="p-3 text-center font-bold border-r border-slate-200 text-slate-400">{i + 1}</td>
                    <td className="p-3 border-r border-slate-200 text-slate-400"></td>
                    <td className="p-3 border-r border-slate-200 text-center"></td>
                    <td className="p-3 border-r border-slate-200 text-center"></td>
                    <td className="p-3 border-r border-slate-200 text-center"></td>
                    <td className="p-3 border-r border-slate-200 text-center"></td>
                    <td className="p-3 border-r border-slate-200 text-center font-bold"></td>
                    <td className="p-3 border-r border-slate-200 text-center font-bold"></td>
                    <td className="p-3 text-center"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
