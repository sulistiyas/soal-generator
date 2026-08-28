import { NextRequest, NextResponse } from 'next/server';
import { generateExamWithGemini } from '@/lib/gemini';
import { generateExamWithOpenAICompatible } from '@/lib/openai-compatible';
import { AI_PROVIDERS } from '@/lib/constants';
import { ExamGenerationRequest, AIProviderId } from '@/types/exam';

export async function POST(req: NextRequest) {
  try {
    const body: ExamGenerationRequest = await req.json();
    const provider: AIProviderId = body.aiProvider || 'gemini';
    const providerConfig = AI_PROVIDERS.find((p) => p.id === provider) || AI_PROVIDERS[0];
    const model = body.aiModel || providerConfig.defaultModel;

    // Resolve API key: check user input first, then fallback to environment variables
    let apiKey = body.userApiKey || '';
    if (!apiKey) {
      if (provider === 'gemini') apiKey = process.env.GEMINI_API_KEY || '';
      else if (provider === 'groq') apiKey = process.env.GROQ_API_KEY || '';
      else if (provider === 'openrouter') apiKey = process.env.OPENROUTER_API_KEY || '';
      else if (provider === 'deepseek') apiKey = process.env.DEEPSEEK_API_KEY || '';
      else if (provider === 'openai') apiKey = process.env.OPENAI_API_KEY || '';
    }

    if (providerConfig.requiresApiKey && !apiKey) {
      return NextResponse.json(
        {
          error: `API Key untuk ${providerConfig.name} belum diatur. Silakan masukkan API Key di menu Pengaturan AI.`,
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

    let examData;
    if (provider === 'gemini') {
      examData = await generateExamWithGemini(body, apiKey, model);
    } else {
      const baseUrl = body.customBaseUrl || providerConfig.defaultBaseUrl || '';
      examData = await generateExamWithOpenAICompatible({
        request: body,
        apiKey,
        provider,
        model,
        baseUrl,
      });
    }

    return NextResponse.json({ success: true, data: examData });
  } catch (error: any) {
    console.error('API Error /api/generate:', error);
    return NextResponse.json(
      { error: error?.message || 'Terjadi kesalahan pada server saat generate soal.' },
      { status: 500 }
    );
  }
}

