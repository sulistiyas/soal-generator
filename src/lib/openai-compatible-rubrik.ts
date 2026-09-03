import { KisiKisiRubrikData, KisiKisiRubrikGenerationRequest } from '@/types/rubrik';
import { AIProviderId } from '@/types/exam';

interface OpenAIRubrikParams {
  request: KisiKisiRubrikGenerationRequest;
  apiKey: string;
  provider: AIProviderId;
  model: string;
  baseUrl: string;
}

export async function generateKisiKisiRubrikWithOpenAICompatible({
  request,
  apiKey,
  provider,
  model,
  baseUrl,
}: OpenAIRubrikParams): Promise<KisiKisiRubrikData> {
  const getAssessmentLabel = (type: string) => {
    switch (type) {
      case 'formatif':
        return 'Asesmen Formatif / Ulangan Harian';
      case 'sumatif_materi':
        return 'Asesmen Sumatif Lingkup Materi';
      case 'sts':
        return 'Asesmen Sumatif Tengah Semester (STS / PTS)';
      case 'sas':
        return 'Asesmen Sumatif Akhir Semester (SAS / PAS / SAT)';
      case 'us':
        return 'Asesmen Akhir Jenjang / Ujian Sekolah';
      case 'kinerja':
        return 'Asesmen Kinerja / Unjuk Kerja / Ujian Praktik';
      case 'proyek':
        return 'Asesmen Proyek / P5 (Profil Pelajar Pancasila)';
      case 'portofolio':
        return 'Asesmen Produk / Portofolio';
      case 'sikap':
        return 'Asesmen Observasi Sikap & Profil Pelajar';
      default:
        return 'Asesmen Pembelajaran';
    }
  };

  const assessmentLabel = getAssessmentLabel(request.assessmentType);

  const activeQuestionTypes = Object.entries(request.questionTypesIncluded || {})
    .filter(([, v]) => v)
    .map(([k]) => {
      if (k === 'pg') return 'Pilihan Ganda';
      if (k === 'isian') return 'Isian Singkat';
      if (k === 'uraian') return 'Uraian / Essay';
      if (k === 'praktik') return 'Kinerja / Praktik';
      if (k === 'proyek') return 'Proyek / P5';
      return k;
    })
    .join(', ') || 'Pilihan Ganda dan Uraian';

  const systemMessage = `Anda adalah Pakar Asesmen Pendidikan dan Evaluasi Pembelajaran Resmi Kemendikbudristek Indonesia.
Tugas Anda adalah merancang dokumen Matriks Kisi-Kisi Soal (Test Blueprint), Rubrik Penilaian Analitik & Holistik, Pedoman Penskoran, dan Kriteria Ketercapaian Tujuan Pembelajaran (KKTP) yang sangat presisi, berbobot pedagogis tinggi, dan siap digunakan oleh guru di sekolah.

Prinsip Penyusunan Instrumen Evaluasi:
1. Keselarasan Konstruk: Kisi-kisi harus menjamin keselarasan antara Capaian Pembelajaran (CP) / KD, Materi Pokok, Indikator Soal, dan Level Kognitif.
2. Kaidah Indikator Soal (ABCD): Rumuskan indikator soal yang spesifik dan terukur (Audience, Behavior, Condition, Degree). Gunakan Kata Kerja Operasional (KKO) Taksonomi Bloom (C1-C6).
3. Proporsi Kognitif: Sesuaikan distribusi LOTS (C1-C2), MOTS (C3), dan HOTS (C4-C6).
4. Rubrik Analitik Operasional: Aspek penilaian harus jelas, dengan deskriptor kualitatif yang membedakan capaian Sangat Baik (Skor 4), Baik (Skor 3), Cukup (Skor 2), dan Perlu Bimbingan (Skor 1) secara operasional dan terukur.
5. Pedoman Penskoran Komprehensif: Sediakan kunci jawaban, langkah pengerjaan terperinci beserta bobot skor untuk setiap butir soal/aspek.
6. Interval KKTP & Tindak Lanjut: Sediakan rentang interval nilai dengan interpretasi ketuntasan dan intervensi tindak lanjut (remedial/pengayaan).
7. Format Output: Wajib menghasilkan JSON valid murni tanpa teks pengantar maupun markdown di luar JSON.`;

  const userMessage = `Susunlah dokumen Kisi-Kisi Soal dan Rubrik Penilaian lengkap dengan parameter berikut:
- Nama Sekolah: ${request.schoolName || 'Satuan Pendidikan'}
- Nama Guru: ${request.teacherName || 'Guru Mata Pelajaran'}
- NIP Guru: ${request.teacherNip || '-'}
- Nama Kepala Sekolah: ${request.headmasterName || 'Kepala Sekolah'}
- NIP Kepala Sekolah: ${request.headmasterNip || '-'}
- Jenjang: ${request.educationLevel.toUpperCase()}
- Fase / Kelas: ${request.phase} - ${request.grade}
- Mata Pelajaran: ${request.subject}
- Kurikulum: ${request.curriculum === 'merdeka' ? 'Kurikulum Merdeka' : 'Kurikulum 2013 (K-13)'}
- Semester: ${request.semester}
- Tahun Ajaran: ${request.academicYear}
- Jenis Asesmen: ${assessmentLabel}
- Alokasi Waktu: ${request.duration || '90 Menit'}
- Topik / Lingkup Materi: ${request.topic}
${request.subTopics ? `- Sub-topik / Bahasan Khusus: ${request.subTopics}` : ''}
${request.learningObjectives ? `- Tujuan Pembelajaran (TP) / Capaian: ${request.learningObjectives}` : ''}
- Total Butir Soal / Indikator: ${request.totalQuestions || 10} Soal
- Bentuk Soal yang Digunakan: ${activeQuestionTypes}
- Proporsi Tingkat Kesukaran Kognitif: LOTS ${request.difficultyRatio?.lots || 30}%, MOTS ${request.difficultyRatio?.mots || 40}%, HOTS ${request.difficultyRatio?.hots || 30}%
${request.rubricFocus ? `- Fokus Khusus Rubrik: ${request.rubricFocus}` : ''}
${request.additionalInstructions ? `- Catatan / Permintaan Khusus: ${request.additionalInstructions}` : ''}

STRUKTUR JSON YANG WAJIB DIHASILKAN (Kembalikan JSON valid):
{
  "identitas": {
    "namaSekolah": "${request.schoolName || 'Satuan Pendidikan'}",
    "mataPelajaran": "${request.subject}",
    "kelas": "${request.grade}",
    "fase": "${request.phase}",
    "kurikulum": "${request.curriculum}",
    "semester": "${request.semester}",
    "tahunAjaran": "${request.academicYear}",
    "jenisAsesmen": "${request.assessmentType}",
    "jenisAsesmenLabel": "${assessmentLabel}",
    "alokasiWaktu": "${request.duration || '90 Menit'}",
    "jumlahSoal": ${request.totalQuestions || 10},
    "namaGuru": "${request.teacherName || 'Guru Mata Pelajaran'}",
    "nipGuru": "${request.teacherNip || '-'}",
    "namaKepalaSekolah": "${request.headmasterName || 'Kepala Sekolah'}",
    "nipKepalaSekolah": "${request.headmasterNip || '-'}",
    "topikMateri": "${request.topic}",
    "subTopik": "${request.subTopics || ''}",
    "tujuanPembelajaran": "${request.learningObjectives || ''}"
  },
  "ringkasanKisiKisi": {
    "totalSoal": ${request.totalQuestions || 10},
    "distribusiBentuk": {
      "Pilihan Ganda": 5,
      "Isian Singkat": 2,
      "Uraian / Essay": 3
    },
    "distribusiLevel": {
      "lots": ${request.difficultyRatio?.lots || 30},
      "mots": ${request.difficultyRatio?.mots || 40},
      "hots": ${request.difficultyRatio?.hots || 30}
    }
  },
  "kisiKisi": [
    {
      "no": 1,
      "kdOrCp": "Capaian Pembelajaran / Kompetensi Dasar",
      "materi": "Materi Pokok",
      "subMateri": "Sub Materi",
      "indikatorSoal": "Indikator Soal berkaidah ABCD",
      "levelKognitif": "C4 (HOTS)",
      "bentukSoal": "Pilihan Ganda",
      "nomorSoal": "1",
      "bobotSkor": 2
    }
  ],
  "rubrikAnalitik": [
    {
      "aspect": "Aspek Penilaian",
      "weight": 25,
      "levels": [
        {
          "level": 4,
          "title": "Sangat Baik (4)",
          "scoreRange": "86 - 100",
          "descriptor": "Deskripsi operasional sangat baik"
        },
        {
          "level": 3,
          "title": "Baik (3)",
          "scoreRange": "71 - 85",
          "descriptor": "Deskripsi operasional baik"
        },
        {
          "level": 2,
          "title": "Cukup (2)",
          "scoreRange": "56 - 70",
          "descriptor": "Deskripsi operasional cukup"
        },
        {
          "level": 1,
          "title": "Perlu Bimbingan (1)",
          "scoreRange": "< 56",
          "descriptor": "Deskripsi operasional perlu bimbingan"
        }
      ]
    }
  ],
  "rubrikHolistik": [
    {
      "score": "4 (86-100)",
      "gradeLabel": "Sangat Mahir",
      "description": "Deskripsi kinerja sangat mahir"
    },
    {
      "score": "3 (71-85)",
      "gradeLabel": "Cakap",
      "description": "Deskripsi kinerja cakap"
    },
    {
      "score": "2 (56-70)",
      "gradeLabel": "Layak",
      "description": "Deskripsi kinerja layak"
    },
    {
      "score": "1 (< 56)",
      "gradeLabel": "Baru Memulai",
      "description": "Deskripsi kinerja baru memulai"
    }
  ],
  "pedomanPenskoran": [
    {
      "nomorSoal": 1,
      "indikator": "Indikator soal",
      "kunciJawaban": "Kunci jawaban terperinci",
      "langkahPenyelesaian": [
        {"step": "Langkah 1", "points": 1},
        {"step": "Langkah 2", "points": 2}
      ],
      "skorMaksimal": 5,
      "rubrikPenskoranSingkat": "Pedoman penskoran singkat"
    }
  ],
  "intervalKktp": [
    {
      "interval": "0 - 40%",
      "kategori": "Belum Mencapai Ketuntasan",
      "intervensi": "Remedial di seluruh bagian materi"
    },
    {
      "interval": "41 - 65%",
      "kategori": "Belum Mencapai Ketuntasan",
      "intervensi": "Remedial pada indikator tertentu"
    },
    {
      "interval": "66 - 85%",
      "kategori": "Sudah Mencapai Ketuntasan",
      "intervensi": "Tidak perlu remedial"
    },
    {
      "interval": "86 - 100%",
      "kategori": "Sudah Mencapai Ketuntasan (Pengayaan)",
      "intervensi": "Diberikan pengayaan / tugas tantangan"
    }
  ],
  "lembarPenilaianSiswa": {
    "columns": ["No", "Nama Siswa", "Kriteria 1", "Kriteria 2", "Kriteria 3", "Kriteria 4", "Total Skor", "Nilai Akhir", "Ketercapaian"],
    "maxTotalScore": 100,
    "sampleRows": [
      {
        "no": 1,
        "nama": "Ahmad Fauzi",
        "scores": [4, 3, 4, 3],
        "total": 14,
        "nilai": 88,
        "catatan": "Tuntas (Pengayaan)"
      }
    ]
  },
  "petunjukPenggunaan": [
    "Kisi-kisi ini disusun sebagai acuan pembuatan butir soal dan instrumen asesmen.",
    "Gunakan rubrik analitik untuk penilaian unjuk kerja atau tugas."
  ],
  "catatanGuru": "Disesuaikan dengan karakteristik peserta didik."
}`;

  let targetUrl = baseUrl;
  if (!targetUrl) {
    if (provider === 'groq') targetUrl = 'https://api.groq.com/openai/v1';
    else if (provider === 'openrouter') targetUrl = 'https://openrouter.ai/api/v1';
    else if (provider === 'deepseek') targetUrl = 'https://api.deepseek.com/v1';
    else if (provider === 'ollama') targetUrl = 'http://localhost:11434/v1';
    else targetUrl = 'https://api.openai.com/v1';
  }

  const endpoint = `${targetUrl.replace(/\/$/, '')}/chat/completions`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }

  if (provider === 'openrouter') {
    headers['HTTP-Referer'] = 'https://teacher-hub-edu.vercel.app';
    headers['X-Title'] = 'Teacher Hub - Rubrik AI';
  }

  const requestBody: Record<string, unknown> = {
    model: model,
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.3,
  };

  // Support JSON response format if available
  if (provider === 'openai' || provider === 'groq' || provider === 'deepseek') {
    requestBody.response_format = { type: 'json_object' };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(`Gagal memproses dengan ${provider} (${model}): ${errorMsg}`);
  }

  const result = await response.json();
  const rawContent = result.choices?.[0]?.message?.content || '';

  if (!rawContent) {
    throw new Error(`Tidak ada respon yang diterima dari provider ${provider}.`);
  }

  let cleanJson = rawContent.trim();
  cleanJson = cleanJson.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  cleanJson = cleanJson
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(cleanJson);
  } catch (e) {
    const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error(`Format JSON dari AI tidak valid: ${e instanceof Error ? e.message : 'Parse error'}`);
    }
  }

  return {
    id: 'rubrik-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 7),
    identitas: parsed.identitas || {
      namaSekolah: request.schoolName || 'Satuan Pendidikan',
      mataPelajaran: request.subject,
      kelas: request.grade,
      fase: request.phase,
      kurikulum: request.curriculum,
      semester: request.semester,
      tahunAjaran: request.academicYear,
      jenisAsesmen: request.assessmentType,
      jenisAsesmenLabel: assessmentLabel,
      alokasiWaktu: request.duration || '90 Menit',
      jumlahSoal: request.totalQuestions || 10,
      namaGuru: request.teacherName || 'Guru Mata Pelajaran',
      nipGuru: request.teacherNip || '-',
      namaKepalaSekolah: request.headmasterName || 'Kepala Sekolah',
      nipKepalaSekolah: request.headmasterNip || '-',
      topikMateri: request.topic,
      subTopik: request.subTopics || '',
      tujuanPembelajaran: request.learningObjectives || '',
    },
    ringkasanKisiKisi: parsed.ringkasanKisiKisi || {
      totalSoal: request.totalQuestions || 10,
      distribusiBentuk: { 'Pilihan Ganda': 5, Uraian: 5 },
      distribusiLevel: request.difficultyRatio || { lots: 30, mots: 40, hots: 30 },
    },
    kisiKisi: parsed.kisiKisi || [],
    rubrikAnalitik: parsed.rubrikAnalitik || [],
    rubrikHolistik: parsed.rubrikHolistik || [],
    pedomanPenskoran: parsed.pedomanPenskoran || [],
    intervalKktp: parsed.intervalKktp || [],
    lembarPenilaianSiswa: parsed.lembarPenilaianSiswa || {
      columns: ['No', 'Nama Siswa', 'Kriteria 1', 'Kriteria 2', 'Total Skor', 'Nilai'],
      maxTotalScore: 100,
      sampleRows: [],
    },
    petunjukPenggunaan: parsed.petunjukPenggunaan || [
      'Kisi-kisi digunakan sebagai panduan penulisan soal.',
      'Rubrik digunakan untuk memandu asesmen.',
    ],
    catatanGuru: parsed.catatanGuru || '',
    createdAt: new Date().toISOString(),
  };
}
