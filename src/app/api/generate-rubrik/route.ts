import { NextRequest, NextResponse } from 'next/server';
import { generateKisiKisiRubrikWithGemini } from '@/lib/gemini-rubrik';
import { generateKisiKisiRubrikWithAnthropic } from '@/lib/anthropic-rubrik';
import { generateKisiKisiRubrikWithOpenAICompatible } from '@/lib/openai-compatible-rubrik';
import { AI_PROVIDERS } from '@/lib/constants';
import { KisiKisiRubrikGenerationRequest } from '@/types/rubrik';
import { AIProviderId } from '@/types/exam';

export async function POST(req: NextRequest) {
  try {
    const body: KisiKisiRubrikGenerationRequest = await req.json();
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
      else if (provider === 'anthropic') apiKey = process.env.ANTHROPIC_API_KEY || '';
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
        { error: 'Mata pelajaran, kelas, dan materi/topik wajib diisi.' },
        { status: 400 }
      );
    }

    let rubrikData;
    if (provider === 'gemini') {
      rubrikData = await generateKisiKisiRubrikWithGemini(body, apiKey, model);
    } else if (provider === 'anthropic') {
      const baseUrl = body.customBaseUrl || providerConfig.defaultBaseUrl || 'https://api.anthropic.com/v1';
      rubrikData = await generateKisiKisiRubrikWithAnthropic(body, apiKey, model, baseUrl);
    } else {
      const baseUrl = body.customBaseUrl || providerConfig.defaultBaseUrl || '';
      rubrikData = await generateKisiKisiRubrikWithOpenAICompatible({
        request: body,
        apiKey,
        provider,
        model,
        baseUrl,
      });
    }

    return NextResponse.json({ success: true, data: rubrikData });
  } catch (error: unknown) {
    console.error('API Error /api/generate-rubrik:', error);
    const msg = error instanceof Error ? error.message : 'Terjadi kesalahan pada server saat membuat kisi-kisi dan rubrik.';
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
