'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ListChecks,
  Clock,
  Trash2,
  ExternalLink,
  Download,
  FileText,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { getSavedRubrikHistory, deleteSavedRubrikById } from '@/lib/rubrik-storage';
import { exportKisiKisiRubrikToDocx } from '@/lib/docx-rubrik';
import { SavedRubrikItem } from '@/types/rubrik';

interface RecentRubrikHistoryProps {
  onSelect?: (item: SavedRubrikItem) => void;
}

export const RecentRubrikHistory: React.FC<RecentRubrikHistoryProps> = ({ onSelect }) => {
  const [history, setHistory] = useState<SavedRubrikItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const loadHistory = () => {
    setHistory(getSavedRubrikHistory());
  };

  useEffect(() => {
    setMounted(true);
    loadHistory();

    const handleUpdate = () => loadHistory();
    window.addEventListener('edusoal_rubrik_history_updated', handleUpdate);
    return () => {
      window.removeEventListener('edusoal_rubrik_history_updated', handleUpdate);
    };
  }, []);

  if (!mounted || history.length === 0) return null;

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (confirm('Apakah Anda yakin ingin menghapus kisi-kisi & rubrik ini dari riwayat lokal?')) {
      deleteSavedRubrikById(id);
      loadHistory();
    }
  };

  const handleExportDocx = async (e: React.MouseEvent, item: SavedRubrikItem) => {
    e.stopPropagation();
    e.preventDefault();
    if (item.data) {
      await exportKisiKisiRubrikToDocx(item.data);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Riwayat Kisi-Kisi & Rubrik Tersimpan</h3>
            <p className="text-xs text-slate-500">Tersimpan di peramban Anda</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
          {history.length} Item
        </span>
      </div>

      <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
        {history.map((item) => {
          const formattedDate = new Date(item.createdAt).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          });

          return (
            <div
              key={item.id}
              onClick={() => onSelect && onSelect(item)}
              className="group p-3 rounded-xl border border-slate-100 hover:border-blue-200 bg-slate-50/50 hover:bg-blue-50/40 transition-all cursor-pointer flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded">
                    Kelas {item.grade}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 bg-slate-200/60 px-1.5 py-0.5 rounded truncate">
                    {item.assessmentTypeLabel}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                  {item.subject} - {item.topic}
                </h4>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formattedDate}
                  </span>
                  <span>•</span>
                  <span>{item.totalQuestions} Butir Soal / Indikator</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  title="Unduh Microsoft Word"
                  onClick={(e) => handleExportDocx(e, item)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
                <Link
                  href={`/generated/rubrik/${item.classSlug}/${item.id}`}
                  title="Buka Halaman Permalink"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  title="Hapus"
                  onClick={(e) => handleDelete(e, item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
