import { NextRequest, NextResponse } from 'next/server';
import { generateExamWithGemini } from '@/lib/gemini';
import { ExamGenerationRequest } from '@/types/exam';

export async function POST(req: NextRequest) {
  try {
    const body: ExamGenerationRequest = await req.json();

    const apiKey = body.userApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            'API Key Google Gemini belum diatur. Masukkan API Key di form pengaturan aplikasi atau set di file .env.local.',
        },
        { status: 400 }
      );
    }

    if (!body.topic || !body.subject || !body.grade) {
      return NextResponse.json(
        { error: 'Mata pelajaran, kelas, dan topik materi wajib diisi.' },
        { status: 400 }
      );
    }

    const examData = await generateExamWithGemini(body, apiKey);

    return NextResponse.json({ success: true, data: examData });
  } catch (error: any) {
    console.error('API Error /api/generate:', error);
    return NextResponse.json(
      { error: error?.message || 'Terjadi kesalahan pada server saat generate soal.' },
      { status: 500 }
    );
  }
}
