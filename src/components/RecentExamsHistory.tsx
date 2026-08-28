'use client';

import React, { useMemo, useSyncExternalStore, useState } from 'react';
import { deleteGeneratedExam, SavedExamSummary } from '@/lib/exam-storage';
import { History, ExternalLink, Trash2, Clock, Share2, Check } from 'lucide-react';

function subscribeToHistory(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('edusoal_history_updated', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('edusoal_history_updated', callback);
  };
}

function getHistorySnapshot(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('edusoal_exam_history') || '';
}

function getHistoryServerSnapshot(): string {
  return '';
}

export const RecentExamsHistory: React.FC = () => {
  const rawHistory = useSyncExternalStore(
    subscribeToHistory,
    getHistorySnapshot,
    getHistoryServerSnapshot
  );

  const history = useMemo(() => {
    if (!rawHistory) return [];
    try {
      return JSON.parse(rawHistory) as SavedExamSummary[];
    } catch {
      return [];
    }
  }, [rawHistory]);

  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (history.length === 0) return null;

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Hapus riwayat naskah soal ini?')) {
      deleteGeneratedExam(id);
    }
  };

  const handleCopyLink = (e: React.MouseEvent, url: string, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window === 'undefined') return;
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <History className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Riwayat Paket Soal yang Pernah Dibuat</h3>
            <p className="text-[11px] text-slate-500">
              Naskah soal tersimpan di perangkat ini dan dapat dibuka kembali kapan saja
            </p>
          </div>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
          {history.length} Naskah
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="group relative bg-slate-50/70 hover:bg-white p-3.5 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-1 text-[11px]">
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/60 truncate max-w-[140px]">
                  {item.grade}
                </span>
                <span className="font-mono text-slate-400 text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {item.id}
                </span>
              </div>

              <h4 className="font-bold text-xs text-slate-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                {item.subject}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-1">{item.title}</p>
            </div>

            <div className="pt-3 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{formatRelativeTime(item.createdAt)}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => handleCopyLink(e, item.url, item.id)}
                  className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Salin Link Unik"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDelete(e, item.id)}
                  className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Hapus Naskah"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 px-2 py-0.5 rounded transition-colors text-[11px]"
                >
                  <span>Buka</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
