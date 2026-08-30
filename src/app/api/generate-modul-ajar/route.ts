import { NextRequest, NextResponse } from 'next/server';
import { generateModulAjarWithGemini } from '@/lib/gemini-modul-ajar';
import { generateModulAjarWithAnthropic } from '@/lib/anthropic-modul-ajar';
import { generateModulAjarWithOpenAICompatible } from '@/lib/openai-compatible-modul-ajar';
import { AI_PROVIDERS } from '@/lib/constants';
import { ModulAjarGenerationRequest } from '@/types/modul-ajar';
import { AIProviderId } from '@/types/exam';

export async function POST(req: NextRequest) {
  try {
    const body: ModulAjarGenerationRequest = await req.json();
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
        { error: 'Mata pelajaran, kelas, dan topik materi wajib diisi.' },
        { status: 400 }
      );
    }

    let modulData;
    if (provider === 'gemini') {
      modulData = await generateModulAjarWithGemini(body, apiKey, model);
    } else if (provider === 'anthropic') {
      const baseUrl = body.customBaseUrl || providerConfig.defaultBaseUrl || 'https://api.anthropic.com/v1';
      modulData = await generateModulAjarWithAnthropic(body, apiKey, model, baseUrl);
    } else {
      const baseUrl = body.customBaseUrl || providerConfig.defaultBaseUrl || '';
      modulData = await generateModulAjarWithOpenAICompatible({
        request: body,
        apiKey,
        provider,
        model,
        baseUrl,
      });
    }

    return NextResponse.json({ success: true, data: modulData });
  } catch (error: unknown) {
    console.error('API Error /api/generate-modul-ajar:', error);
    const msg = error instanceof Error ? error.message : 'Terjadi kesalahan pada server saat generate modul ajar.';
    return NextResponse.json(
      { error: msg },
      { status: 500 }
    );
  }
}
