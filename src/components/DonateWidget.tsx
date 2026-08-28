'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { DONATION_CONFIG } from '@/lib/donation';

type PaymentTab = 'qris' | 'saweria' | 'gopay';

export interface DonateWidgetProps {
  autoOpenOnMount?: boolean;
  autoOpenDelay?: number;
}

export const DonateWidget: React.FC<DonateWidgetProps> = ({
  autoOpenOnMount = false,
  autoOpenDelay = 600,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PaymentTab>('qris');
  const [isCopied, setIsCopied] = useState(false);

  // Auto-open modal on mount / page refresh if requested
  useEffect(() => {
    if (!autoOpenOnMount) return;
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, autoOpenDelay);
    return () => clearTimeout(timer);
  }, [autoOpenOnMount, autoOpenDelay]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

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
    <>
      {/* 1. FLOATING BUTTON "Dukung Kami" */}
      <div
        className="fixed bottom-[26px] right-[26px] z-40 print:hidden"
        style={{
          bottom: '26px',
          right: '26px',
        }}
      >
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-full bg-[#1B2033] hover:bg-[#111422] active:bg-[#0D0F1A] text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-white/10"
          title="Dukung EduSoal AI"
          aria-label="Buka popup donasi EduSoal AI"
        >
          {/* Filled Pink Heart Icon */}
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <i className="ri-heart-3-fill text-[#E0468E] text-[15px] animate-pulse" />
          </div>

          {/* Label Text */}
          <span className="font-sans font-bold text-xs sm:text-sm tracking-wide text-white">
            Dukung Kami
          </span>
        </button>
      </div>

      {/* 2. POPUP MODAL DONASI */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200 print:hidden"
          style={{
            backgroundColor: 'rgba(15, 18, 34, 0.55)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div
            className="relative w-full max-w-[460px] max-h-[90vh] bg-[#F5F6FA] rounded-[20px] shadow-2xl overflow-hidden flex flex-col border border-[#E8E9F0] my-auto animate-in zoom-in-95 duration-200 font-sans"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header: Gradient Diagonal #2F6FED -> #7C4FE0 */}
            <div
              className="relative p-5 sm:p-6 text-white shrink-0"
              style={{
                background: 'linear-gradient(135deg, #2F6FED 0%, #7C4FE0 100%)',
              }}
            >
              {/* Close (X) Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-white/15 hover:bg-white/30 active:bg-white/40 flex items-center justify-center text-white cursor-pointer transition-all duration-200 shadow-xs"
                title="Tutup Modal"
                aria-label="Tutup modal"
              >
                <i className="ri-close-line text-lg font-bold" />
              </button>

              <div className="flex items-start gap-3.5 pr-8">
                {/* Heart Icon in Rounded Semi-transparent Box */}
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs border border-white/30 flex items-center justify-center shrink-0 shadow-xs">
                  <i className="ri-heart-3-fill text-[#E0468E] text-2xl" />
                </div>

                <div className="space-y-1">
                  <h3
                    id="modal-headline"
                    className="font-sans font-extrabold text-base sm:text-lg text-white tracking-tight leading-snug"
                  >
                    Dukung EduSoal AI
                  </h3>
                  <p className="font-sans text-[11.5px] sm:text-xs text-white/90 leading-relaxed">
                    EduSoal AI dibangun dan dirawat secara mandiri untuk membantu Bapak/Ibu Guru menyusun soal berkualitas dengan cepat. Dukungan sukarela Anda sangat berharga untuk biaya operasional server &amp; kelanjutan pengembangan fitur baru.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body with smooth scrolling */}
            <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Tab Selector 3 Options */}
              <div className="bg-[#E4E7F0] p-1 rounded-xl flex gap-1 border border-[#D5D9E5]">
                <button
                  type="button"
                  onClick={() => setActiveTab('qris')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'qris'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium'
                  }`}
                >
                  <i className="ri-qr-code-line text-sm text-[#2F6FED]" />
                  <span>QRIS</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('saweria')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'saweria'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium'
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
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium'
                  }`}
                >
                  <i className="ri-wallet-3-line text-sm text-[#00AA13]" />
                  <span>GoPay</span>
                </button>
              </div>

              {/* Tab Contents */}
              <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E8E9F0] shadow-xs">
                {/* TAB 1: QRIS */}
                {activeTab === 'qris' && (
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5 animate-in fade-in duration-200">
                    {/* QR Code Container */}
                    <div className="relative w-28 h-28 min-w-[112px] min-h-[112px] bg-white rounded-xl p-1.5 border border-slate-200 shadow-xs flex items-center justify-center shrink-0">
                      <Image
                        src={DONATION_CONFIG.qrisImageUrl}
                        alt="QRIS EduSoal AI"
                        width={112}
                        height={112}
                        className="w-full h-full object-contain rounded-lg"
                        priority
                        unoptimized
                      />
                    </div>

                    {/* QRIS Info */}
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div className="space-y-0.5">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200/60 text-[11px] font-bold text-blue-900">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2F6FED] shrink-0" />
                          <span>{DONATION_CONFIG.bankName}</span>
                        </div>
                        <div className="text-xs text-slate-700">
                          a.n <span className="font-bold text-slate-900">{DONATION_CONFIG.accountName}</span>
                        </div>
                      </div>

                      {/* Universal QRIS Explanation Note */}
                      <div className="text-[10.5px] text-slate-600 leading-snug bg-[#F5F6FA] rounded-xl p-2.5 border border-[#E8E9F0]">
                        <span className="font-semibold text-slate-800">💡 Bebas Biaya &amp; Universal:</span> Dapat di-scan langsung menggunakan <strong>seluruh aplikasi Mobile Banking</strong> (BCA, Mandiri, BRI, BNI, BSI, dll.) maupun <strong>semua E-Wallet</strong> (GoPay, OVO, DANA, ShopeePay, LinkAja).
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Saweria */}
                {activeTab === 'saweria' && (
                  <div className="space-y-3 text-center sm:text-left animate-in fade-in duration-200">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Kirim traktiran apresiasi instan melalui platform Saweria. Mendukung QRIS, GoPay, OVO, DANA, dan ShopeePay.
                    </p>

                    <a
                      href={DONATION_CONFIG.saweriaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-[#FF8A65] hover:bg-[#F27B54] active:bg-[#E46B44] text-white font-bold py-2.5 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-xs sm:text-sm group"
                    >
                      <i className="ri-cup-line text-base transition-transform group-hover:scale-110" />
                      <span>Kirim Dukungan via Saweria</span>
                      <i className="ri-external-link-line text-xs opacity-80" />
                    </a>
                  </div>
                )}

                {/* TAB 3: GoPay */}
                {activeTab === 'gopay' && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    {/* GoPay Account Card */}
                    <div className="bg-[#F5F6FA] border border-[#E8E9F0] rounded-xl p-3 flex items-center justify-between gap-2">
                      <div className="space-y-0.5 min-w-0">
                        <div className="text-[10.5px] font-semibold text-slate-500 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00AA13]" />
                          <span>Nomor GoPay (a.n {DONATION_CONFIG.gopayName})</span>
                        </div>
                        <div className="font-mono font-extrabold text-slate-900 text-sm sm:text-base tracking-wide select-all">
                          {DONATION_CONFIG.gopayNumber}
                        </div>
                      </div>

                      {/* Copy Button */}
                      <button
                        type="button"
                        onClick={handleCopyGoPay}
                        className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
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
                      className="w-full bg-[#00AA13] hover:bg-[#009210] active:bg-[#007E0E] text-white font-bold py-2.5 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-xs sm:text-sm group"
                    >
                      <i className="ri-wallet-3-line text-sm transition-transform group-hover:scale-110" />
                      <span>Buka GoPay</span>
                      <i className="ri-external-link-line text-xs opacity-80" />
                    </a>
                  </div>
                )}
              </div>

              {/* Appreciation Note */}
              <p className="text-[11px] text-slate-500 text-center font-medium leading-relaxed">
                Setiap dukungan, berapa pun jumlahnya, sangat dihargai. Terima kasih, Bapak/Ibu Guru! 🙏
              </p>

              {/* "Nanti saja" Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-center text-xs sm:text-sm font-semibold text-slate-400 hover:text-slate-700 transition-colors cursor-pointer block"
              >
                Nanti saja
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
