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
4. Karakteristik 3 Tipe Soal:
   - Pilihan Ganda (type: "pg"): Opsi (${optionLetters}). Distraktor homogen & masuk akal. correctAnswer berupa 1 huruf ('A', 'B', dll).
   - Isian Singkat (type: "isian"): Pertanyaan rumpang atau pertanyaan langsung dengan jawaban singkat, pasti, dan padat (istilah ilmiah, nama tokoh, konsep, angka, definisi ringkas). TIDAK memiliki array options. correctAnswer berupa teks jawaban singkat yang objektif.
   - Uraian / Essay (type: "uraian"): Pertanyaan uraian/analitis/penjelasan mendalam. TIDAK memiliki array options. Wajib memiliki rubrik penskoran bergradasi (skor maksimal, kriteria, dan pembagian skor).
5. Kisi-kisi & Rubrik: Setiap nomor soal wajib memiliki Indikator Soal terperinci, Capaian/Tujuan Pembelajaran, dan Kunci Jawaban beserta Pembahasan mendalam.
6. DIAGRAM VISUAL & GEOMETRI (PENTING untuk Matematika & Sains):
   - Khusus pada soal Matematika yang bertopik Geometri Bangun Datar (persegi, panjang, segitiga, lingkaran juring/arsir, trapesium), Bangun Ruang (kubus, balok, prisma, limas, tabung, kerucut), Sudut, Teorema Pythagoras, Transformasi, Koordinat Kartesius, Pecahan Arsiran, maupun Diagram Statistika:
   - WAJIB buatkan kode SVG mandiri yang valid dan proporsional pada field "imageSvg" (contoh: <svg viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg">...</svg>).
   - Gunakan viewBox "0 0 240 160" atau "0 0 200 150", garis tegas stroke="#1e293b" stroke-width="2", warna lembut fill="#f1f5f9" atau fill="#e2e8f0" fill-opacity="0.4", garis putus-putus rusuk 3D stroke-dasharray="4,4", dan teks label titik sudut (A, B, C, D) serta label ukuran (misal: "s = 10 cm", "r = 7 cm", "t = 12 cm").
   - Berikan "imageCaption" singkat (contoh: "Gambar Kubus ABCD.EFGH").
   - Jika soal TIDAK membutuhkan gambar (misal aljabar murni atau non-visual), isi "imageSvg" dengan null atau jangan sertakan.

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
  * Jumlah Pilihan Ganda: ${request.pgCount} butir (type: "pg", Opsi: ${optionLetters})
  * Jumlah Isian Singkat: ${request.isianCount || 0} butir (type: "isian", jawaban singkat/istilah pasti tanpa opsi)
  * Jumlah Uraian / Essay: ${request.essayCount || 0} butir (type: "uraian", jawaban panjang/analitis bergradasi)
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
      "stimulus": "Teks bacaan atau stimulus (opsional jika butuh stimulus)",
      "imageSvg": "<svg viewBox=\\"0 0 240 160\\" xmlns=\\"http://www.w3.org/2000/svg\\">...</svg> (HANYA isi jika soal matematika/IPA butuh gambar geometri/diagram visual, selain itu null)",
      "imageCaption": "Gambar Kubus ABCD.EFGH (opsional jika ada gambar)",
      "question": "Perhatikan gambar di atas. Jika panjang rusuk kubus adalah 8 cm, maka volume kubus tersebut adalah...",
      "options": [
        { "key": "A", "text": "512 cm³" },
        { "key": "B", "text": "384 cm³" },
        { "key": "C", "text": "256 cm³" },
        { "key": "D", "text": "64 cm³" }
      ],
      "correctAnswer": "A",
      "explanation": "Volume kubus = s³ = 8 cm × 8 cm × 8 cm = 512 cm³.",
      "cognitiveLevel": "C2 / LOTS",
      "indicator": "Disajikan gambar bangun ruang kubus, peserta didik dapat menghitung volumenya dengan benar.",
      "learningObjective": "Capaian / Tujuan Pembelajaran terkait",
      "scoreWeight": 2
    },
    {
      "id": "q-2",
      "number": 2,
      "type": "isian",
      "stimulus": "Teks singkat atau kalimat pengantar (opsional)",
      "imageSvg": null,
      "imageCaption": null,
      "question": "Kalimat pertanyaan isian singkat atau kalimat rumpang...",
      "correctAnswer": "Teks jawaban singkat/istilah/angka yang pasti",
      "explanation": "Penjelasan singkat mengenai jawaban isian...",
      "cognitiveLevel": "C1 / LOTS",
      "indicator": "Disajikan ..., peserta didik dapat melengkapi/menyebutkan ...",
      "learningObjective": "Capaian / Tujuan Pembelajaran terkait",
      "scoreWeight": 3
    },
    {
      "id": "q-3",
      "number": 3,
      "type": "uraian",
      "stimulus": "Studi kasus atau data pengantar (opsional)",
      "imageSvg": null,
      "imageCaption": null,
      "question": "Jelaskan dan analisislah ...",
      "correctAnswer": "Uraian komprehensif kunci jawaban yang diharapkan...",
      "explanation": "Pembahasan mendalam dan aspek penting yang harus ada dalam jawaban...",
      "cognitiveLevel": "C4 / HOTS",
      "indicator": "Disajikan masalah ..., peserta didik dapat menguraikan ...",
      "learningObjective": "Capaian / Tujuan Pembelajaran terkait",
      "scoreWeight": 10
    }
  ],
  "rubrics": [
    {
      "questionNumber": 3,
      "criteria": "Kriteria penilaian uraian nomor 3",
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

  const payload: Record<string, unknown> = {
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

    // Clean JSON content from possible markdown blocks and reasoning think tags
    let cleanJson = rawContent.trim();
    // Remove thinking tags if present (e.g. from DeepSeek R1 models)
    cleanJson = cleanJson.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    cleanJson = cleanJson
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();

    // Extract outer JSON object if extra text exists
    const firstBrace = cleanJson.indexOf('{');
    const lastBrace = cleanJson.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
    }

    const parsedExamData: ExamData = JSON.parse(cleanJson);
    return parsedExamData;
  } catch (error: unknown) {
    console.error(`Error in generateExamWithOpenAICompatible (${provider}):`, error);
    const errorMsg = error instanceof Error ? error.message : '';
    if (provider === 'ollama' && errorMsg.includes('fetch failed')) {
      throw new Error(
        'Gagal terhubung ke Ollama lokal. Pastikan aplikasi Ollama sudah menyala dan berjalan di port 11434.'
      );
    }
    throw new Error(errorMsg || `Gagal menghasilkan soal dengan provider ${provider}.`);
  }
}
