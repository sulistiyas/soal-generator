'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { DONATION_CONFIG } from '@/lib/donation';

type PaymentTab = 'qris' | 'bca' | 'saweria';

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
  const [isQrZoomed, setIsQrZoomed] = useState(false);

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
      if (e.key === 'Escape') {
        if (isQrZoomed) {
          setIsQrZoomed(false);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isQrZoomed]);

  const handleCopyAccount = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy account number:', err);
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
                {/* Tab 1: QRIS Gopay */}
                <button
                  type="button"
                  onClick={() => setActiveTab('qris')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'qris'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium'
                  }`}
                >
                  <i className="ri-qr-code-line text-sm text-[#00AA13]" />
                  <span>QRIS GoPay</span>
                </button>

                {/* Tab 2: Rekening BCA */}
                <button
                  type="button"
                  onClick={() => setActiveTab('bca')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'bca'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50 font-medium'
                  }`}
                >
                  <i className="ri-bank-card-line text-sm text-[#00529C]" />
                  <span>Rekening BCA</span>
                </button>

                {/* Tab 3: Saweria */}
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
              </div>

              {/* Tab Contents */}
              <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-[#E8E9F0] shadow-xs">
                {/* TAB 1: QRIS GoPay */}
                {activeTab === 'qris' && (
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3.5 animate-in fade-in duration-200">
                    {/* QR Code Container (Click to Zoom) */}
                    <div
                      onClick={() => setIsQrZoomed(true)}
                      className="relative w-32 h-32 min-w-[128px] min-h-[128px] bg-white rounded-xl p-1.5 border-2 border-slate-200 hover:border-[#00AA13] shadow-xs hover:shadow-md flex items-center justify-center shrink-0 cursor-zoom-in group transition-all duration-200"
                      title="Klik untuk memperbesar gambar QR Code"
                    >
                      <Image
                        src={DONATION_CONFIG.qrisImageUrl}
                        alt="QRIS GoPay EduSoal AI"
                        width={128}
                        height={128}
                        className="w-full h-full object-contain rounded-lg group-hover:scale-[1.03] transition-transform duration-200"
                        priority
                        unoptimized
                      />

                      {/* Hover Overlay Hint */}
                      <div className="absolute inset-0 rounded-xl bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white text-[10px] font-bold backdrop-blur-[1px]">
                        <i className="ri-zoom-in-line text-xl" />
                        <span>Klik Perbesar</span>
                      </div>
                    </div>

                    {/* QRIS Info */}
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <div className="space-y-0.5">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/60 text-[11px] font-bold text-emerald-900">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00AA13] shrink-0" />
                          <span>QRIS GoPay (Semua Bank &amp; E-Wallet)</span>
                        </div>
                        <div className="text-xs text-slate-700">
                          a.n <span className="font-bold text-slate-900">{DONATION_CONFIG.accountName}</span>
                        </div>
                      </div>

                      {/* Universal QRIS Explanation Note */}
                      <div className="text-[10.5px] text-slate-600 leading-snug bg-[#F5F6FA] rounded-xl p-2.5 border border-[#E8E9F0]">
                        <span className="font-semibold text-slate-800">💡 Bebas Biaya &amp; Universal:</span> Dapat di-scan langsung menggunakan <strong>seluruh aplikasi Mobile Banking</strong> (BCA, Mandiri, BRI, BNI, BSI, dll.) maupun <strong>semua E-Wallet</strong> (GoPay, OVO, DANA, ShopeePay, LinkAja).
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsQrZoomed(true)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00AA13] hover:text-[#008f10] transition-colors cursor-pointer"
                      >
                        <i className="ri-zoom-in-line text-xs" />
                        <span>Klik gambar untuk tampilan lebih besar</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: Rekening BCA */}
                {activeTab === 'bca' && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="bg-[#F5F6FA] border border-[#E8E9F0] rounded-xl p-3.5 flex items-center justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#00529C]" />
                          <span>{DONATION_CONFIG.bankName}</span>
                        </div>
                        <div className="font-mono font-extrabold text-slate-900 text-base sm:text-lg tracking-wider select-all">
                          {DONATION_CONFIG.accountNumber}
                        </div>
                        <div className="text-xs text-slate-600">
                          a.n <span className="font-bold text-slate-900">{DONATION_CONFIG.accountName}</span>
                        </div>
                      </div>

                      {/* Copy Button */}
                      <button
                        type="button"
                        onClick={() => handleCopyAccount(DONATION_CONFIG.accountNumber)}
                        className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                          isCopied
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-xs'
                        }`}
                        title="Salin Nomor Rekening BCA"
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

                    <div className="text-[11px] text-slate-600 bg-blue-50/70 border border-blue-100 rounded-xl p-2.5 flex items-start gap-2">
                      <i className="ri-information-line text-blue-600 text-sm shrink-0 mt-0.5" />
                      <span>Transfer langsung via ATM, m-BCA, KlikBCA, atau transfer antar bank ke rekening di atas.</span>
                    </div>
                  </div>
                )}

                {/* TAB 3: Saweria */}
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

      {/* 3. FULLSCREEN QR ZOOM / LIGHTBOX MODAL */}
      {isQrZoomed && (
        <div
          className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 print:hidden"
          onClick={() => setIsQrZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan Besar QR Code"
        >
          <div
            className="relative max-w-sm sm:max-w-md w-full bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-100 text-center space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsQrZoomed(false)}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors"
              title="Tutup Pratinjau QR"
              aria-label="Tutup pratinjau QR"
            >
              <i className="ri-close-line text-xl font-bold" />
            </button>

            <div className="space-y-1 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-emerald-900">
                <span className="w-2 h-2 rounded-full bg-[#00AA13]" />
                <span>QRIS GoPay (Semua Bank &amp; E-Wallet)</span>
              </div>
              <h4 className="font-extrabold text-lg sm:text-xl text-slate-900 pt-1">
                Scan QR Code Donasi
              </h4>
              <p className="text-xs text-slate-500">
                Buka Mobile Banking atau E-Wallet pilihan Anda, lalu scan QR di bawah ini:
              </p>
            </div>

            {/* Large High-Res QR Image Box */}
            <div className="relative w-64 h-64 sm:w-76 sm:h-76 mx-auto bg-white rounded-2xl p-2.5 border-2 border-slate-200/90 shadow-md flex items-center justify-center overflow-hidden">
              <Image
                src={DONATION_CONFIG.qrisImageUrl}
                alt="QRIS GoPay EduSoal AI - Sulistiya Nugroho"
                width={320}
                height={320}
                className="w-full h-full object-contain rounded-xl"
                priority
                unoptimized
              />
            </div>

            <div className="space-y-1.5 bg-[#F5F6FA] rounded-2xl p-3 border border-[#E8E9F0]">
              <p className="text-xs font-semibold text-slate-700">
                Atas Nama: <span className="font-extrabold text-slate-900">{DONATION_CONFIG.accountName}</span>
              </p>
              <p className="text-[11px] text-slate-500 leading-snug">
                BCA, Mandiri, BRI, BNI, BSI, GoPay, OVO, DANA, ShopeePay, LinkAja, &amp; seluruh aplikasi QRIS lainnya.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsQrZoomed(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:bg-black text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-xs"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      )}
    </>
  );
};
