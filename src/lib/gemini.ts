import { GoogleGenAI } from '@google/genai';
import { ExamData, ExamGenerationRequest } from '@/types/exam';

export async function generateExamWithGemini(
  request: ExamGenerationRequest,
  apiKey: string
): Promise<ExamData> {
  if (!apiKey) {
    throw new Error('API Key Google Gemini belum diatur. Silakan masukkan API Key di menu pengaturan atau file .env.local.');
  }

  const ai = new GoogleGenAI({ apiKey });

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

Wajib menghasilkan output dalam format JSON valid murni sesuai struktur yang diminta.`;

  const prompt = `Buatkan paket naskah soal ujian lengkap dengan parameter berikut:
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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    if (!text) {
      throw new Error('Tidak ada respon teks dari model AI Gemini.');
    }

    const cleanJson = text.trim().replace(/^```json\s*/, '').replace(/```$/, '');
    const data: ExamData = JSON.parse(cleanJson);
    return data;
  } catch (error: any) {
    console.error('Gemini Generation Error:', error);
    throw new Error(error?.message || 'Gagal menghasilkan soal dengan AI.');
  }
}
