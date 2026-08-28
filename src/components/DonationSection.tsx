'use client';

import React, { useState } from 'react';
import { DONATION_CONFIG } from '@/lib/donation';
import Image from 'next/image';

type PaymentTab = 'qris' | 'saweria' | 'gopay';

export const DonationSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PaymentTab>('qris');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyGoPay = async () => {
    try {
      await navigator.clipboard.writeText(DONATION_CONFIG.gopayNumber);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy GoPay number:', err);
    }
  };

  return (
    <div
      className="rounded-2xl border border-[#F0DCEE] p-3.5 sm:p-4 space-y-3 transition-all duration-300 text-slate-800"
      style={{
        background: 'linear-gradient(155deg, #FCE9F5 0%, #EFEBFC 50%, #E7F0FE 100%)',
      }}
    >
      {/* Header Card */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-pink-100/90 flex items-center justify-center shrink-0 shadow-xs border border-pink-200/60">
            <i className="ri-heart-3-fill text-[#D6448C] text-[13px]" />
          </div>
          <h4 className="font-bold text-[13.5px] text-slate-900 tracking-tight">
            Dukung Pengembangan Aplikasi Ini
          </h4>
        </div>
        <p className="text-[11.5px] text-slate-600 leading-relaxed pl-8">
          Aplikasi ini dikembangkan dan dirawat secara mandiri. Dukungan sukarela Anda sangat berharga untuk biaya operasional server & kelanjutan fitur baru.
        </p>
      </div>

      {/* Tab Selector */}
      <div className="bg-white/65 backdrop-blur-xs p-1 rounded-xl flex gap-1 border border-white/80 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('qris')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'qris'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-100/80 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40 font-medium'
          }`}
        >
          <i className="ri-qr-code-line text-sm text-[#3B6DF0]" />
          <span>QRIS</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('saweria')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'saweria'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-100/80 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40 font-medium'
          }`}
        >
          <i className="ri-cup-line text-sm text-[#FF8A65]" />
          <span>Saweria</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gopay')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'gopay'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-100/80 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40 font-medium'
          }`}
        >
          <i className="ri-wallet-3-line text-sm text-[#00AA13]" />
          <span>GoPay</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white/85 backdrop-blur-xs rounded-xl p-3 border border-white shadow-2xs">
        {/* TAB 1: QRIS */}
        {activeTab === 'qris' && (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            {/* Real QR Code Image */}
            <div className="relative w-24 h-24 min-w-[96px] min-h-[96px] bg-white rounded-xl p-1 border border-slate-200/80 shadow-xs flex items-center justify-center shrink-0 overflow-hidden group">
              <Image
                src={DONATION_CONFIG.qrisImageUrl}
                alt="QRIS Donasi"
                width={96}
                height={96}
                className="w-full h-full object-contain rounded-lg"
                priority
                unoptimized
              />
            </div>

            {/* QRIS Info */}
            <div className="flex-1 space-y-1.5 text-center sm:text-left">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50/80 border border-blue-200/50 text-[11px] font-bold text-blue-900">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                  <span>{DONATION_CONFIG.bankName}</span>
                </div>
                <div className="text-xs font-semibold text-slate-700">
                  a.n <span className="font-bold text-slate-900">{DONATION_CONFIG.accountName}</span>
                </div>
              </div>

              {/* Explanatory Note on QRIS Universality */}
              <div className="text-[10.5px] text-slate-600 leading-snug bg-slate-50/90 rounded-lg p-2 border border-slate-200/60">
                <span className="font-semibold text-slate-800">💡 Bebas Biaya & Universal:</span> Dapat di-scan langsung menggunakan <strong>seluruh aplikasi Mobile Banking</strong> (BCA, Mandiri, BRI, BNI, BSI, dll.) maupun <strong>semua E-Wallet</strong> (GoPay, OVO, DANA, ShopeePay, LinkAja).
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Saweria */}
        {activeTab === 'saweria' && (
          <div className="space-y-2.5 text-center sm:text-left">
            <p className="text-[11.5px] text-slate-600 leading-relaxed">
              Kirim traktiran kopi atau apresiasi instan melalui platform Saweria. Mendukung QRIS, GoPay, OVO, DANA, dan ShopeePay.
            </p>

            <a
              href={DONATION_CONFIG.saweriaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#FF8A65] hover:bg-[#f27b54] active:bg-[#e46b44] text-white font-bold py-2.5 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-xs sm:text-sm group"
            >
              <i className="ri-cup-line text-base transition-transform group-hover:scale-110" />
              <span>Kirim Dukungan via Saweria</span>
              <i className="ri-external-link-line text-xs opacity-80" />
            </a>
          </div>
        )}

        {/* TAB 3: GoPay */}
        {activeTab === 'gopay' && (
          <div className="space-y-2.5">
            {/* GoPay Account Card */}
            <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-2.5 flex items-center justify-between gap-2">
              <div className="space-y-0.5 min-w-0">
                <div className="text-[10.5px] font-semibold text-slate-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00AA13]" />
                  <span>Nomor GoPay (a.n {DONATION_CONFIG.gopayName})</span>
                </div>
                <div className="font-mono font-extrabold text-slate-900 text-sm tracking-wide select-all">
                  {DONATION_CONFIG.gopayNumber}
                </div>
              </div>

              {/* Copy Button */}
              <button
                type="button"
                onClick={handleCopyGoPay}
                className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                  isCopied
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
                title="Salin Nomor GoPay"
              >
                {isCopied ? (
                  <>
                    <i className="ri-check-line text-emerald-600 text-sm font-bold" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <i className="ri-file-copy-line text-slate-500 text-sm" />
                    <span>Salin</span>
                  </>
                )}
              </button>
            </div>

            {/* Open GoPay Button */}
            <a
              href={DONATION_CONFIG.gopayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#00AA13] hover:bg-[#009210] active:bg-[#007e0e] text-white font-bold py-2 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-xs group"
            >
              <i className="ri-wallet-3-line text-sm transition-transform group-hover:scale-110" />
              <span>Buka GoPay</span>
              <i className="ri-external-link-line text-xs opacity-80" />
            </a>
          </div>
        )}
      </div>

      {/* Small Appreciation Note at Bottom */}
      <p className="text-[10.5px] text-slate-500 text-center font-medium leading-normal">
        Setiap dukungan, berapa pun jumlahnya, sangat dihargai. Terima kasih! 🙏
      </p>
    </div>
  );
};
