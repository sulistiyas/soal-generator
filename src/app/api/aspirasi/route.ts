import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, role, toolIdea, description } = body;

    if (!toolIdea || typeof toolIdea !== 'string' || !toolIdea.trim()) {
      return NextResponse.json(
        { success: false, message: 'Nama alat bantu wajib diisi' },
        { status: 400 }
      );
    }

    const payload = {
      timestamp: new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' }),
      name: name?.trim() || 'Anonim / Belum Diisi',
      role: role?.trim() || 'Guru',
      toolIdea: toolIdea.trim(),
      description: description?.trim() || '-',
    };

    const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;

    if (webhookUrl && webhookUrl.trim().startsWith('http')) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          // Google Apps Script usually follows 302 redirects
          redirect: 'follow',
        });

        const resultText = await response.text();
        let resultJson;
        try {
          resultJson = JSON.parse(resultText);
        } catch {
          // not json
        }

        if (!response.ok || (resultJson && resultJson.status === 'error')) {
          console.error('[Aspirasi API] Google Apps Script responded with error:', resultJson || resultText);
        } else {
          console.info('[Aspirasi API] Berhasil dikirim ke Google Sheets:', resultJson || resultText);
        }
      } catch (webhookErr) {
        console.error('[Aspirasi API] Failed to trigger Google Sheet webhook:', webhookErr);
      }
    } else {
      console.info(
        '[Aspirasi API] GOOGLE_SHEET_WEBHOOK_URL belum disetting di .env.local. Data aspirasi:',
        payload
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Aspirasi berhasil diterima',
      data: payload,
    });
  } catch (error) {
    console.error('[Aspirasi API] Error processing request:', error);
    return NextResponse.json(
      { success: false, message: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
