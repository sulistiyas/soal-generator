import { ExamData, ExamGenerationRequest, AIProviderId } from '@/types/exam';

interface OpenAICompatibleParams {
  request: ExamGenerationRequest;
  apiKey: string;
  provider: AIProviderId;
  model: string;
  baseUrl: string;
}

export async function generateExamWithOpenAICompatible({
  request,
  apiKey,
  provider,
  model,
  baseUrl,
}: OpenAICompatibleParams): Promise<ExamData> {
  const optionCount = request.educationLevel === 'sd' || request.educationLevel === 'smp' ? 4 : 5;
  const optionLetters = optionCount === 4 ? 'A, B, C, D' : 'A, B, C, D, E';

  const systemInstruction = `Anda adalah Pakar Kurikulum dan Asesmen Pendidikan Indonesia (Kemendikbudristek).
Tugas Anda adalah membuat paket instrumen asesmen/soal ujian lengkap berkualitas tinggi untuk sekolah di Indonesia, sesuai dengan regulasi Kurikulum Merdeka atau Kurikulum 2013.

Prinsip Pembuatan Soal:
1. Kontekstual & Realistis: Gunakan stimulus (teks pengantar, data tabel, atau studi kasus) yang mendidik dan relevan dengan kehidupan sehari-hari siswa Indonesia.
2. Taksonomi Bloom: Terapkan proporsi kognitif LOTS (C1-C2), MOTS (C3-C4), dan HOTS (C5-C6 / penalaran kritis, pemecahan masalah) sesuai permintaan.
3. Kualitas Bahasa: Gunakan Bahasa Indonesia baku yang jelas, komunikatif, dan sesuai usia perkembangan siswa jenjang tersebut.
4. Format Pilihan Ganda: Untuk jenjang ini gunakan opsi (${optionLetters}). Pengecoh (distraktor) harus homogen dan masuk akal.
5. Kisi-kisi & Rubrik: Setiap nomor soal wajib memiliki Indikator Soal terperinci, Capaian/Tujuan Pembelajaran, dan Kunci Jawaban beserta Pembahasan mendalam. Untuk soal uraian sertakan rubrik penskoran bergradasi (skor maksimal, kriteria, dan pembagian skor).

Wajib menghasilkan output HANYA dalam format JSON valid murni tanpa teks pembuka atau penutup lainnya.`;

  const userPrompt = `Buatkan paket naskah soal ujian lengkap dengan parameter berikut:
- Nama Sekolah: ${request.schoolName || 'SEKOLAH CONTOH'}
- Jenjang: ${request.educationLevel.toUpperCase()}
- Kelas: ${request.grade}
- Mata Pelajaran: ${request.subject}
- Kurikulum: ${request.curriculum === 'merdeka' ? 'Kurikulum Merdeka' : 'Kurikulum 2013 (K-13)'}
- Kategori Asesmen: ${request.examCategory.toUpperCase()}
- Semester: ${request.semester}
- Tahun Ajaran: ${request.academicYear}
- Alokasi Waktu: ${request.durationMinutes} Menit
- Topik / Cakupan Materi Utama: ${request.topic}
${request.specificMaterial ? `- Rincian Materi Tambahan: ${request.specificMaterial}` : ''}
- Komposisi Soal:
  * Jumlah Pilihan Ganda: ${request.pgCount} butir (Opsi: ${optionLetters})
  * Jumlah Uraian / Essay: ${request.essayCount} butir
  * Proporsi Kesulitan: LOTS (Mudah) ~${request.difficultyRatio.lots}%, MOTS (Sedang) ~${request.difficultyRatio.mots}%, HOTS (Sulit/Penalaran) ~${request.difficultyRatio.hots}%
${request.additionalInstructions ? `- Instruksi Khusus: ${request.additionalInstructions}` : ''}

Struktur JSON yang WAJIB dihasilkan:
{
  "schoolName": "${request.schoolName || 'SEKOLAH'}",
  "educationLevel": "${request.educationLevel}",
  "grade": "${request.grade}",
  "subject": "${request.subject}",
  "curriculum": "${request.curriculum}",
  "examCategory": "${request.examCategory}",
  "examTitle": "string (contoh: ASESMEN SUMATIF AKHIR SEMESTER (ASAS) GANJIL TAHUN AJARAN ${request.academicYear})",
  "semester": "${request.semester}",
  "academicYear": "${request.academicYear}",
  "durationMinutes": ${request.durationMinutes},
  "topic": "${request.topic}",
  "teacherName": "Guru Pengampu Mata Pelajaran",
  "instructions": [
    "Berdoalah sebelum mengerjakan soal.",
    "Tuliskan identitas Anda pada lembar jawaban yang telah disediakan.",
    "Periksa dan bacalah setiap soal dengan teliti sebelum menjawab.",
    "Dahulukan menjawab soal-soal yang Anda anggap mudah.",
    "Periksalah kembali seluruh pekerjaan Anda sebelum diserahkan."
  ],
  "questions": [
    {
      "id": "q-1",
      "number": 1,
      "type": "pg",
      "stimulus": "Teks bacaan atau stimulus (opsional jika soal butuh teks cerita/kasus/tabel)",
      "question": "Kalimat pertanyaan nomor 1...",
      "options": [
        { "key": "A", "text": "Pilihan A" },
        { "key": "B", "text": "Pilihan B" },
        { "key": "C", "text": "Pilihan C" },
        { "key": "D", "text": "Pilihan D" }
      ],
      "correctAnswer": "A",
      "explanation": "Penjelasan lengkap dan logis kenapa pilihan tersebut benar...",
      "cognitiveLevel": "C2 / LOTS",
      "indicator": "Disajikan ..., peserta didik dapat menentukan ...",
      "learningObjective": "Capaian / Tujuan Pembelajaran terkait",
      "scoreWeight": 2
    }
  ],
  "rubrics": [
    {
      "questionNumber": 1,
      "criteria": "Kriteria penilaian uraian",
      "maxScore": 10,
      "scoringGuide": [
        { "score": 10, "description": "Menjelaskan konsep secara lengkap, runut, dan tepat." },
        { "score": 6, "description": "Menjelaskan sebagian konsep dengan tepat." },
        { "score": 3, "description": "Hanya menyebutkan kata kunci tanpa penjelasan yang memadai." },
        { "score": 0, "description": "Tidak menjawab atau jawaban tidak sesuai konteks." }
      ]
    }
  ]
}`;

  // Clean base URL (remove trailing slashes)
  const normalizedBaseUrl = (baseUrl || '').replace(/\/+$/, '');
  const endpoint = `${normalizedBaseUrl}/chat/completions`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  // Optional headers for OpenRouter
  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = 'https://soal-generator.local';
    headers['X-Title'] = 'Generator Soal Indonesia';
  }

  const payload: any = {
    model: model,
    messages: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
  };

  // Support response_format json_object for supported providers
  if (provider === 'openai' || provider === 'groq' || provider === 'deepseek') {
    payload.response_format = { type: 'json_object' };
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      let errorDetail = '';
      try {
        const errorJson = await res.json();
        errorDetail = errorJson?.error?.message || errorJson?.message || JSON.stringify(errorJson);
      } catch {
        errorDetail = await res.text();
      }

      if (res.status === 401) {
        throw new Error(
          `API Key ${provider.toUpperCase()} tidak valid atau belum diisi. Silakan periksa di menu Pengaturan AI.`
        );
      }
      if (res.status === 429) {
        throw new Error(
          `Batas kuota/rate limit provider ${provider.toUpperCase()} telah tercapai. Coba beberapa saat lagi atau beralih ke provider AI gratis lainnya.`
        );
      }
      if (res.status === 404 && provider === 'ollama') {
        throw new Error(
          `Ollama tidak menemukan model "${model}". Pastikan Anda sudah menjalankan "ollama run ${model}" di komputer Anda.`
        );
      }

      throw new Error(`[${provider.toUpperCase()} ${res.status}]: ${errorDetail}`);
    }

    const data = await res.json();
    const rawContent = data?.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error(`Tidak ada konten respon yang diterima dari provider ${provider.toUpperCase()}.`);
    }

    // Clean JSON content from possible markdown blocks
    const cleanJson = rawContent
      .trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    const parsedExamData: ExamData = JSON.parse(cleanJson);
    return parsedExamData;
  } catch (error: any) {
    console.error(`Error in generateExamWithOpenAICompatible (${provider}):`, error);
    if (provider === 'ollama' && error?.message?.includes('fetch failed')) {
      throw new Error(
        'Gagal terhubung ke Ollama lokal. Pastikan aplikasi Ollama sudah menyala dan berjalan di port 11434.'
      );
    }
    throw new Error(error?.message || `Gagal menghasilkan soal dengan provider ${provider}.`);
  }
}
