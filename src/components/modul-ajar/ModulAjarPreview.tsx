'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ModulAjarData } from '@/types/modul-ajar';
import { exportModulAjarToDocx } from '@/lib/modul-ajar-docx';
import { trackEvent } from '@/lib/analytics';
import {
  Download,
  Printer,
  Copy,
  Check,
  FileText,
  Clock,
  BookOpen,
  CheckCircle2,
  Share2,
  Sparkles,
  Layers,
  Edit3,
  Save,
  HelpCircle,
  Award,
  ListChecks,
  Compass,
  FileQuestion,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

interface ModulAjarPreviewProps {
  modul: ModulAjarData;
  onUpdateModul?: (updated: ModulAjarData) => void;
  onReset?: () => void;
  shareUrl?: string;
}

type ActiveTab = 'dokumen' | 'skenario' | 'asesmen' | 'lkpd';

export const ModulAjarPreview: React.FC<ModulAjarPreviewProps> = ({
  modul,
  onUpdateModul,
  onReset,
  shareUrl,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dokumen');
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedModul, setEditedModul] = useState<ModulAjarData>(modul);

  const isK13 = modul.format === 'rpp_1_lembar';
  const docTitle = isK13
    ? 'RENCANA PELAKSANAAN PEMBELAJARAN (RPP 1 LEMBAR)'
    : modul.format === 'rpp_berdiferensiasi'
    ? 'MODUL AJAR PEMBELAJARAN BERDIFERENSIASI'
    : 'MODUL AJAR KURIKULUM MERDEKA';

  const handleExportDocx = async () => {
    setIsExporting(true);
    try {
      trackEvent('download_docx_modul_ajar', {
        subject: modul.identitas?.mataPelajaran || '',
        grade: modul.identitas?.faseKelas || '',
        format: modul.format || '',
      });
      await exportModulAjarToDocx(isEditing ? editedModul : modul);
    } catch (err) {
      console.error('Failed to export docx:', err);
      alert('Gagal mengunduh dokumen Word. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    trackEvent('print_modul_ajar', {
      subject: modul.identitas?.mataPelajaran || '',
    });
    window.print();
  };

  const handleCopyText = () => {
    const textToCopy = `
${modul.identitas?.namaSekolah || 'SATUAN PENDIDIKAN'}
${docTitle}
TAHUN AJARAN ${modul.identitas?.tahunAjaran || ''} - SEMESTER ${modul.identitas?.semester || ''}

I. INFORMASI UMUM
- Nama Penyusun: ${modul.identitas?.namaPenyusun || ''} (NIP: ${modul.identitas?.nipPenyusun || '-'})
- Mata Pelajaran: ${modul.identitas?.mataPelajaran || ''}
- Fase / Kelas: ${modul.identitas?.faseKelas || ''}
- Alokasi Waktu: ${modul.identitas?.alokasiWaktu || ''}
- Topik Materi: ${modul.identitas?.topikMateri || ''}
- Profil Pelajar Pancasila: ${(modul.profilPelajarPancasila || []).join(', ')}
- Model Pembelajaran: ${modul.modelPembelajaran?.model || ''}

II. KOMPONEN INTI
- Capaian Pembelajaran: ${modul.komponenInti?.capaianPembelajaran || ''}
- Tujuan Pembelajaran:
${(modul.komponenInti?.tujuanPembelajaran || []).map((tp, i) => `  ${i + 1}. ${tp}`).join('\n')}
- Pemahaman Bermakna:
${(modul.komponenInti?.pemahamanBermakna || []).map((pb) => `  • ${pb}`).join('\n')}
- Pertanyaan Pemantik:
${(modul.komponenInti?.pertanyaanPemantik || []).map((pp, i) => `  ${i + 1}. ${pp}`).join('\n')}

III. KEGIATAN PEMBELAJARAN
${(modul.kegiatanPembelajaran || [])
  .map(
    (k) => `
[Pertemuan ${k.pertemuan} - ${k.alokasiWaktu}]
A. Pendahuluan (${k.pendahuluan?.alokasiMenit || 10} Menit):
${(k.pendahuluan?.langkah || []).map((l) => `  • ${l}`).join('\n')}

B. Inti (${k.inti?.alokasiMenit || 50} Menit):
${(k.inti?.sintaks || [])
  .map((s) => `  * ${s.tahap}\n    Guru: ${s.aktivitasGuru}\n    Siswa: ${s.aktivitasSiswa}`)
  .join('\n')}

C. Penutup (${k.penutup?.alokasiMenit || 10} Menit):
${(k.penutup?.langkah || []).map((l) => `  • ${l}`).join('\n')}
`
  )
  .join('\n')}

IV. ASESMEN & KKTP
- Diagnostik: ${modul.asesmen?.diagnostik?.teknik || ''}
- Formatif: ${modul.asesmen?.formatif?.teknik || ''}
- Sumatif: ${modul.asesmen?.sumatif?.teknik || ''}

Mengetahui,
Kepala Sekolah: ${modul.identitas?.kepalaSekolah?.nama || ''} (NIP: ${modul.identitas?.kepalaSekolah?.nip || '-'})
Guru Pengampu: ${modul.identitas?.namaPenyusun || ''} (NIP: ${modul.identitas?.nipPenyusun || '-'})
    `.trim();

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(window.location.origin + shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleSaveEdits = () => {
    if (onUpdateModul) {
      onUpdateModul(editedModul);
    }
    setIsEditing(false);
  };

  const currentModul = isEditing ? editedModul : modul;

  // Cross-tool deep link to Soal Generator with matching subject, grade, and topic
  const soalGeneratorUrl = `/tools/soal-generator?fromModul=true&schoolName=${encodeURIComponent(
    modul.identitas?.namaSekolah || ''
  )}&level=${encodeURIComponent(
    modul.identitas?.jenjang?.toLowerCase() || ''
  )}&grade=${encodeURIComponent(
    modul.identitas?.faseKelas || ''
  )}&subject=${encodeURIComponent(
    modul.identitas?.mataPelajaran || ''
  )}&curriculum=${encodeURIComponent(
    modul.format === 'rpp_1_lembar' ? 'k13' : 'merdeka'
  )}&topic=${encodeURIComponent(
    modul.identitas?.topikMateri || ''
  )}&subTopic=${encodeURIComponent(
    modul.komponenInti?.tujuanPembelajaran?.[0] || ''
  )}`;

  return (
    <div className="space-y-6">
      {/* Cross-Tool Connection Recommendation Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 print:hidden animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
            <FileQuestion className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider block">
              Integrasi Evaluasi & Asesmen Guru Cerdas
            </span>
            <h3 className="font-bold text-sm sm:text-base text-white">
              Ingin membuat Paket Soal Ujian / Kuis untuk materi &quot;{modul.identitas?.topikMateri || modul.identitas?.mataPelajaran}&quot;?
            </h3>
            <p className="text-xs text-blue-100/90 hidden sm:block">
              Buat naskah soal PG, Isian, Essay, kisi-kisi, dan kunci jawaban otomatis yang selaras dengan tujuan modul ajar ini.
            </p>
          </div>
        </div>

        <Link
          href={soalGeneratorUrl}
          className="min-h-[42px] inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-blue-50 active:bg-blue-100 text-blue-900 font-bold text-xs sm:text-sm shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Buat Paket Soal untuk Modul Ini</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ACTION BAR (Hidden on Print) */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 print:hidden">
        {/* Left Badges */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 truncate max-w-[200px] sm:max-w-none">
                {currentModul.identitas?.topikMateri || 'Modul Ajar Siap Pakai'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                Resmi Kemendikbud
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate">
              {currentModul.identitas?.mataPelajaran} • {currentModul.identitas?.faseKelas} • {currentModul.identitas?.alokasiWaktu}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2">
          {/* Download Word (Primary Prominent Button) */}
          <button
            type="button"
            onClick={handleExportDocx}
            disabled={isExporting}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow transition-all cursor-pointer"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>Unduh Word (.docx)</span>
          </button>

          {/* Secondary Buttons Grid on Mobile */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
            {/* Print PDF */}
            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-semibold border border-slate-200 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Cetak PDF</span>
            </button>

            {/* Copy Text */}
            <button
              type="button"
              onClick={handleCopyText}
              className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-xs font-semibold border border-slate-200 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>

            {/* Share */}
            {shareUrl && (
              <button
                type="button"
                onClick={handleShare}
                className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 active:bg-purple-200 text-purple-700 text-xs font-semibold border border-purple-200 transition-all cursor-pointer"
              >
                {copiedShare ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-purple-600" />}
                <span>{copiedShare ? 'Tersalin!' : 'Bagikan'}</span>
              </button>
            )}

            {/* Quick Edit Toggle */}
            {onUpdateModul && (
              <button
                type="button"
                onClick={() => {
                  if (isEditing) {
                    handleSaveEdits();
                  } else {
                    setIsEditing(true);
                  }
                }}
                className={`min-h-[42px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isEditing
                    ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4 text-slate-500" />}
                <span>{isEditing ? 'Simpan' : 'Edit Cepat'}</span>
              </button>
            )}

            {/* Reset / Baru Button */}
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                className="min-h-[42px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-xs transition-colors cursor-pointer"
                title="Buat Modul Ajar Baru"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Baru</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION (Hidden on Print) */}
      <div className="flex border-b border-slate-200 gap-1.5 sm:gap-2 print:hidden overflow-x-auto pb-1 no-scrollbar scroll-smooth">
        <button
          type="button"
          onClick={() => setActiveTab('dokumen')}
          className={`min-h-[44px] flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-t-2xl text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'dokumen'
              ? 'border-blue-600 text-blue-600 bg-blue-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Dokumen Modul</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('skenario')}
          className={`min-h-[44px] flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-t-2xl text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'skenario'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Skenario Mengajar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('asesmen')}
          className={`min-h-[44px] flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-t-2xl text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'asesmen'
              ? 'border-purple-600 text-purple-600 bg-purple-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Asesmen & KKTP</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lkpd')}
          className={`min-h-[44px] flex items-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-t-2xl text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'lkpd'
              ? 'border-emerald-600 text-emerald-600 bg-emerald-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ListChecks className="w-4 h-4" />
          <span>LKPD Siswa</span>
        </button>
      </div>

      {/* TAB 1: DOKUMEN RESMI MODUL (Formal Document View) */}
      {(activeTab === 'dokumen' || typeof window === 'undefined') && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-8 print:shadow-none print:border-none print:p-0">
          {/* KOP RESMI */}
          <div className="text-center space-y-1.5 pb-4 border-b-4 border-double border-slate-900">
            <h1 className="font-extrabold text-base sm:text-xl uppercase tracking-wider text-slate-900 font-serif">
              {currentModul.identitas?.namaSekolah || 'SATUAN PENDIDIKAN'}
            </h1>
            <h2 className="font-bold text-sm sm:text-base uppercase text-blue-900 font-serif">
              {docTitle}
            </h2>
            <p className="text-xs font-semibold text-slate-700 font-serif">
              TAHUN AJARAN {currentModul.identitas?.tahunAjaran || '2025/2026'} — SEMESTER {currentModul.identitas?.semester || 'GANJIL'}
            </p>
          </div>

          {/* I. INFORMASI UMUM */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 uppercase border-b border-slate-200 pb-1">
              I. INFORMASI UMUM
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-800">
              <div className="flex">
                <span className="w-36 text-slate-500 font-medium shrink-0">Nama Penyusun</span>
                <span className="font-semibold">: {currentModul.identitas?.namaPenyusun}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-slate-500 font-medium shrink-0">Satuan Pendidikan</span>
                <span className="font-semibold">: {currentModul.identitas?.namaSekolah}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-slate-500 font-medium shrink-0">Jenjang / Fase / Kelas</span>
                <span className="font-semibold">: {currentModul.identitas?.jenjang} / {currentModul.identitas?.faseKelas}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-slate-500 font-medium shrink-0">Mata Pelajaran</span>
                <span className="font-semibold">: {currentModul.identitas?.mataPelajaran}</span>
              </div>
              <div className="flex">
                <span className="w-36 text-slate-500 font-medium shrink-0">Alokasi Waktu</span>
                <span className="font-semibold">: {currentModul.identitas?.alokasiWaktu} ({currentModul.identitas?.jumlahPertemuan || 1} Pertemuan)</span>
              </div>
              <div className="flex">
                <span className="w-36 text-slate-500 font-medium shrink-0">Topik / Materi</span>
                <span className="font-semibold text-blue-700">: {currentModul.identitas?.topikMateri}</span>
              </div>
            </div>

            {/* P5 & Model */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2 text-xs sm:text-sm">
              <div>
                <strong className="text-slate-900">Dimensi Profil Pelajar Pancasila: </strong>
                <span className="text-slate-700">{(currentModul.profilPelajarPancasila || []).join(' • ')}</span>
              </div>
              <div>
                <strong className="text-slate-900">Model & Metode Pembelajaran: </strong>
                <span className="text-slate-700">
                  {currentModul.modelPembelajaran?.model} ({currentModul.modelPembelajaran?.metode?.join(', ')})
                </span>
              </div>
              {currentModul.targetPesertaDidik && (
                <div>
                  <strong className="text-slate-900">Target Peserta Didik: </strong>
                  <span className="text-slate-700">{currentModul.targetPesertaDidik}</span>
                </div>
              )}
            </div>
          </div>

          {/* II. KOMPONEN INTI */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 uppercase border-b border-slate-200 pb-1">
              II. KOMPONEN INTI
            </h3>

            {/* Capaian Pembelajaran */}
            {currentModul.komponenInti?.capaianPembelajaran && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase text-slate-600">A. Capaian Pembelajaran (CP)</h4>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-blue-50/40 p-3 rounded-xl border border-blue-100">
                  {currentModul.komponenInti.capaianPembelajaran}
                </p>
              </div>
            )}

            {/* Tujuan Pembelajaran */}
            {currentModul.komponenInti?.tujuanPembelajaran && currentModul.komponenInti.tujuanPembelajaran.length > 0 && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase text-slate-600">B. Tujuan Pembelajaran (TP)</h4>
                <ul className="list-decimal list-inside space-y-1 text-xs sm:text-sm text-slate-800">
                  {currentModul.komponenInti.tujuanPembelajaran.map((tp, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {tp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pemahaman Bermakna & Pertanyaan Pemantik */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-200/60 space-y-1.5">
                <h4 className="text-xs font-bold uppercase text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Pemahaman Bermakna
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-800">
                  {(currentModul.komponenInti?.pemahamanBermakna || []).map((pb, i) => (
                    <li key={i}>{pb}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-200/60 space-y-1.5">
                <h4 className="text-xs font-bold uppercase text-indigo-900 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                  Pertanyaan Pemantik
                </h4>
                <ul className="list-decimal list-inside space-y-1 text-xs text-slate-800">
                  {(currentModul.komponenInti?.pertanyaanPemantik || []).map((pp, i) => (
                    <li key={i}>{pp}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* III. KEGIATAN PEMBELAJARAN */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 uppercase border-b border-slate-200 pb-1">
              III. KEGIATAN PEMBELAJARAN
            </h3>

            {(currentModul.kegiatanPembelajaran || []).map((kegiatan) => (
              <div key={kegiatan.pertemuan} className="border border-slate-200 rounded-2xl overflow-hidden space-y-3">
                <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-xs sm:text-sm text-slate-900">
                    Pertemuan Ke-{kegiatan.pertemuan} ({kegiatan.alokasiWaktu})
                  </span>
                  {kegiatan.tujuanPertemuan && (
                    <span className="text-xs text-slate-600 italic hidden sm:inline">
                      {kegiatan.tujuanPertemuan}
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-4">
                  {/* Pendahuluan */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Kegiatan Pendahuluan</span>
                      <span className="text-slate-500 font-semibold">{kegiatan.pendahuluan?.alokasiMenit || 10} Menit</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-700 pl-1">
                      {(kegiatan.pendahuluan?.langkah || []).map((l, i) => (
                        <li key={i}>{l}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Inti (Sintaks) */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Kegiatan Inti ({currentModul.modelPembelajaran?.model || 'Sintaks'})</span>
                      <span className="text-slate-500 font-semibold">{kegiatan.inti?.alokasiMenit || 50} Menit</span>
                    </div>

                    <div className="space-y-2.5">
                      {(kegiatan.inti?.sintaks || []).map((st, idx) => (
                        <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/70 space-y-1 text-xs sm:text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{st.tahap}</span>
                            {st.fokusDiferensiasi && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                                {st.fokusDiferensiasi}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-700">
                            <strong className="text-slate-900">Guru: </strong>{st.aktivitasGuru}
                          </p>
                          <p className="text-slate-700">
                            <strong className="text-slate-900">Siswa: </strong>{st.aktivitasSiswa}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Penutup */}
                  <div className="space-y-1 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>Kegiatan Penutup</span>
                      <span className="text-slate-500 font-semibold">{kegiatan.penutup?.alokasiMenit || 10} Menit</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-slate-700 pl-1">
                      {(kegiatan.penutup?.langkah || []).map((l, i) => (
                        <li key={i}>{l}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* LEMBAR TANDA TANGAN PENGESAHAN */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-center text-xs sm:text-sm text-slate-800">
            <div className="space-y-1">
              <p>Mengetahui,</p>
              <p className="font-bold">Kepala Sekolah</p>
              <div className="h-14 sm:h-16" />
              <p className="font-bold underline">{currentModul.identitas?.kepalaSekolah?.nama || 'Kepala Sekolah'}</p>
              <p className="text-slate-500">NIP. {currentModul.identitas?.kepalaSekolah?.nip || '-'}</p>
            </div>
            <div className="space-y-1">
              <p>................, .................... 2026</p>
              <p className="font-bold">Guru Mata Pelajaran</p>
              <div className="h-14 sm:h-16" />
              <p className="font-bold underline">{currentModul.identitas?.namaPenyusun || 'Guru Pengampu'}</p>
              <p className="text-slate-500">NIP. {currentModul.identitas?.nipPenyusun || '-'}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SKENARIO MENGAJAR (TIMELINE VISUAL) */}
      {activeTab === 'skenario' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
                Alur Skenario Mengajar (Visual Timeline)
              </h3>
              <p className="text-xs text-slate-500">
                Panduan praktis waktu demi waktu saat Bapak/Ibu guru memandu kelas
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 self-start sm:self-auto">
              {currentModul.modelPembelajaran?.model || 'Model Pembelajaran Aktif'}
            </span>
          </div>

          {(currentModul.kegiatanPembelajaran || []).map((kegiatan) => (
            <div key={kegiatan.pertemuan} className="space-y-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-sm flex items-center justify-between">
                <span>Pertemuan Ke-{kegiatan.pertemuan}</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-lg">{kegiatan.alokasiWaktu}</span>
              </div>

              {/* Steps timeline */}
              <div className="relative pl-6 border-l-2 border-indigo-200 space-y-6">
                {/* 1. Pendahuluan */}
                <div className="relative space-y-2">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-amber-500 border-2 border-white shadow" />
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-bold">
                      0&apos; - {kegiatan.pendahuluan?.alokasiMenit || 10}&apos;
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">Kegiatan Pendahuluan</h4>
                  </div>
                  <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/50 text-xs text-slate-800 space-y-1">
                    {(kegiatan.pendahuluan?.langkah || []).map((l, i) => (
                      <p key={i}>• {l}</p>
                    ))}
                  </div>
                </div>

                {/* 2. Sintaks Inti */}
                {(kegiatan.inti?.sintaks || []).map((st, i) => (
                  <div key={i} className="relative space-y-2">
                    <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[11px] font-bold">
                          Step {i + 1}
                        </span>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-900">{st.tahap}</h4>
                      </div>
                      {st.fokusDiferensiasi && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 self-start sm:self-auto">
                          {st.fokusDiferensiasi}
                        </span>
                      )}
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1.5">
                      <p><strong className="text-blue-700">Guru: </strong>{st.aktivitasGuru}</p>
                      <p><strong className="text-indigo-700">Siswa: </strong>{st.aktivitasSiswa}</p>
                    </div>
                  </div>
                ))}

                {/* 3. Penutup */}
                <div className="relative space-y-2">
                  <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow" />
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      {kegiatan.penutup?.alokasiMenit || 10}&apos; Terakhir
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">Kegiatan Penutup & Refleksi</h4>
                  </div>
                  <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/50 text-xs text-slate-800 space-y-1">
                    {(kegiatan.penutup?.langkah || []).map((l, i) => (
                      <p key={i}>• {l}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: INSTRUMEN ASESMEN & KKTP */}
      {activeTab === 'asesmen' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              Instrumen Asesmen & Kriteria Ketercapaian (KKTP)
            </h3>
            <p className="text-xs text-slate-500">
              Pedoman evaluasi diagnostik, formatif, sumatif, dan tindak lanjut remedial/pengayaan
            </p>
          </div>

          {/* Diagnostik & Sumatif Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold uppercase text-slate-500">Asesmen Diagnostik (Awal)</span>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                {currentModul.asesmen?.diagnostik?.teknik} ({currentModul.asesmen?.diagnostik?.instrumen})
              </p>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                {(currentModul.asesmen?.diagnostik?.contohSoalPertanyaan || []).map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold uppercase text-slate-500">Asesmen Sumatif (Akhir)</span>
              <p className="text-xs sm:text-sm font-semibold text-slate-800">
                {currentModul.asesmen?.sumatif?.teknik} ({currentModul.asesmen?.sumatif?.bentukInstrumen})
              </p>
              <p className="text-xs text-slate-600">
                {currentModul.asesmen?.sumatif?.kisiKisiSingkat}
              </p>
            </div>
          </div>

          {/* Rubrik Formatif */}
          {currentModul.asesmen?.formatif?.rubrikAtauKriteria && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-slate-700">
                  Rubrik Penilaian Formatif (Kinerja & Aktivitas)
                </h4>
                <span className="text-[11px] text-slate-400 sm:hidden">👉 Geser tabel</span>
              </div>
              <div className="overflow-x-auto thin-scrollbar pb-2">
                <table className="w-full min-w-[580px] text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3 text-left w-1/4">Aspek</th>
                      <th className="p-3 text-left">Sangat Baik (4)</th>
                      <th className="p-3 text-left">Baik (3)</th>
                      <th className="p-3 text-left">Cukup (2)</th>
                      <th className="p-3 text-left">Perlu Bimbingan (1)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentModul.asesmen.formatif.rubrikAtauKriteria.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">{item.aspek}</td>
                        <td className="p-3 text-slate-700">{item.sangatBaik}</td>
                        <td className="p-3 text-slate-700">{item.baik}</td>
                        <td className="p-3 text-slate-700">{item.cukup}</td>
                        <td className="p-3 text-slate-700">{item.perluBimbingan}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* KKTP Interval */}
          {currentModul.asesmen?.kktp?.skalaInterval && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase text-slate-700">
                  Interval Nilai & Tindak Lanjut KKTP
                </h4>
                <span className="text-[11px] text-slate-400 sm:hidden">👉 Geser tabel</span>
              </div>
              <div className="overflow-x-auto thin-scrollbar pb-2">
                <table className="w-full min-w-[520px] text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3 text-center w-24">Interval</th>
                      <th className="p-3 text-left w-1/3">Keterangan</th>
                      <th className="p-3 text-left">Tindak Lanjut / Intervensi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {currentModul.asesmen.kktp.skalaInterval.map((k, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-center text-blue-700 bg-blue-50/30">{k.interval}</td>
                        <td className="p-3 font-medium text-slate-900">{k.keterangan}</td>
                        <td className="p-3 text-slate-700">{k.intervensi}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: LKPD & LAMPIRAN */}
      {activeTab === 'lkpd' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md space-y-6">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              Lembar Kerja Peserta Didik (LKPD) & Lampiran
            </h3>
            <p className="text-xs text-slate-500">
              Materi aktivitas siap cetak untuk siswa berkolaborasi dalam kelompok
            </p>
          </div>

          {currentModul.lampiran?.lkpd && (
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 space-y-4">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-blue-600 uppercase">LEMBAR AKTIVITAS SISWA</span>
                <h4 className="font-extrabold text-base text-slate-900">
                  {currentModul.lampiran.lkpd.judul}
                </h4>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 text-slate-700">
                <p><strong>Nama Anggota Kelompok: </strong>...........................................................................</p>
                <p><strong>Kelas / Pertemuan: </strong>{currentModul.identitas?.faseKelas}</p>
              </div>

              {/* Petunjuk */}
              <div className="space-y-1 text-xs">
                <strong className="text-slate-900">Petunjuk Pengerjaan:</strong>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {(currentModul.lampiran.lkpd.petunjukPengerjaan || []).map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Tugas Aktivitas */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <strong className="text-xs text-slate-900">Aktivitas Kerja Kelompok:</strong>
                <div className="space-y-2">
                  {(currentModul.lampiran.lkpd.aktivitasTugas || []).map((act, i) => (
                    <div key={i} className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-xs text-slate-800">
                      <strong>Aktivitas {i + 1}: </strong>{act}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Glosarium & Pustaka */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            {currentModul.lampiran?.glosarium && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-700">Glosarium</h4>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {currentModul.lampiran.glosarium.map((g, i) => (
                    <p key={i}><strong>• {g.istilah}: </strong>{g.definisi}</p>
                  ))}
                </div>
              </div>
            )}

            {currentModul.lampiran?.daftarPustaka && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-700">Daftar Pustaka</h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                  {currentModul.lampiran.daftarPustaka.map((dp, i) => (
                    <li key={i}>{dp}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
