'use client';

import React, { useState, useEffect } from 'react';
import { Key, X, ExternalLink, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
}) => {
  const [inputValue, setInputValue] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setInputValue(apiKey);
  }, [apiKey]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveApiKey(inputValue.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Key className="w-4 h-4" />
            </div>
            <span>Pengaturan Google Gemini API Key</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 pr-10 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="mt-1.5 text-xs text-slate-500">
              API Key Anda disimpan secara lokal di browser Anda.
            </p>
          </div>

          <div className="rounded-xl bg-blue-50/70 border border-blue-200/70 p-3.5 space-y-2 text-xs text-blue-900">
            <div className="flex items-center gap-1.5 font-semibold text-blue-950">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Cara Mendapatkan API Key Gratis:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-blue-800/90 pl-1">
              <li>
                Buka{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline inline-flex items-center gap-0.5 text-blue-700 hover:text-blue-900"
                >
                  Google AI Studio <ExternalLink className="w-3 h-3 inline" />
                </a>
              </li>
              <li>Login dengan akun Google Anda.</li>
              <li>Klik tombol <strong>&quot;Create API Key&quot;</strong>.</li>
              <li>Salin (copy) key tersebut lalu tempel pada input di atas.</li>
            </ol>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm hover:shadow transition-all cursor-pointer"
            >
              Simpan API Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
