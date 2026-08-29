import { ImageResponse } from 'next/og';

export const alt = 'Teacher Tools Hub - Portal Kumpulan Alat Bantu Guru Berbasis AI';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#0f172a',
          backgroundImage:
            'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)',
          backgroundSize: '100px 100px',
          padding: '60px 70px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        }}
      >
        {/* Header Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              fontSize: '24px',
              fontWeight: 800,
            }}
          >
            ✨
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span
              style={{
                fontSize: '22px',
                fontWeight: 800,
                letterSpacing: '-0.5px',
                color: '#818cf8',
              }}
            >
              TEACHER TOOLS HUB
            </span>
            <span
              style={{
                fontSize: '14px',
                color: '#94a3b8',
                fontWeight: 500,
              }}
            >
              Portal AI Edukasi Guru Indonesia
            </span>
          </div>

          <div
            style={{
              marginLeft: 'auto',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(99, 102, 241, 0.15)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              color: '#a5b4fc',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            100% Gratis & Multi-AI
          </div>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            maxWidth: '1000px',
          }}
        >
          <h1
            style={{
              fontSize: '52px',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-1.5px',
              margin: 0,
              color: '#ffffff',
            }}
          >
            Generator Soal AI, Kisi-Kisi, & Modul Ajar Kurikulum Merdeka
          </h1>
          <p
            style={{
              fontSize: '22px',
              color: '#94a3b8',
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Buat paket soal ujian (Pilihan Ganda, Essay, Isian, Benar/Salah) lengkap dengan kunci jawaban & ekspor ke Microsoft Word (.docx) dalam hitungan detik.
          </p>
        </div>

        {/* Footer Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
            paddingTop: '24px',
            borderTop: '1px solid #1e293b',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px',
              color: '#cbd5e1',
            }}
          >
            <span style={{ color: '#10b981' }}>✔</span> Ekspor MS Word .docx
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px',
              color: '#cbd5e1',
            }}
          >
            <span style={{ color: '#10b981' }}>✔</span> Kurikulum Merdeka & K-13
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px',
              color: '#cbd5e1',
            }}
          >
            <span style={{ color: '#10b981' }}>✔</span> Level Kognitif HOTS/MOTS/LOTS
          </div>
          <div
            style={{
              marginLeft: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px',
              color: '#818cf8',
              fontWeight: 600,
            }}
          >
            Sulistiya Nugroho • EduSoal AI
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
