'use client';

import React, { useState } from 'react';
import { DONATION_CONFIG } from '@/lib/donation';
import Image from 'next/image';

type PaymentTab = 'qris' | 'bca' | 'saweria';

export const DonationSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<PaymentTab>('qris');
  const [isCopied, setIsCopied] = useState(false);
  const [isQrZoomed, setIsQrZoomed] = useState(false);

  // Close QR modal on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isQrZoomed) {
        setIsQrZoomed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQrZoomed]);

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
          Aplikasi ini dikembangkan dan dirawat secara mandiri. Dukungan sukarela Anda sangat berharga untuk biaya operasional server &amp; kelanjutan fitur baru.
        </p>
      </div>

      {/* Tab Selector */}
      <div className="bg-white/65 backdrop-blur-xs p-1 rounded-xl flex gap-1 border border-white/80 shadow-2xs">
        {/* Tab 1: QRIS GoPay */}
        <button
          type="button"
          onClick={() => setActiveTab('qris')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'qris'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-100/80 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40 font-medium'
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
              ? 'bg-white text-slate-900 shadow-xs border border-slate-100/80 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40 font-medium'
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
              ? 'bg-white text-slate-900 shadow-xs border border-slate-100/80 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/40 font-medium'
          }`}
        >
          <i className="ri-cup-line text-sm text-[#FF8A65]" />
          <span>Saweria</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="bg-white/85 backdrop-blur-xs rounded-xl p-3 border border-white shadow-2xs">
        {/* TAB 1: QRIS GoPay */}
        {activeTab === 'qris' && (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
            {/* Real QR Code Image (Click to Zoom) */}
            <div
              onClick={() => setIsQrZoomed(true)}
              className="relative w-28 h-28 min-w-[112px] min-h-[112px] bg-white rounded-xl p-1 border-2 border-slate-200/80 hover:border-[#00AA13] shadow-xs hover:shadow-md flex items-center justify-center shrink-0 overflow-hidden group cursor-zoom-in transition-all duration-200"
              title="Klik untuk memperbesar QR Code"
            >
              <Image
                src={DONATION_CONFIG.qrisImageUrl}
                alt="QRIS GoPay Donasi"
                width={112}
                height={112}
                className="w-full h-full object-contain rounded-lg group-hover:scale-[1.03] transition-transform duration-200"
                priority
                unoptimized
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 rounded-xl bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white text-[9.5px] font-bold backdrop-blur-[1px]">
                <i className="ri-zoom-in-line text-base" />
                <span>Perbesar</span>
              </div>
            </div>

            {/* QRIS Info */}
            <div className="flex-1 space-y-1.5 text-center sm:text-left">
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50/80 border border-emerald-200/50 text-[11px] font-bold text-emerald-900">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00AA13] shrink-0" />
                  <span>QRIS GoPay (Semua Bank &amp; E-Wallet)</span>
                </div>
                <div className="text-xs font-semibold text-slate-700">
                  a.n <span className="font-bold text-slate-900">{DONATION_CONFIG.accountName}</span>
                </div>
              </div>

              {/* Explanatory Note on QRIS Universality */}
              <div className="text-[10.5px] text-slate-600 leading-snug bg-slate-50/90 rounded-lg p-2 border border-slate-200/60">
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
          <div className="space-y-2.5">
            {/* BCA Account Card */}
            <div className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between gap-2">
              <div className="space-y-0.5 min-w-0">
                <div className="text-[10.5px] font-semibold text-slate-500 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00529C]" />
                  <span>{DONATION_CONFIG.bankName}</span>
                </div>
                <div className="font-mono font-extrabold text-slate-900 text-sm sm:text-base tracking-wider select-all">
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
                className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                  isCopied
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 shadow-2xs'
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

            <div className="text-[10.5px] text-slate-600 bg-blue-50/70 border border-blue-100 rounded-lg p-2 flex items-start gap-1.5">
              <i className="ri-information-line text-blue-600 text-sm shrink-0 mt-0.5" />
              <span>Transfer langsung via ATM, m-BCA, KlikBCA, atau antar bank ke nomor rekening di atas.</span>
            </div>
          </div>
        )}

        {/* TAB 3: Saweria */}
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
      </div>

      {/* Small Appreciation Note at Bottom */}
      <p className="text-[10.5px] text-slate-500 text-center font-medium leading-normal">
        Setiap dukungan, berapa pun jumlahnya, sangat dihargai. Terima kasih! 🙏
      </p>

      {/* FULLSCREEN QR ZOOM / LIGHTBOX MODAL */}
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
                alt="QRIS GoPay - Sulistiya Nugroho"
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
    </div>
  );
};
