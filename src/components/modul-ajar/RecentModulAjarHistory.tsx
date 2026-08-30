'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  getModulAjarHistory,
  deleteSavedModulAjar,
  SavedModulAjarSummary,
} from '@/lib/modul-ajar-storage';
import {
  Clock,
  BookOpen,
  Trash2,
  ExternalLink,
  ChevronRight,
  Layers,
} from 'lucide-react';

function subscribeToModulHistory(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('edusoal_modul_history_updated', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('edusoal_modul_history_updated', callback);
  };
}

function getModulHistorySnapshot(): string {
  if (typeof window === 'undefined') return '[]';
  return localStorage.getItem('edusoal_modul_history') || '[]';
}

function getModulHistoryServerSnapshot(): string {
  return '[]';
}

interface RecentModulAjarHistoryProps {
  currentModulId?: string;
}

export const RecentModulAjarHistory: React.FC<RecentModulAjarHistoryProps> = ({
  currentModulId,
}) => {
  const historyJson = useSyncExternalStore(
    subscribeToModulHistory,
    getModulHistorySnapshot,
    getModulHistoryServerSnapshot
  );

  const [history, setHistory] = useState<SavedModulAjarSummary[]>([]);

  useEffect(() => {
    try {
      const parsed: SavedModulAjarSummary[] = JSON.parse(historyJson);
      setHistory(Array.isArray(parsed) ? parsed : []);
    } catch {
      setHistory([]);
    }
  }, [historyJson]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Hapus modul ajar ini dari riwayat browser?')) {
      deleteSavedModulAjar(id);
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
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

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg shadow-slate-200/40 p-6 space-y-4 print:hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-900">
            Riwayat Modul Ajar Tersimpan
          </h3>
        </div>
        <span className="text-xs text-slate-500 font-medium">
          {history.length} Modul
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {history.map((item) => {
          const isCurrent = item.id === currentModulId;
          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between group ${
                isCurrent
                  ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-500/20'
                  : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                    {item.grade}
                  </span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>

                <h4 className="font-bold text-xs text-slate-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>

                <p className="text-[11px] text-slate-500 mt-1">
                  {item.subject} • {item.meetingCount || 1} Pertemuan
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-200/60 flex items-center justify-between">
                <Link
                  href={item.url}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Buka Modul</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={(e) => handleDelete(e, item.id)}
                  title="Hapus dari riwayat"
                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
